import { Box, Card, CardContent, Typography, Button, Divider, Stack } from "@mui/material";

export default function AuthCard({
  title,
  fields,
  onChange,
  onSubmit,
  buttonText,
  googleHandler,
  googleError,
  bottomText,
  msg,
  children, // for extra custom content if needed
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at bottom,rgb(16, 33, 70),rgb(10, 19, 40),  #0a0f1a, #000)",
        color: "#fff",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: "24px",
          background: "radial-gradient(circle at top,rgba(86, 86, 87, 0.84), rgb(65, 65, 66), rgba(33, 33, 33, 0.36), rgb(29, 29, 30),rgba(19, 19, 19, 0.36), #000)",
        
          boxShadow: "0 0 5px rgba(0,0,0,0.6)",
          p: 3,
          "@media (max-width:600px)": {
            maxWidth: "100vw",
            minHeight: "100vh",
            borderRadius: 0,
            p: 1.5,
            boxShadow: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          },
        }}
      >
        <CardContent>
          {title && (
            <Typography
              variant="h4"
              align="center"
              sx={{ mb: 0.5, fontWeight: "bold", color: "#fff" }}
            >
              {title}
            </Typography>
          )}
          <form onSubmit={onSubmit}>
            {fields}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                py: 1.2,
                borderRadius: "12px",
                backgroundColor: "#1976d2",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              {buttonText}
            </Button>
          </form>
          <Divider sx={{ my: 2, borderColor: "#333" }}>or</Divider>
          {googleHandler && (
            <Stack direction="column" alignItems="center" spacing={2}>
              {googleHandler}
            </Stack>
          )}
          {bottomText}
          {msg && (
            <Typography align="center" color="error" sx={{ mt: 2 }}>
              {msg}
            </Typography>
          )}
          {children}
        </CardContent>
      </Card>
    </Box>
  );
}