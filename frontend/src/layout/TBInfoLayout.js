import React, { useState } from "react";
import {
  Box,
  ThemeProvider,
  AppBar,
  Toolbar,
  Drawer,
  ListItemButton,
  ListItemText,
  Button,
  Container,
  Paper,
  Typography,
  Collapse,
  List,
  ListItemIcon,
  IconButton,
  CssBaseline,
  Divider,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import Avatar from "@mui/material/Avatar";
import InfoIcon from "@mui/icons-material/Info";
import GamesIcon from "@mui/icons-material/Games";
import MenuIcon from "@mui/icons-material/Menu";

import LoginIcon from "@mui/icons-material/Login";

import { useNavigate, useLocation, Outlet } from "react-router-dom";
import theme from "../components/reusable/Theme";
import BgImage from "../assets/cover.jpeg";

const drawerWidth = 240;

const TBInfo = () => {
  const [openGames, setOpenGames] = useState(true);
  const [openAboutTB, setOpenAboutTB] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleGamesClick = () => {
    setOpenGames(!openGames);
  };

  const handleAboutTBClick = () => {
    setOpenAboutTB(!openAboutTB);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <>
      <Toolbar />
      <Divider />
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List>
          {/* About TB Section */}
          <ListItemButton onClick={handleAboutTBClick}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About TB" />
            {openAboutTB ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openAboutTB} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => {
                  navigate("/tb-info/infographics");
                  handleDrawerToggle();
                }}
                selected={location.pathname === "/tb-info/infographics"}
              >
                <ListItemText primary="Infographics" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => {
                  navigate("/tb-info/videos");
                  handleDrawerToggle();
                }}
                selected={location.pathname === "/tb-info/videos"}
              >
                <ListItemText primary="Videos" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => {
                  navigate("/tb-info/faqs");
                  handleDrawerToggle();
                }}
                selected={location.pathname === "/tb-info/faqs"}
              >
                <ListItemText primary="FAQs" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Games Section */}
          <ListItemButton onClick={handleGamesClick}>
            <ListItemIcon>
              <GamesIcon />
            </ListItemIcon>
            <ListItemText primary="Games" />
            {openGames ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openGames} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => {
                  navigate("/tb-info/games/word-search");
                  handleDrawerToggle();
                }}
                selected={location.pathname === "/tb-info/games/word-search"}
              >
                <ListItemText primary="Word Search" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => {
                  navigate("/tb-info/games/quiz");
                  handleDrawerToggle();
                }}
                selected={location.pathname === "/tb-info/games/quiz"}
              >
                <ListItemText primary="Quiz" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => {
                  navigate("/tb-info/games/interactive-story");
                  handleDrawerToggle();
                }}
                selected={
                  location.pathname === "/tb-info/games/interactive-story"
                }
              >
                <ListItemText primary="Interactive Story" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => {
                  navigate("/tb-info/games/fill-in-blanks");
                  handleDrawerToggle();
                }}
                selected={location.pathname === "/tb-info/games/fill-in-blanks"}
              >
                <ListItemText primary="Fill in the Blanks" />
              </ListItemButton>
              {/* <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => {
                navigate("/tb-info/games/true-false");
                handleDrawerToggle();
              }}
              selected={location.pathname === "/tb-info/games/true-false"}
            >
              <ListItemText primary="True or False" />
            </ListItemButton> */}
            </List>
          </Collapse>
        </List>
      </Box>
      <Divider />
      <List>
        {/* About MyTBCompanion */}
        <ListItemButton
          onClick={() => {
            navigate("/tb-info/about");
            handleDrawerToggle();
          }}
          sx={{
            bgcolor:
              location.pathname === "/tb-info/about"
                ? "#0046c0"
                : "transparent",
            color: location.pathname === "/tb-info/about" ? "white" : "inherit",
            "&:hover": { bgcolor: "#e3f2fd", color: "black" },
            "&.Mui-selected": {
              bgcolor: "#0046c0",
              color: "white",
              "&:hover": { bgcolor: "#e3f2fd", color: "black" },
            },
          }}
          selected={location.pathname === "/tb-info/about"}
        >
          <ListItemText primary="About MyTBCompanion" />
        </ListItemButton>
      </List>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: "#CFE9F4",
          }}
        >
          <Toolbar>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "flex" },
                alignItems: "center",
              }}
            >
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
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
            <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
              <Button
                variant="contained"
                sx={{ color: "white" }}
                onClick={() => navigate("/")}
              >
                Back to Login
              </Button>
            </Box>
            <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
              <LoginIcon
                variant="contained"
                onClick={() => navigate("/")}
                color="primary"
                // sx={{ color: "primary" }}
              ></LoginIcon>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
          >
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: "none", sm: "none", md: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: "background.default",
              backgroundImage: `linear-gradient(to bottom, rgba(217, 241, 251, 0.8), rgba(217, 241, 251, 0.8)), url(${BgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Toolbar />
            <Container>
              <Paper style={{ padding: theme.spacing(2) }}>
                <Outlet />
              </Paper>
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default TBInfo;
