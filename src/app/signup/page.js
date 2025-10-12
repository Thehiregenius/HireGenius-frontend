"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import {
  TextField,
  Button,
  Typography,
  Divider,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

import SharedFields from "../components/SharedFields";

import AuthCard from "../components/AuthCard";
export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/signup", form);
      setMsg(res.data.message);
      if (res.data.message?.includes("OTP")) {
        localStorage.setItem("signupEmail", form.email);
        router.push("/verify-otp");
      }
    } catch (err) {
      setMsg(err.response?.data?.error || "Signup failed");
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/google-signup", {
        tokenId: credentialResponse.credential,
      });
      setMsg(res.data.message);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        router.push("/");
      }
    } catch (err) {
      setMsg(err.response?.data?.error || "Google signup failed");
    }
  };

  return (

    <AuthCard
      title="Sign Up"
      fields={
        <>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
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
          <SharedFields form={form} handleChange={handleChange} />
      
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label" sx={{ color: "#eee" }}>
              Role
            </InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={form.role}
              label="Role"
              onChange={handleChange}
              sx={{
                color: "#fff",
                background: "#232526",
                borderRadius: "12px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                  background: "#2c2f34",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                  background: "#2c2f34",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#232526",
                    color: "#fff",
                  },
                },
              }}
            >
              <MenuItem value="student" sx={{ bgcolor: "#232526", color: "#fff" }}>
                Student
              </MenuItem>
              <MenuItem value="company" sx={{ bgcolor: "#232526", color: "#fff" }}>
                Company
              </MenuItem>
            </Select>
          </FormControl>
        </>
      }
      onSubmit={handleSubmit}
      buttonText="Sign Up"
      googleHandler={
        <GoogleLogin
          onSuccess={handleGoogleSignup}
          onError={() => setMsg("Google signup failed")}
        />
      }
      bottomText={
        <Typography align="center" variant="body2" sx={{ mt: 3, color: "#aaa" }}>
          Have an account?{" "}
          <Link href="/login" style={{ color: "#1976d2", fontWeight: 600, textDecoration: "none" }}>
            Login
          </Link>
        </Typography>
      }
      msg={msg}
    />

  );
}