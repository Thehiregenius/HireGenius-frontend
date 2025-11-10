"use client";
import React from "react";
import { Snackbar, Alert } from "@mui/material";

export default function Notification({
  open,
  severity = "info",
  message,
  onClose,
  autoHideDuration = 3000,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
