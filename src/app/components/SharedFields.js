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
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            background: "#232526",
            color: "#fff",
            "& fieldset": { borderColor: "#fff" },
            "&:hover fieldset": { borderColor: "#fff", background: "#2c2f34" },
            "&.Mui-focused fieldset": { borderColor: "#fff", background: "#2c2f34" },
          },
          "& .MuiInputLabel-root": { color: "#eee" },
          "& .MuiInputBase-input": { color: "#fff" },
        }}
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
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            background: "#232526",
            color: "#fff",
            "& fieldset": { borderColor: "#fff" },
            "&:hover fieldset": { borderColor: "#fff", background: "#2c2f34" },
            "&.Mui-focused fieldset": { borderColor: "#fff", background: "#2c2f34" },
          },
          "& .MuiInputLabel-root": { color: "#eee" },
          "& .MuiInputBase-input": { color: "#fff" },
        }}
      />
    </>
  );
}