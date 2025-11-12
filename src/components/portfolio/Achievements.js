"use client";

import React from "react";
import { Box, Container, Typography, Card, CardContent, Chip } from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";

export default function Achievements({ achievements }) {
  if (!achievements || achievements.length === 0) {
    return null;
  }

  return (
    <Box id="achievements" sx={{ py: { xs: 6, md: 8 }, bgcolor: "#fff" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <EmojiEvents sx={{ fontSize: 40, color: "#FFD700" }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            Achievements & Certifications
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 3,
          }}
        >
          {achievements.map((achievement, index) => (
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
                <Chip
                  label={achievement.type}
                  size="small"
                  sx={{
                    mb: 2,
                    bgcolor: "#fff4e6",
                    color: "#f57c00",
                    fontWeight: 600,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: "#333",
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                  }}
                >
                  {achievement.title}
                </Typography>
                {achievement.issuer && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      mb: 1,
                      fontSize: { xs: "0.875rem", md: "1rem" },
                    }}
                  >
                    {achievement.issuer}
                  </Typography>
                )}
                {achievement.date && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#999",
                      display: "block",
                      mb: 2,
                      fontSize: { xs: "0.8rem", md: "0.875rem" },
                    }}
                  >
                    {achievement.date}
                  </Typography>
                )}
                {achievement.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#555",
                      lineHeight: 1.6,
                      fontSize: { xs: "0.875rem", md: "0.95rem" },
                    }}
                  >
                    {achievement.description}
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
