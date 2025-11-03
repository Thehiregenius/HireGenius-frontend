// src/lib/auth.js
import { jwtDecode } from "jwt-decode";

export function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  
  // Debug: log all cookies
  console.log('All cookies:', document.cookie);
  
  const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
  console.log('Cookie match result:', match);
  
  const token = match ? match[2] : null;
  console.log('Extracted token:', token ? `${token.slice(0, 10)}...` : 'null');
  
  return token;
}

export function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
