import { Box, Card, CardContent, Typography, Button, Divider, Stack } from "@mui/material";

export default function AuthCard({
  title,
  fields,
  onSubmit,
  buttonText,
  googleHandler,
  bottomText,
  msg,
  children, // for extra custom content if needed
}) {
  
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "radial-gradient(circle at top, #FBFBFB, #ECECEC, rgb(254, 252, 252), rgb(219, 222, 236), #C5CAE0)",
        color: "#000",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 0, sm: 3, md: 0 },
        py: { xs: 0, sm: 4 },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "60%" },
          maxWidth: "1200px",
          minHeight: { xs: "100vh", sm: "auto", md: "80vh" },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          boxShadow: { xs: "none", sm: "0px 4px 12px rgba(0, 0, 0, 0.1)", md: "0px 0px 24px rgba(0, 0, 0, 0.15)" },
          borderRadius: { xs: 0, sm: "16px", md: "24px" },
          overflow: "hidden",
          bgcolor: "#fff",
        }}
      >
        {/* Left side - decorative panel (hidden on mobile) */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            width: { md: "45%", lg: "50%" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: { md: 4, lg: 6 },
            background: `
              url("data:image/svg+xml;utf8,<svg width='400' height='40' xmlns='http://www.w3.org/2000/svg'><path d='M0 20 Q 50 0, 100 25 T 200 18 T 300 20 T 400 20' stroke='white' stroke-width='2' fill='none' opacity='0.15'/></svg>")
              repeat-y, 
              #2A3B93
            `,
            backgroundSize: "100% 30px",
            color: "#fff",
            fontSize: { md: "1rem", lg: "1.1rem" },
            lineHeight: 1.7,
            textAlign: "center",
          }}
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
        </Box>

        {/* Right side - form card */}
        <Card
          sx={{
            width: { xs: "100%", md: "55%", lg: "50%" },
            background: "#fff",
            color: "#000",
            boxShadow: "none",
            borderRadius: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CardContent
            sx={{
              px: { xs: 3, sm: 4, md: 4, lg: 5 },
              py: { xs: 5, sm: 5, md: 6 },
            }}
          >
            {title && (
              <Typography
                variant="h4"
                align="center"
                sx={{
                  mb: 1,
                  fontWeight: "bold",
                  color: "#000",
                  fontSize: { xs: "2rem", sm: "2.25rem", md: "2.25rem" },
                }}
              >
                {title}
              </Typography>
            )}
            {/* <Typography
              align="center"
              sx={{
                mb: 1,
                color: "#666",
                fontSize: { xs: "1.15rem", sm: "1.2rem", md: "1.1rem" },
              }}
            >
              Welcome
            </Typography>
            <Typography
              align="center"
              sx={{
                mb: 3,
                color: "#888",
                fontSize: { xs: "1rem", sm: "1.05rem", md: "1rem" },
              }}
            >
              Let's {title} to your account
            </Typography> */}

            <form onSubmit={onSubmit}>
              {fields}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  py: { xs: 1.3, sm: 1.5 },
                  borderRadius: "12px",
                  backgroundColor: "#1976d2",
                  fontWeight: "bold",
                  fontSize: { xs: "1.1rem", sm: "1.15rem", md: "1.1rem" },
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#1565c0" },
                }}
              >
                {buttonText}
              </Button>
            </form>

            <Divider
              sx={{
                my: { xs: 2.5, sm: 3 },
                borderColor: "#ddd",
                fontSize: { xs: "1rem", sm: "1.05rem", md: "1rem" },
              }}
            >
              or
            </Divider>

            {googleHandler && (
              <Stack direction="column" alignItems="center" spacing={2}>
                {googleHandler}
              </Stack>
            )}

            {bottomText}

            {msg && (
              <Typography
                align="center"
                color="error"
                sx={{
                  mt: 2,
                  fontSize: { xs: "1rem", sm: "1.05rem", md: "1rem" },
                }}
              >
                {msg}
              </Typography>
            )}
            {children}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}