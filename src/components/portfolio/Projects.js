"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
} from "@mui/material";
import { Folder, Star, GitHub as GitHubIcon } from "@mui/icons-material";

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <Box id="projects" sx={{ py: { xs: 6, md: 8 }, bgcolor: "#f8f9fa" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Folder sx={{ fontSize: 40, color: "#667eea" }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            Projects
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {projects.map((project, index) => (
            <Card
              key={index}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: "#333",
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                  }}
                >
                  {project.name}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    mb: 2,
                    lineHeight: 1.6,
                    fontSize: { xs: "0.875rem", md: "0.95rem" },
                  }}
                >
                  {project.description}
                </Typography>

                {/* Language and Stats */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
                  {project.language && (
                    <Chip
                      label={project.language}
                      size="small"
                      sx={{ bgcolor: "#e0e7ff", color: "#667eea", fontWeight: 500 }}
                    />
                  )}
                  {project.stars > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#999" }}>
                      <Star sx={{ fontSize: 16 }} />
                      <Typography variant="caption">{project.stars}</Typography>
                    </Box>
                  )}
                </Box>

                {/* Topics */}
                {project.topics && project.topics.length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {project.topics.slice(0, 3).map((topic, idx) => (
                      <Chip
                        key={idx}
                        label={topic}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem", height: "20px" }}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>

              {project.url && (
                <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
                  <Button
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<GitHubIcon />}
                    sx={{
                      color: "#667eea",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#f0f4ff" },
                    }}
                  >
                    View on GitHub
                  </Button>
                </CardActions>
              )}
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
