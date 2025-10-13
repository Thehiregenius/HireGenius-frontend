import { TextField } from "@mui/material";

export default function SharedFields({ form, handleChange }) {
  return (
    <>
      <TextField
        fullWidth
        margin="normal"
        label="Enter your email address"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
        type="email"
        variant="outlined"
        sx={{ p:0, color: "#000"  }}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Enter your password"
        name="password"
        value={form.password}
        onChange={handleChange}
        required
        type="password"
        variant="outlined"
        sx={{  color: "#000"  }}
      />
    </>
  );
}