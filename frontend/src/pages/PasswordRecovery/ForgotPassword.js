import React, { useState } from "react";
import {
  ThemeProvider,
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Alert,
  styled,
  Dialog,
  CircularProgress,
} from "@mui/material";
import theme from "../../components/reusable/Theme";
import BgImage from "../../assets/cover.jpeg";
import { useNavigate } from "react-router-dom";
import axios from "../../components/axios";

export default function ForgotPasswrd() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/users/forgotPassword", { email });
      console.log(response.data);
      setIsLoading(false);
      setAlertInfo({
        show: true,
        type: response.data.userExists ? "success" : "error",
        message: response.data.message,
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to reset password: ", error.response.data);
      setAlertInfo({
        show: true,
        type: "error",
        message: "Error sending password reset email. Please try again.",
      });
    }
  };

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {
      boxShadow: "none",
      overflow: "visible",
    },
  }));

  const handleCloseAlert = () => {
    setAlertInfo({ show: false, type: "", message: "" });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppBar
          position="fixed"
          color="transparent"
          elevation={0}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "white",
            borderBottom: "1px solid #ddd",
            display: "flex",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Logo and Title */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="./logo.png"
                alt="Logo"
                style={{ height: "70px", marginRight: theme.spacing(2) }}
              />
              <Typography variant="h5" color="inherit">
                <span style={{ color: "#0046c0", fontWeight: "bold" }}>My</span>
                <span style={{ color: "#4cbcea", fontWeight: "bold" }}>TB</span>
                <span style={{ color: "#0046c0", fontWeight: "bold" }}>
                  Companion
                </span>
              </Typography>
            </Box>

            {/* Back to Login Button */}
            <Button
              variant="contained"
              sx={{ color: "white", marginRight: 5 }}
              onClick={() => navigate("/")}
            >
              Back to Login
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: "background.default",
              p: 3,
              backgroundImage: `linear-gradient(to bottom, rgba(217, 241, 251, 0.8), rgba(217, 241, 251, 0.8)), url(${BgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Container>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  marginTop: theme.spacing(10),
                }}
              >
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Forgot Password
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Enter your email address and we'll send you a link to reset
                  your password.
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    type="email"
                    required
                    value={email} // Controlled component
                    onChange={(e) => setEmail(e.target.value)} // Update state on change
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isLoading} // Optionally keep disabled to prevent multiple clicks
                  >
                    {isLoading ? (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CircularProgress
                          size={24}
                          sx={{
                            color: "secondary", // Change color if needed
                            marginRight: "8px",
                          }}
                        />
                        Sending...
                      </Box>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </Paper>
            </Container>
          </Box>
        </Box>
      </Box>
      <CustomDialog
        open={alertInfo.show}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Alert severity={alertInfo.type} onClose={handleCloseAlert}>
          {alertInfo.message}
        </Alert>
      </CustomDialog>
    </ThemeProvider>
  );
}
