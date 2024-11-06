import React, { useState, useEffect } from "react";
import {
  Toolbar,
  Container,
  Paper,
  Drawer,
  Box,
  useMediaQuery,
  ThemeProvider,
  Avatar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  CssBaseline,
  Collapse,
  Badge,
  AppBar,
  IconButton,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import GamesIcon from "@mui/icons-material/Games";
import MenuIcon from "@mui/icons-material/Menu";

import theme from "../components/reusable/Theme";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Outlet } from "react-router-dom";
import axios from "../components/axios";
import LanguageSelector from "../components/reusable/LanguageSelector";
import BgImage from "../assets/cover.jpeg";

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [userRole, setUserRole] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [adminOpen, setAdminOpen] = useState(true);
  const [openGames, setOpenGames] = useState(true);
  const [openAboutTB, setOpenAboutTB] = useState(true);

  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const drawerWidth = 240;

  const handleAdminClick = () => setAdminOpen(!adminOpen);
  const handleGamesClick = () => setOpenGames(!openGames);
  const handleAboutTBClick = () => setOpenAboutTB(!openAboutTB);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
    setAuth(false);
  };

  const navigateTo = (path) => {
    navigate(path);
    if (matchesSM) {
      handleDrawerToggle();
    }
  };

  const fetchUnreadNotificationsCount = async () => {
    try {
      const response = await axios.get("/notifications");
      const unreadCount = response.data.filter(
        (notification) => notification.status === "unread"
      ).length;
      setUnreadNotificationsCount(unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    const storedUserData =
      JSON.parse(sessionStorage.getItem("userData")) ||
      JSON.parse(localStorage.getItem("userData"));

    if (storedUserData) {
      setUserData(storedUserData);
      setUserRole(storedUserData.roles || []);
    }

    fetchUnreadNotificationsCount();
    window.addEventListener(
      "notificationsUpdated",
      fetchUnreadNotificationsCount
    );

    return () => {
      window.removeEventListener(
        "notificationsUpdated",
        fetchUnreadNotificationsCount
      );
    };
  }, []);

  const renderDrawerContent = () => {
    const menuItems = [];

    // Healthcare role content
    if (userRole?.includes("healthcare")) {
      menuItems.push(
        <>
          <ListItemButton
            onClick={() => navigateTo("/healthcare/patient")}
            selected={location.pathname === "/healthcare/patient"}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="All Patients" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/healthcare/video")}
            selected={location.pathname === "/healthcare/video"}
          >
            <ListItemIcon>
              <VideoCameraFrontIcon />
            </ListItemIcon>
            <ListItemText primary="Review Videos" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/healthcare/sideeffect")}
            selected={location.pathname === "/healthcare/sideeffect"}
          >
            <ListItemIcon>
              <ReportProblemIcon />
            </ListItemIcon>
            <ListItemText primary="Review Side Effects" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/healthcare/appointment")}
            selected={location.pathname === "/healthcare/appointment"}
          >
            <ListItemIcon>
              <EventAvailableIcon />
            </ListItemIcon>
            <ListItemText primary="Appointment" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/healthcare/profile")}
            selected={location.pathname === "/healthcare/profile"}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
          <ListItemButton
            key="Notifications"
            onClick={() => navigate("/healthcare/notification")}
            selected={location.pathname === "/healthcare/notification"}
          >
            <ListItemIcon>
              <Badge badgeContent={unreadNotificationsCount} color="error">
                <NotificationsIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItemButton>
        </>
      );
    }

    // Patient role content
    if (userRole?.includes("patient")) {
      menuItems.push(
        <>
          <ListItemButton
            onClick={() => navigateTo("/patient/video")}
            selected={location.pathname === "/patient/video"}
          >
            <ListItemIcon>
              <VideoCameraFrontIcon />
            </ListItemIcon>
            <ListItemText primary="Upload Video" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/patient/sideeffect")}
            selected={location.pathname === "/patient/sideeffect"}
          >
            <ListItemIcon>
              <ReportProblemIcon />
            </ListItemIcon>
            <ListItemText primary="Report Side Effects" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/patient/appointment")}
            selected={location.pathname === "/patient/appointment"}
          >
            <ListItemIcon>
              <EventAvailableIcon />
            </ListItemIcon>
            <ListItemText primary="Appointment" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/patient/calendar")}
            selected={location.pathname === "/patient/calendar"}
          >
            <ListItemIcon>
              <CalendarTodayIcon />
            </ListItemIcon>
            <ListItemText primary="Progress Tracker" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/patient/profile")}
            selected={location.pathname === "/patient/profile"}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
          <ListItemButton
            key="Notifications"
            onClick={() => navigate("/patient/notification")}
            selected={location.pathname === "/patient/notification"}
          >
            <ListItemIcon>
              <Badge badgeContent={unreadNotificationsCount} color="error">
                <NotificationsIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/patient/settings")}
            selected={location.pathname === "/patient/settings"}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </>
      );
    }

    // Admin role content
    if (userRole?.includes("admin")) {
      menuItems.push(
        <>
          {/* <ListItemButton
            onClick={() => navigateTo("/adminpanel")}
            selected={location.pathname === "/adminpanel"}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Admin Panel" />
          </ListItemButton> */}
          {/* Add your Games menu and submenus here */}
          <ListItemButton onClick={handleAdminClick}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Admin" />
            {adminOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={adminOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                onClick={() => navigateTo("/admin/scoredashboard")}
                selected={location.pathname === "/admin/scoredashboard"}
                sx={{ pl: 4 }}
              >
                <ListItemText primary="Score Dashboard" />
              </ListItemButton>
              <ListItemButton
                onClick={() => navigateTo("/admin/wordsearchmenu")}
                selected={location.pathname === "/admin/wordsearchmenu"}
                sx={{ pl: 4 }}
              >
                <ListItemText primary="Word Search" />
              </ListItemButton>
              {/* Add more submenus here if needed */}
              <ListItemButton
                onClick={() => navigateTo("/admin/quizzes")}
                selected={location.pathname === "/admin/quizzes"}
                sx={{ pl: 4 }}
              >
                <ListItemText primary="Quizzes" />
              </ListItemButton>
              <ListItemButton
                onClick={() => navigateTo("/admin/storymenu")}
                selected={location.pathname === "/admin/storymenu"}
                sx={{ pl: 4 }}
              >
                <ListItemText primary="Interactive Story" />
              </ListItemButton>
              <ListItemButton
                onClick={() => navigateTo("/admin/blanks")}
                selected={location.pathname === "/admin/blanks"}
                sx={{ pl: 4 }}
              >
                <ListItemText primary="Fill in the blanks" />
              </ListItemButton>
            </List>
          </Collapse>
        </>
      );
    }

    if (userRole?.length === 1 && userRole.includes("user")) {
      menuItems.push(
        <>
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
                  navigate("/infographics");
                  handleDrawerToggle();
                }}
                selected={location.pathname === "/infographics"}
              >
                <ListItemText primary="Infographics" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => {
                  navigate("/videos");
                  handleDrawerToggle();
                }}
                selected={location.pathname === "/videos"}
              >
                <ListItemText primary="Videos" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => {
                  navigate("/faqs");
                  handleDrawerToggle();
                }}
                selected={location.pathname === "/faqs"}
              >
                <ListItemText primary="FAQs" />
              </ListItemButton>
            </List>
          </Collapse>
        </>
      );
    }

    menuItems.push(
      <>
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
                navigate("/games/score-dashboard");
                handleDrawerToggle();
              }}
              selected={location.pathname === "/games/score-dashboard"}
            >
              <ListItemText primary="Score Dashboard" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => {
                navigate("/games/word-search");
                handleDrawerToggle();
              }}
              selected={location.pathname === "/games/word-search"}
            >
              <ListItemText primary="Word Search" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => {
                navigate("/games/quiz");
                handleDrawerToggle();
              }}
              selected={location.pathname === "/games/quiz"}
            >
              <ListItemText primary="Quiz" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => {
                navigate("/games/interactive-story");
                handleDrawerToggle();
              }}
              selected={location.pathname === "/games/interactive-story"}
            >
              <ListItemText primary="Interactive Story" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => {
                navigate("/games/fill-in-blanks");
                handleDrawerToggle();
              }}
              selected={location.pathname === "/games/fill-in-blanks"}
            >
              <ListItemText primary="Fill in the Blanks" />
            </ListItemButton>
            {/* <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => {
                navigate("/games/true-false");
                handleDrawerToggle();
              }}
              selected={location.pathname === "/games/true-false"}
            >
              <ListItemText primary="True or False" />
            </ListItemButton> */}
          </List>
        </Collapse>
      </>
    );

    return menuItems.length > 0 ? menuItems : null;
  };

  const drawer = (
    <>
      <Toolbar />
      <Divider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "column",
          padding: 2,
        }}
      >
        <Avatar
          src={userData.profilePicture}
          sx={{ width: 56, height: 56, marginBottom: 1 }}
        />
        <Typography variant="h6">
          {userData.firstName && userData.lastName
            ? `${userData.firstName} ${userData.lastName}`
            : "Hello, User"}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List>{renderDrawerContent()}</List>
      </Box>
      <Divider />
      <List>
        <ListItemButton
          onClick={() => navigateTo("/about")}
          selected={location.pathname === "/about"}
        >
          <ListItemText primary="About MyTBCompanion" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* New AppBar */}

        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: "#CFE9F4",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
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

              <Typography
                variant="h5"
                color="inherit"
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

            <Box sx={{ ml: 2 }}>
              <LanguageSelector />
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
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

          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
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
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            height: "100vh",
            overflow: "auto",
            bgcolor: "background.default",
            backgroundImage: `linear-gradient(to bottom, rgba(217, 241, 251, 0.8), rgba(217, 241, 251, 0.8)), url(${BgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <Toolbar /> {/* Add spacing for AppBar */}
          <Container sx={{ marginTop: 2 }}>
            <Paper style={{ padding: theme.spacing(2) }}>
              <Outlet />
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
