"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { GoogleLogin } from "@react-oauth/google";
import SharedFields from "../../../components/SharedFields";
import { Typography } from "@mui/material";
import AuthCard from "../../../components/AuthCard";
import api from "@/lib/api";

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
      const res = await api.auth.login(form);

      setMsg(res.message);
      const { user, token } = res;
      const role = user.role;
      console.log("Login response:", role);
      console.log("Login response token:", token);

      if (token) {
        Cookies.set("token", token, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
        if (role === "student") {
          router.push("/student/dashboard");
        } else if (role === "company") {
          router.push("/company/dashboard");
        }
      }
    } catch (err) {
      setMsg(err.response?.data?.error || "Login failed");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await api.auth.googleLogin({ tokenId: credentialResponse.credential });

      setMsg(res.message);
      const { user, token } = res;
      const role = user.role;
      if (token) {
        console.log("Google login response:", token);
        Cookies.set("token", token, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
        if (role === "student") {
          router.push("/student/dashboard");
        } else if (role === "company") {
          router.push("/company/dashboard");
        }
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
        <Typography
          align="center"
          variant="body2"
          sx={{ mt: 3, color: "#aaa" }}
        >
          Don’t have an account?{" "}
          <Link
            href="/signup"
            style={{ color: "#2a3b91", textDecoration: "none" }}
          >
            Sign up
          </Link>
        </Typography>
      }
      msg={msg}
    />
  );
}
