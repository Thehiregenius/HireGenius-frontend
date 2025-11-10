// ...existing code...
"use client";
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import api from "@/lib/api";
import AvatarUpload from "@/components/AvatarUpload";
import ProfileForm from "@/components/ProfileForm";
import Notification from "@/components/Notification";

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

  async function handleAvatarUpload(file) {
    const previewUrl = URL.createObjectURL(file);
    setProfile((p) => ({ ...p, avatar: previewUrl }));

    try {
      setSaving(true);
      const data = await api.profile.updateAvatar({
        file,
        name: profile.name,
        githubUrl: profile.githubUrl,
        linkedinUrl: profile.linkedinUrl
      });

      if (data?.profile) {
        setProfile(data.profile);
        setOrigProfile(data.profile);
        setSnack({ open: true, severity: "success", message: "Avatar uploaded" });
      } else if (data?.avatar) {
        const updatedProfile = { ...profile, avatar: data.avatar };
        setProfile(updatedProfile);
        setOrigProfile(updatedProfile);
        setSnack({ open: true, severity: "success", message: "Avatar uploaded" });
      } else {
        await reloadProfile();
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
      setSnack({
        open: true,
        severity: "error",
        message: err.response?.data?.error || "Avatar upload failed",
      });
      setProfile((p) => ({ ...p, avatar: origProfile?.avatar || "" }));
    } finally {
      setSaving(false);
      try { URL.revokeObjectURL(previewUrl); } catch (_) {}
    }
  }

  function handleRemoveAvatar() {
    setProfile((p) => ({ ...p, avatar: "" }));
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <AvatarUpload
            avatar={profile.avatar}
            name={profile.name}
            onUpload={handleAvatarUpload}
            onRemove={handleRemoveAvatar}
            isLoading={saving}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <ProfileForm
            profile={profile}
            isDirty={isDirty()}
            isSaving={saving}
            onFieldChange={handleChange}
            onSave={handleSave}
          />
        </Grid>
      </Grid>

      <Notification
        open={snack.open}
        severity={snack.severity}
        message={snack.message}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      />
    </Box>
  );
}