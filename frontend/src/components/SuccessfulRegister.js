import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, Box, Typography, Button } from "@mui/material";
import theme from "./reusable/Theme";
import BgImage from "./image/cover.jpeg";
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import an icon for success

export default function SuccessfulRegister() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5); // Initial countdown state set to 5 seconds

  useEffect(() => {
    // Countdown logic
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      navigate('/'); // Navigate to login page when countdown ends
    }
  }, [countdown, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(217, 241, 251, 0.8), rgba(217, 241, 251, 0.8)), url(${BgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 3,
            boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
            borderRadius: "15px",
            backgroundColor: "white",
            maxWidth: "500px",
          }}
        >
          <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
          <Typography component="h1" variant="h5" sx={{ my: 2 }}>
            Registered Successfully
          </Typography>
          <Typography variant="body1">
            Your account has been created. You will be redirected to the login page in {countdown} seconds.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => navigate('/')}
          >
            Go to Login Page Now
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
