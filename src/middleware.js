// src/middleware.js
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(req) {
  const token = req.cookies.get("token")?.value; // read token from cookies
  const url = req.nextUrl.pathname;

  // Auth routes that shouldn't be accessed when logged in
// const authRoutes = ["/login", "/signup"];


  // Protected routes
  const protectedRoutes = ["/home", "/", "/company", "/student"];

  // If accessing protected route without token → redirect to signup
   if (protectedRoutes.some((path) => url === path || url.startsWith(path + "/")) && !token) {
    return NextResponse.redirect(new URL("/signup", req.url));
  }

  // If token exists but expired → redirect to signup
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const expired = decoded.exp * 1000 < Date.now();
      if (expired) {
        const response = NextResponse.redirect(new URL("/signup", req.url));
        response.cookies.delete("token");
        return response;
      }
    } catch {
      const response = NextResponse.redirect(new URL("/signup", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // If user is logged in and tries to access /login or /signup → redirect to home
//     if (authRoutes.some((path) => url === path || url.startsWith(path + "/")) && token) {
//     return NextResponse.redirect(new URL("/home", req.url));
//   }

  // Otherwise allow
  return NextResponse.next();
}

// Paths middleware applies to
export const config = {
  matcher: [
    "/home/:path*",
    "/login",
    "/signup",
    "/",
    "/company/:path*",
    "/student/:path*",
  ],
};
