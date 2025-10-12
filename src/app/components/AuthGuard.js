"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function AuthGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    let expired = true;

    if (token) {
      try {
        const decoded =jwtDecode(token);
        // Check if token is expired (exp is in seconds)
        expired = decoded.exp * 1000 < Date.now();
      } catch {
        expired = true;
      }
    }

    if (!token || expired) {
      localStorage.removeItem("token");
      router.replace("/signup");
    }
  }, [router]);

  return children;
}