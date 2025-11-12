"use client";

import React from "react";
import { Box, Container, Typography, Chip } from "@mui/material";
import { Code } from "@mui/icons-material";

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <Box id="skills" sx={{ py: { xs: 6, md: 8 }, bgcolor: "#fff" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Code sx={{ fontSize: 40, color: "#764ba2" }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            Skills & Technologies
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              sx={{
                fontSize: { xs: "0.875rem", md: "1rem" },
                py: { xs: 2, md: 2.5 },
                px: { xs: 1, md: 1.5 },
                bgcolor: "#f0f4ff",
                color: "#667eea",
                fontWeight: 500,
                border: "2px solid #e0e7ff",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#667eea",
                  color: "#fff",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                },
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
