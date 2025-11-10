"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("signupEmail");
      if (!storedEmail) {
        router.replace("/signup"); // redirect if no email
      } else {
        setEmail(storedEmail);
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api.auth.verifyOtp({ email, otp });

      setMsg(res.message);
      const role = res.user?.role;
      console.log("OTP Verification response role:", role);
      localStorage.removeItem("signupEmail");
      if (role === "student") {
        router.push("/student/dashboard");
      } else if (role === "company") {
        router.push("/company/dashboard");
      }
    } catch (err) {
      setMsg(err.response?.data?.error || "Verification failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 400, margin: "2rem auto" }}
    >
      <h2>Verify OTP</h2>
      <input
        name="otp"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <button type="submit">Verify</button>
      <div>{msg}</div>
    </form>
  );
}
