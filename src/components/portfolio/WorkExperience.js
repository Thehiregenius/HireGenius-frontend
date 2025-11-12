"use client";

import React from "react";
import { Box, Container, Typography, Card, CardContent, Chip } from "@mui/material";
import { Work } from "@mui/icons-material";

export default function WorkExperience({ experiences }) {
  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <Box id="work-experience" sx={{ py: { xs: 6, md: 8 }, bgcolor: "#f8f9fa" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Work sx={{ fontSize: 40, color: "#667eea" }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            Work Experience
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {experiences.map((exp, index) => (
            <Card
              key={index}
              sx={{
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: "#667eea",
                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                  }}
                >
                  {exp.title}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    color: "#666",
                    fontSize: { xs: "1rem", md: "1.25rem" },
                  }}
                >
                  {exp.company}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#999",
                    mb: 2,
                    fontSize: { xs: "0.875rem", md: "1rem" },
                  }}
                >
                  {exp.duration} {exp.location && `• ${exp.location}`}
                </Typography>
                {exp.description && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#555",
                      lineHeight: 1.7,
                      fontSize: { xs: "0.95rem", md: "1rem" },
                    }}
                  >
                    {exp.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
