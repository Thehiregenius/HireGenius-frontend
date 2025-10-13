"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

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

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post(
        "http://localhost:5000/verify-otp",
        { email, otp },
        { withCredentials: true } // ✅ important for cookie
      );

      setMsg(res.data.message);

      // OTP verified successfully
      localStorage.removeItem("signupEmail");
      router.push("/"); // token cookie is already set by backend

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