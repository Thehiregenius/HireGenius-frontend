"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Container, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { ArrowBack, Refresh } from "@mui/icons-material";
import api from "@/lib/api";
import PortfolioNav from "@/components/portfolio/PortfolioNav";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import WorkExperience from "@/components/portfolio/WorkExperience";
import Skills from "@/components/portfolio/Skills";
import Projects from "@/components/portfolio/Projects";
import Achievements from "@/components/portfolio/Achievements";

export default function PortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [portfolio, setPortfolio] = useState(null);
  const [status, setStatus] = useState("loading"); // loading, pending, generating, completed, failed, not_found

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // Poll for status if portfolio is being generated
  useEffect(() => {
    if (status === "pending" || status === "generating") {
      const pollInterval = setInterval(() => {
        checkPortfolioStatus();
      }, 3000); // Check every 3 seconds

      return () => clearInterval(pollInterval);
    }
  }, [status]);

  const checkPortfolioStatus = async () => {
    try {
      const data = await api.portfolio.getPortfolioStatus();
      
      if (data.status === "completed") {
        // Refetch the full portfolio
        fetchPortfolio();
      } else {
        setStatus(data.status);
      }
    } catch (err) {
      console.error("Status check error:", err);
    }
  };

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await api.portfolio.getPortfolio();
      
      if (data.status === "completed" && data.data) {
        setPortfolio(data.data);
        setStatus("completed");
      } else if (data.status === "pending" || data.status === "generating") {
        setStatus(data.status);
      } else if (data.status === "failed") {
        setStatus("failed");
        setError(data.error || "Portfolio generation failed");
      }
    } catch (err) {
      console.error("Portfolio fetch error:", err);
      
      const errorStatus = err.response?.status;
      
      if (errorStatus === 404) {
        setStatus("not_found");
        setError(
          err.response?.data?.message || 
          "Portfolio has not been generated yet. Please add GitHub/LinkedIn URLs and wait for crawling to complete."
        );
      } else if (errorStatus === 202) {
        // Portfolio is being generated
        const responseData = err.response?.data;
        setStatus(responseData?.status || "generating");
      } else {
        setStatus("failed");
        setError(
          err.response?.data?.error ||
          "Unable to fetch portfolio. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setLoading(true);
      setError("");
      await api.portfolio.regeneratePortfolio();
      setStatus("pending");
      // Start polling
      setTimeout(checkPortfolioStatus, 3000);
    } catch (err) {
      console.error("Regeneration error:", err);
      setError(err.response?.data?.error || "Failed to trigger regeneration");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && status === "loading") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f8f9fa",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#667eea", mb: 3 }} />
        <Typography variant="h6" sx={{ color: "#666" }}>
          Loading your portfolio...
        </Typography>
      </Box>
    );
  }

  // Portfolio is being generated
  if (status === "pending" || status === "generating") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f8f9fa",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#667eea", mb: 3 }} />
        <Typography variant="h6" sx={{ color: "#666" }}>
          {status === "pending" ? "Portfolio generation queued..." : "Generating your portfolio..."}
        </Typography>
        <Typography variant="body2" sx={{ color: "#999", mt: 1 }}>
          This may take a few moments. The page will auto-refresh when ready.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => router.push("/student/profile")}
          sx={{
            mt: 3,
            textTransform: "none",
            borderColor: "#667eea",
            color: "#667eea",
            "&:hover": { borderColor: "#5568d3", bgcolor: "rgba(102, 126, 234, 0.04)" },
          }}
        >
          Back to Profile
        </Button>
      </Box>
    );
  }

  // Error or not found state
  if (error || status === "failed" || status === "not_found") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f8f9fa",
          px: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: "#d32f2f", mb: 2, textAlign: "center" }}
        >
          {error}
        </Typography>
        
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push("/student/profile")}
            sx={{
              textTransform: "none",
              borderColor: "#667eea",
              color: "#667eea",
              "&:hover": { borderColor: "#5568d3", bgcolor: "rgba(102, 126, 234, 0.04)" },
            }}
          >
            Back to Profile
          </Button>
          
          {status === "failed" && (
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={handleRegenerate}
              sx={{
                bgcolor: "#667eea",
                "&:hover": { bgcolor: "#5568d3" },
                textTransform: "none",
              }}
            >
              Retry Generation
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  // Completed portfolio display
  if (!portfolio) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f8f9fa",
        }}
      >
        <Typography variant="h6" sx={{ color: "#666" }}>
          No portfolio data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Back Button (Fixed) */}
      <Box
        sx={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          size="small"
          startIcon={<ArrowBack />}
          onClick={() => router.push("/student/profile")}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.95)",
            color: "#667eea",
            backdropFilter: "blur(10px)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: "#fff",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            },
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Back
        </Button>
      </Box>

      {/* Portfolio Navigation */}
      <PortfolioNav />

      {/* Portfolio Header */}
      <PortfolioHeader portfolio={portfolio} />

      {/* Work Experience */}
      {portfolio.workExperience && portfolio.workExperience.length > 0 && (
        <WorkExperience experiences={portfolio.workExperience} />
      )}

      {/* Skills */}
      {portfolio.skills && portfolio.skills.length > 0 && (
        <Skills skills={portfolio.skills} />
      )}

      {/* Projects */}
      {portfolio.projects && portfolio.projects.length > 0 && (
        <Projects projects={portfolio.projects} />
      )}

      {/* Achievements */}
      {portfolio.achievements && portfolio.achievements.length > 0 && (
        <Achievements achievements={portfolio.achievements} />
      )}

      {/* Footer */}
      <Box
        sx={{
          py: 4,
          bgcolor: "#667eea",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2">
            © {new Date().getFullYear()} {portfolio.name}. Generated with HireGenius.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
