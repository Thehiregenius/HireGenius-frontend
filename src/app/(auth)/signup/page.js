"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import {
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import SharedFields from "../../../components/SharedFields";
import AuthCard from "../../../components/AuthCard";
import api from "@/lib/api";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api.auth.signup(form);

      setMsg(res.message);

      // OTP flow
      if (res.message?.includes("OTP")) {
        localStorage.setItem("signupEmail", form.email);
        router.push("/verify-otp");
      }
    } catch (err) {
      setMsg(err.response?.data?.error || "Signup failed");
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const res = await api.auth.googleSignup({
        tokenId: credentialResponse.credential,
      });

      setMsg(res.message);

      const role = res.user?.role;
      console.log("OTP Verification response role:", role);

      if (role === "student") {
        router.push("/student/dashboard");
      } else if (role === "company") {
        router.push("/company/dashboard");
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
              input: {
                "&:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px white inset",
                  WebkitTextFillColor: "#000",
                },
              },
            }}
          />
          <SharedFields form={form} handleChange={handleChange} />

          <FormControl fullWidth margin="normal">

            <InputLabel id="role-label" sx={{ color: "#000000ff" }}>
              Role
            </InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={form.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="company">Company</MenuItem>
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
        <Typography
          align="center"
          variant="body2"
          sx={{ mt: 3, color: "#aaa" }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{ color: "#2a3b91", textDecoration: "none" }}
          >
            Login
          </Link>
        </Typography>
      }
      msg={msg}
    />
  );
}
