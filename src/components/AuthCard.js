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
        background: "radial-gradient(circle at top, #FBFBFB, #ECECEC,rgb(254, 252, 252),rgb(219, 222, 236), #C5CAE0)",     
        color: "#000", 
      }}>
    
    <Box
    sx={{
        width: { xs: "100%", sm: "70%", md: "80%", lg: "60%" },
        margin: "auto",
        minHeight: "80vh",
        display: "flex",
        // flexDirection: {  md: "row" },
        boxShadow: "0px 0px 2px rgba(0, 0, 0.1, 0.2)",
        borderRadius: "300px",
        color: "#000"
      }}>
      <Box
        sx={{
          // bgcolor: "#2A3B93",
          color: "#fff",
          display: { xs: "none", sm: "none", md: "flex" },
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
          background: `
          url("data:image/svg+xml;utf8,<svg width='400' height='40' xmlns='http://www.w3.org/2000/svg'><path d='M0 20 Q 50 0, 100 25 T 200 18 T 300 20 T 400 20' stroke='white' stroke-width='2' fill='none' opacity='0.15'/></svg>")
          repeat-y, 
          #2A3B93
        `,
          backgroundSize: "100% 30px",
        }}
      >
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
      </Box>
        <Card
          sx={{
            width: "100%",
            // maxWidth: 400,
            height: { xs: "100vh", sm: "auto" },
            background: "#fff",
            color: "#000",
            p: 1,
            borderRadius:0,
            // "@media (max-width:600px)": {
            //   maxWidth: "100vw",
            //   minHeight: "100vh",
            //   borderRadius: 0,
            //   p: 0.5,
            //   boxShadow: "none",
            //   // display: "flex",
            //   // flexDirection: "column",
            //   justifyContent: "center",
            // },
          }}
        >
          <CardContent>
            {title && (
              <Typography
                variant="h4"
                align="center"
                sx={{ mb: 0.5,  fontWeight: "bold", color: "#000"}}
              >
                {title}
              </Typography>
            )}
            <Typography align="center" sx={{ mb: 2, color: "#000" }}>Welcome</Typography>
            <Typography>Let's {title} to your account</Typography>
            <form onSubmit={onSubmit}>
              {fields}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  mt: 1.5,
                  py: 0.7,
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
            <Divider sx={{ my: 1.5, borderColor: "#333" }}>or</Divider>
            {googleHandler && (
              <Stack direction="column" alignItems="center" spacing={1}>
                {googleHandler}
              </Stack>
            )}
            {bottomText}
            {msg && (
              <Typography align="center" color="error" sx={{ mt: 1 }}>
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