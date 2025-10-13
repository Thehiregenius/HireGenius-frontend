"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { GoogleLogin } from "@react-oauth/google";
import SharedFields from "../../../components/SharedFields";
import {
  Typography,
  
} from "@mui/material";
import AuthCard from "../../../components/AuthCard";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await axios.post(
        "http://localhost:5000/login",
        form,
        { withCredentials: true } // important for cookies
      );

      setMsg(res.data.message);
      if (res.data.token) {
        // Store token in cookie instead of localStorage
        Cookies.set("token", res.data.token, {
          expires: 7, // expires in 7 days
          secure: true,
          sameSite: "Strict",
        });
        router.push("/");
      }
    } catch (err) {
      setMsg(err.response?.data?.error || "Login failed");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/google-login",
        { tokenId: credentialResponse.credential },
        { withCredentials: true }
      );

      setMsg(res.data.message);
      if (res.data.token) {
        console.log("Google login response:", res.data.token); // Debugging line
        Cookies.set("token", res.data.token, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
        router
        .push("/home");
        console.log("Google login successful, token stored in cookie"); 
      }
    } catch (err) {
      setMsg(err.response?.data?.error || "Google signup failed");
    }
  };


  return (

    <AuthCard
      title="Log in"
      fields={
        <>
          <SharedFields form={form} handleChange={handleChange} />
        </>
      }
      onSubmit={handleSubmit}
      buttonText="Log in"
      googleHandler={
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => setMsg("Google signup failed")}
        />
      }
      bottomText={
        <Typography align="center" variant="body2" sx={{ mt: 3, color: "#aaa" }}>
          Don’t have an account?{" "}
          <Link href="/signup" style={{ color: "#1976d2", textDecoration: "none" }}>
            Sign up
          </Link>
        </Typography>
      }
      msg={msg}
    />
  

  );
}