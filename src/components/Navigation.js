"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function StudentNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Determine when to show the nav
  const isAuthRoute = pathname === "/login" || pathname === "/signup" || pathname === "/verify-otp";
  const isHome = pathname === "/";
  const isStudent = pathname?.startsWith("/student");
  const isCompany = pathname?.startsWith("/company");
  const showNav = (isHome || isStudent || isCompany) && !isAuthRoute;

  // Fetch user role from API
  useEffect(() => {
    let cancelled = false;
    
    async function fetchUserRole() {
      if (!showNav) {
        setLoadingRole(false);
        return;
      }

      try {
        setLoadingRole(true);
        const data = await api.profile.getProfile();
        
        if (!cancelled && data) {
          console.log("User role from API:", data.role); // Debug log
          setRole(data.role);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        // User not authenticated
        if (!cancelled) {
          setRole(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (!cancelled) {
          setLoadingRole(false);
        }
      }
    }

    fetchUserRole();
    
    return () => {
      cancelled = true;
    };
  }, [showNav]);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  // Build navigation items based on user role
  const navItems = React.useMemo(() => {
    const items = [{ label: "Home", href: "/" }];
    
    if (role === "student") {
      items.push(
        { label: "Dashboard", href: "/student/dashboard" },
        { label: "Profile", href: "/student/profile" }
      );
    } else if (role === "company") {
      items.push(
        { label: "Dashboard", href: "/company/dashboard" },
        { label: "Profile", href: "/company/profile" }
      );
    }
    
    // Show Login link if not authenticated
    if (!isAuthenticated && !loadingRole) {
      items.push({ label: "Login", href: "/login" });
    }
    
    return items;
  }, [role, isAuthenticated, loadingRole]);

  async function handleLogout() {
    try {
      await api.auth.logout();
    } catch (_) {
      // ignore errors and still route to login
    }
    router.push("/login");
  }

  if (!showNav) return null;

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={Link} href={item.href} selected={pathname === item.href}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" color="primary" sx={{ top: 0 }}>
        <Toolbar>
          {/* Mobile menu button */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: "inline-flex", md: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          {/* Brand / Title */}
          <Typography variant="h6" component={Link} href="/" sx={{ flexGrow: 1, color: "inherit", textDecoration: "none" }}>
            HireGenius
          </Typography>

          {/* Desktop links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                component={Link}
                href={item.href}
                sx={{
                  fontWeight: pathname === item.href ? 700 : 400,
                  textTransform: "none",
                }}
              >
                {item.label}
              </Button>
            ))}
            
            {isAuthenticated && (
              <Button color="inherit" onClick={handleLogout} sx={{ textTransform: "none" }}>
                Logout
              </Button>
            )}

            {loadingRole && (
              <CircularProgress
                size={20}
                sx={{ ml: 1, color: "rgba(255,255,255,0.7)" }}
              />
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
