// ...existing code...
"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Grid,
  Avatar,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  IconButton,
  Badge,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import api from "@/lib/apiClient";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    avatar: "",
    email: "",
    role: "",
    githubUrl: "",
    linkedinUrl: "",
  });
  const [origProfile, setOrigProfile] = useState(null);
  const [snack, setSnack] = useState({
    open: false,
    severity: "info",
    message: "",
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await api.get(`/profile`);
        const data = res.data;
        if (!mounted) return;
        const p = {
          name: data.name || "",
          avatar: data.avatar || "",
          email: data.email || "",
          role: data.role || "",
          githubUrl: data.githubUrl || "",
          linkedinUrl: data.linkedinUrl || "",
        };
        setProfile(p);
        setOrigProfile(p);
      } catch (err) {
        console.error("Load profile error:", err);
        setSnack({
          open: true,
          severity: "error",
          message: err.response?.data?.error || "Unable to load profile",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  }

  function isDirty() {
    if (!origProfile) return true;
    return (
      profile.name !== origProfile.name ||
      profile.avatar !== origProfile.avatar ||
      profile.githubUrl !== origProfile.githubUrl ||
      profile.linkedinUrl !== origProfile.linkedinUrl
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!profile.name || profile.name.trim().length < 2) {
      setSnack({
        open: true,
        severity: "warning",
        message: "Name must be at least 2 characters",
      });
      return;
    }
    setSaving(true);
    try {
      // send JSON when not uploading a file
      const res = await api.patch(`/profile`, {
        name: profile.name,
        avatar: profile.avatar,
        githubUrl: profile.githubUrl,
        linkedinUrl: profile.linkedinUrl,
      });
      const data = res.data;
      setSnack({ open: true, severity: "success", message: "Profile saved" });
      const saved = {
        name: data?.profile?.name ?? profile.name,
        avatar: data?.profile?.avatar ?? profile.avatar,
        githubUrl: data?.profile?.githubUrl ?? profile.githubUrl,
        linkedinUrl: data?.profile?.linkedinUrl ?? profile.linkedinUrl,
      };
      setOrigProfile(saved);
      setProfile((p) => ({ ...p, ...saved }));
    } catch (err) {
      console.error("Save profile error:", err);
      setSnack({
        open: true,
        severity: "error",
        message: err.response?.data?.error || "Failed to save profile",
      });
    } finally {
      setSaving(false);
    }
  }

  async function reloadProfile() {
    setLoading(true);
    try {
      const res = await api.get(`/profile`);
      const data = res.data;
      const p = {
        name: data.name || "",
        avatar: data.avatar || "",
        email: data.email || "",
        role: data.role || "",
        githubUrl: data.githubUrl || "",
        linkedinUrl: data.linkedinUrl || "",
      };
      setProfile(p);
      setOrigProfile(p);
      setSnack({ open: true, severity: "success", message: "Reloaded" });
    } catch (err) {
      console.error("Reload error:", err);
      setSnack({
        open: true,
        severity: "error",
        message: err.response?.data?.error || "Failed to reload",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleAvatarClick() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setSnack({ open: true, severity: "warning", message: "Please select PNG or JPG image" });
      return;
    }

    // show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setProfile((p) => ({ ...p, avatar: previewUrl }));

    // upload via multipart/form-data to /profile (backend must accept multipart)
    const form = new FormData();
    form.append("avatar", file);
    // include other fields optionally if you want server to update them as well
    form.append("name", profile.name || "");
    form.append("githubUrl", profile.githubUrl || "");
    form.append("linkedinUrl", profile.linkedinUrl || "");

    try {
      setSaving(true);
      const res = await api.patch(`/profile`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = res.data;
      const newAvatar = data?.profile?.avatar ?? data?.avatar ?? null;
      if (newAvatar) {
        setProfile((p) => ({ ...p, avatar: newAvatar }));
        setOrigProfile((o) => (o ? { ...o, avatar: newAvatar } : o));
        setSnack({ open: true, severity: "success", message: "Avatar uploaded" });
      } else {
        // If backend didn't return URL, keep preview but notify user
        setSnack({ open: true, severity: "success", message: "Uploaded — refresh to see change" });
      }
    } catch (err) {
      console.error("Avatar upload error", err);
      setSnack({
        open: true,
        severity: "error",
        message: err.response?.data?.error || "Avatar upload failed",
      });
      // revert preview
      setProfile((p) => ({ ...p, avatar: origProfile?.avatar || "" }));
    } finally {
      setSaving(false);
      setTimeout(() => {
        try { URL.revokeObjectURL(previewUrl); } catch (_) {}
      }, 5000);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 920, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Your Profile
      </Typography>

      <Box component="form" onSubmit={handleSave}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <IconButton
                    size="small"
                    onClick={handleAvatarClick}
                    sx={{ bgcolor: "background.paper", boxShadow: 1 }}
                    aria-label="edit avatar"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                }
              >
                <Avatar
                  src={profile.avatar || undefined}
                  alt={profile.name || "Avatar"}
                  sx={{ width: 140, height: 140 }}
                >
                  {!profile.avatar && (profile.name ? profile.name.charAt(0).toUpperCase() : "A")}
                </Avatar>
              </Badge>

              {/* keep remove button if you want user to clear avatar */}
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setProfile((p) => ({ ...p, avatar: "" }));
                }}
              >
                Remove Avatar
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              label="Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />

            <TextField
              label="Email"
              value={profile.email}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Role"
              value={profile.role}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />

            <Divider sx={{ my: 2 }} />

            <TextField
              label="GitHub URL"
              name="githubUrl"
              value={profile.githubUrl}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="https://github.com/username"
            />

            <TextField
              label="LinkedIn URL"
              name="linkedinUrl"
              value={profile.linkedinUrl}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="https://linkedin.com/in/username"
            />

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button type="submit" variant="contained" disabled={saving || !isDirty()}>
                {saving ? "Saving..." : "Save changes"}
              </Button>

              <Button
                variant="outlined"
                onClick={() => {
                  if (origProfile) setProfile(origProfile);
                  setSnack({
                    open: true,
                    severity: "info",
                    message: "Reverted changes",
                  });
                }}
              >
                Revert
              </Button>

              <Button color="inherit" onClick={reloadProfile}>
                Reload
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}