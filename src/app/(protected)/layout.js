// src/app/(protected)/layout.js
"use client";

export default function ProtectedLayout({ children }) {
  // No need to check token here; middleware handles it
  return <>{children}</>;
}
