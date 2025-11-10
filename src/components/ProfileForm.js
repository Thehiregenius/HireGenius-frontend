import React from "react";
import { Box, TextField, Button, Divider } from "@mui/material";

export default function ProfileForm({
  profile,
  isDirty,
  isSaving,
  onFieldChange,
  onSave,
}) {
  return (
    <Box component="form" onSubmit={onSave}>
      <TextField
        label="Name"
        name="name"
        value={profile.name}
        onChange={onFieldChange}
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
        onChange={onFieldChange}
        fullWidth
        margin="normal"
        placeholder="https://github.com/username"
      />

      <TextField
        label="LinkedIn URL"
        name="linkedinUrl"
        value={profile.linkedinUrl}
        onChange={onFieldChange}
        fullWidth
        margin="normal"
        placeholder="https://linkedin.com/in/username"
      />

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button type="submit" variant="contained" disabled={isSaving || !isDirty}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </Box>
    </Box>
  );
}