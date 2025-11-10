"use client";
import React, { useRef } from "react";
import { Box, Button, IconButton, Badge, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function AvatarUpload({ 
  avatar, 
  name, 
  onUpload, 
  onRemove, 
  isLoading = false 
}) {
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Please select PNG or JPG image");
      return;
    }

    // Call parent's upload handler with the file
    await onUpload(file);
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
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
            disabled={isLoading}
            sx={{ bgcolor: "background.paper", boxShadow: 1 }}
            aria-label="edit avatar"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        }
      >
        <Avatar
          src={avatar || undefined}
          alt={name || "Avatar"}
          sx={{ width: 140, height: 140 }}
        >
          {!avatar && (name ? name.charAt(0).toUpperCase() : "A")}
        </Avatar>
      </Badge>

      <Button
        variant="outlined"
        size="small"
        onClick={onRemove}
        disabled={isLoading}
      >
        Remove Avatar
      </Button>
    </Box>
  );
}
