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
      // const role = res.data.role;
      const role = res.data.user?.role;
      console.log("OTP Verification response role:", role); // Debugging line
      // OTP verified successfully
      localStorage.removeItem("signupEmail");
      // router.push("/"); // token cookie is already set by backend
      if(role === "student") {
        router.push("/student/dashboard");
      }   else if(role === "company") {
        router.push("/company/dashboard");
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