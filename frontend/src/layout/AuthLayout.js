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
  useMediaQuery,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import theme from "../components/reusable/Theme";
import LanguageSelector from "../components/reusable/LanguageSelector";

export default function AuthLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isLoginPage =
    location.pathname === "/" || location.pathname === "/login";

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <CssBaseline />
        <AppBar position="fixed" sx={{ backgroundColor: "white" }}>
          <Toolbar>
            {/* Logo and Title */}
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <IconButton sx={{ p: 1 }}>
                <Avatar alt="TB Logo" src="./logo.png" />
              </IconButton>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.5rem" },
                }}
              >
                <span style={{ color: "#0046c0", fontWeight: "bold" }}>My</span>
                <span style={{ color: "#4cbcea", fontWeight: "bold" }}>TB</span>
                <span style={{ color: "#0046c0", fontWeight: "bold" }}>
                  Companion
                </span>
              </Typography>
            </Box>

            {/* Right side controls */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Box sx={{ color: "black" }}>
                <LanguageSelector />
              </Box>

              {!isLoginPage &&
                (isMobile ? (
                  <IconButton
                    color="primary"
                    onClick={() => navigate("/")}
                    sx={{ ml: 0.5 }}
                  >
                    <LoginIcon />
                  </IconButton>
                ) : (
                  <Button
                    variant="contained"
                    sx={{ color: "white" }}
                    onClick={() => navigate("/")}
                  >
                    Back to Login
                  </Button>
                ))}
            </Box>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
