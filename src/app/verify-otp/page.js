"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const email = typeof window !== "undefined" ? localStorage.getItem("signupEmail") : "";

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/verify-otp", { email, otp });
      setMsg(res.data.message);
      if (res.data.token) {
        localStorage.removeItem("signupEmail");
        localStorage.setItem("token", res.data.token);
        router.push("/");
      }
    } catch (err) {
      setMsg(err.response?.data?.error || "Verification failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Verify OTP</h2>
      <input
        name="otp"
        placeholder="Enter OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
        required
      />
      <button type="submit">Verify</button>
      <div>{msg}</div>
    </form>
  );
}