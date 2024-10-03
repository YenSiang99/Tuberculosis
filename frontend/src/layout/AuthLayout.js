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
  Grid,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import theme from "../components/reusable/Theme";

import LanguageSelector from "../components/reusable/LanguageSelector"; // Import the new component

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
            <Grid container alignItems="center">
              {/* Left side (logo + app name) */}
              <Grid item xs={8} sx={{ display: "flex", alignItems: "center" }}>
                <IconButton sx={{ p: 1 }}>
                  <Avatar alt="TB Logo" src="./logo.png" />
                </IconButton>
                <Typography variant="h5" color="inherit">
                  <span style={{ color: "#0046c0", fontWeight: "bold" }}>
                    My
                  </span>
                  <span style={{ color: "#4cbcea", fontWeight: "bold" }}>
                    TB
                  </span>
                  <span style={{ color: "#0046c0", fontWeight: "bold" }}>
                    Companion
                  </span>
                </Typography>
              </Grid>

              {/* Right side (Language Selector) */}
              <Grid
                item
                container
                direction="row"
                xs={4}
                sx={{ display: "flex", justifyContent: "flex-end" }}
                spacing={1}
              >
                {/* Override the color of the LanguageSelector */}
                <Grid item sx={{ color: "black" }}>
                  <LanguageSelector />
                </Grid>
                {!isLoginPage && (
                  <Grid item>
                    <Button
                      variant="contained"
                      sx={{ color: "white" }}
                      onClick={() => navigate("/")}
                    >
                      Back to Login
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Hide the Back to Login button on the login page */}
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
