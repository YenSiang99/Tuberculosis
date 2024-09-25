import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  CssBaseline,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import theme from "../components/reusable/Theme";

export default function AuthLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we are on the login page
  const isLoginPage =
    location.pathname === "/" || location.pathname === "/login";

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <CssBaseline />
        <AppBar
          position="fixed"
          //   color="white"
          sx={{ backgroundColor: "white" }}
        >
          <Toolbar>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton sx={{ p: 1 }}>
                <Avatar alt="TB Logo" src="./logo.png" />
              </IconButton>

              <Typography variant="h5" color="inherit">
                <span style={{ color: "#0046c0", fontWeight: "bold" }}>My</span>
                <span style={{ color: "#4cbcea", fontWeight: "bold" }}>TB</span>
                <span style={{ color: "#0046c0", fontWeight: "bold" }}>
                  Companion
                </span>
              </Typography>
            </Box>
            {/* Hide the Back to Login button on the login page */}
            {!isLoginPage && (
              <Box sx={{ flexGrow: 0 }}>
                <Button
                  variant="contained"
                  sx={{ color: "white" }}
                  onClick={() => navigate("/")}
                >
                  Back to Login
                </Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ flexGrow: 1 }}>
          {/* Add space below the AppBar */}
          <Toolbar />
          {/* Render the child routes */}
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
