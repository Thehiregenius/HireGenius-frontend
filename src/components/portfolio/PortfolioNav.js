"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Container,
} from "@mui/material";
import { Menu as MenuIcon, Person, Work, Code, Folder, EmojiEvents } from "@mui/icons-material";

const navItems = [
  { label: "Profile", id: "profile", icon: <Person /> },
  { label: "Experience", id: "work-experience", icon: <Work /> },
  { label: "Skills", id: "skills", icon: <Code /> },
  { label: "Projects", id: "projects", icon: <Folder /> },
  { label: "Achievements", id: "achievements", icon: <EmojiEvents /> },
];

export default function PortfolioNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // AppBar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setMobileOpen(false);
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {navItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              onClick={() => scrollToSection(item.id)}
              selected={activeSection === item.id}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "#f0f4ff",
                  color: "#667eea",
                  "&:hover": { bgcolor: "#e0e7ff" },
                },
              }}
            >
              <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>{item.icon}</Box>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          color: "#333",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between", px: { xs: 0 } }}>
            {/* Mobile menu button */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: "inline-flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Desktop navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
                width: "100%",
                justifyContent: "center",
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  startIcon={item.icon}
                  sx={{
                    color: activeSection === item.id ? "#667eea" : "#666",
                    fontWeight: activeSection === item.id ? 600 : 400,
                    textTransform: "none",
                    fontSize: "1rem",
                    px: 2,
                    borderBottom: activeSection === item.id ? "2px solid #667eea" : "2px solid transparent",
                    borderRadius: 0,
                    "&:hover": {
                      bgcolor: "#f0f4ff",
                      borderBottom: "2px solid #667eea",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
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
    </>
  );
}
