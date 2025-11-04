"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../../../configs/constants";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  // ✅ Get stored email from localStorage (from signup step)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("signupEmail");
      if (!storedEmail) {
        router.replace("/signup"); // redirect if no email found
      } else {
        setEmail(storedEmail);
      }
    }
  }, [router]);

  // ✅ Submit OTP verification
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await axios.post(
        `${BASE_URL}/verify-otp`,
        { email, otp },
        { withCredentials: true } // ✅ ensures cookie (token) is included
      );

      setMsg(res.data.message);

      const role = res.data.user?.role;
      console.log("✅ OTP verified. Role:", role);

      // Clear temporary email
      localStorage.removeItem("signupEmail");

      // ✅ No need to handle token — it's already in cookie
      if (role === "student") {
        router.push("/student/dashboard");
      } else if (role === "company") {
        router.push("/company/dashboard");
      } else {
        router.push("/"); // fallback
      }

    } catch (err) {
      console.error("❌ OTP verification error:", err);
      setMsg(err.response?.data?.error || "Verification failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 400, margin: "2rem auto", display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <h2>Verify OTP</h2>

      <input
        type="text"
        name="otp"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />

      <button type="submit">Verify</button>

      {msg && <div>{msg}</div>}
    </form>
  );
}
