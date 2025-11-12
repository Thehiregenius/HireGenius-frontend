"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider, CssBaseline, createTheme, Box } from "@mui/material";
import StudentNav from "@/components/Navigation";
import "./globals.css";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "HireGenius",
//   description: "Smart hiring made easy",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <StudentNav />
            <Box component="main" sx={{ minHeight: '100vh' }}>
              {children}
            </Box>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}