// /layout/MainLayout.js

import React, { useState, useEffect } from "react";
import {
  Toolbar,
  Container,
  Paper,
  Drawer,
  IconButton,
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
  Badge,
  CssBaseline,
  Collapse,
} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import theme from "../components/reusable/Theme";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Outlet } from "react-router-dom"; // To render child routes

export default function MainLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [userData, setUserData] = useState({});
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const drawerWidth = 240;

  const [adminOpen, setAdminOpen] = useState(true);

  const handleGamesClick = () => {
    setAdminOpen(!adminOpen);
  };

  useEffect(() => {
    const storedUserData = JSON.parse(sessionStorage.getItem("userData"));
    if (storedUserData && storedUserData.roles) {
      setUserRole(storedUserData.roles); // roles is an array now
      setUserData(storedUserData);
    }
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
    setAuth(false);
  };

  const navigateTo = (path) => {
    navigate(path);
    if (handleDrawerToggle) {
      handleDrawerToggle();
    }
  };

  const fetchUnreadNotificationsCount = async () => {
    // Implement API call to fetch notifications count
    // setUnreadNotificationsCount(response.data.count);
  };

  useEffect(() => {
    fetchUnreadNotificationsCount();
  }, []);

  // Sidebar content based on role
  const renderDrawerContent = () => {
    const menuItems = [];

    // Healthcare role content
    if (userRole?.includes("healthcare")) {
      menuItems.push(
        <>
          <ListItemButton
            onClick={() => navigateTo("/healthcarepatient")}
            selected={location.pathname === "/healthcarepatient"}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="All Patients" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/healthcarevideo")}
            selected={location.pathname === "/healthcarevideo"}
          >
            <ListItemIcon>
              <VideoCameraFrontIcon />
            </ListItemIcon>
            <ListItemText primary="Review Videos" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/healthcaresideeffect")}
            selected={location.pathname === "/healthcaresideeffect"}
          >
            <ListItemIcon>
              <ReportProblemIcon />
            </ListItemIcon>
            <ListItemText primary="Review Side Effects" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/healthcareappointment")}
            selected={location.pathname === "/healthcareappointment"}
          >
            <ListItemIcon>
              <EventAvailableIcon />
            </ListItemIcon>
            <ListItemText primary="Appointment" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/healthcareprofile")}
            selected={location.pathname === "/healthcareprofile"}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/healthcarenotification")}
            selected={location.pathname === "/healthcarenotification"}
          >
            <ListItemIcon>
              <NotificationsIcon />
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
            onClick={() => navigateTo("/patientvideo")}
            selected={location.pathname === "/patientvideo"}
          >
            <ListItemIcon>
              <VideoCameraFrontIcon />
            </ListItemIcon>
            <ListItemText primary="Upload Video" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/patientsideeffect")}
            selected={location.pathname === "/patientsideeffect"}
          >
            <ListItemIcon>
              <ReportProblemIcon />
            </ListItemIcon>
            <ListItemText primary="Report Side Effects" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/patientappointment")}
            selected={location.pathname === "/patientappointment"}
          >
            <ListItemIcon>
              <EventAvailableIcon />
            </ListItemIcon>
            <ListItemText primary="Appointment" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/patientcalendar")}
            selected={location.pathname === "/patientcalendar"}
          >
            <ListItemIcon>
              <CalendarTodayIcon />
            </ListItemIcon>
            <ListItemText primary="Progress Tracker" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/patientprofile")}
            selected={location.pathname === "/patientprofile"}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/patientnotification")}
            selected={location.pathname === "/patientnotification"}
          >
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigateTo("/patientsettings")}
            selected={location.pathname === "/patientsettings"}
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
          <ListItemButton onClick={handleGamesClick}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Admin" />
            {adminOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={adminOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                onClick={() => navigateTo("/wordsearchmenu")}
                selected={location.pathname === "/wordsearchmenu"}
                sx={{ pl: 4 }}
              >
                <ListItemText primary="Word Search" />
              </ListItemButton>
              {/* Add more submenus here if needed */}
              <ListItemButton
                onClick={() => navigateTo("/quizzes")}
                selected={location.pathname === "/quizzes"}
                sx={{ pl: 4 }}
              >
                <ListItemText primary="Quizzes" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigateTo("/storymenu")}
                selected={location.pathname === "/storymenu"}
                sx={{ pl: 4 }}
              >
                <ListItemText primary="Interactive Story" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigateTo("/blanks")}
                selected={location.pathname === "/blanks"}
                sx={{ pl: 4 }}
              >
                <ListItemText primary="Fill in the blanks" />
              </ListItemButton>
            </List>
          </Collapse>
        </>
      );
    }

    return menuItems.length > 0 ? menuItems : null;
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Small screen menu button */}
      <CssBaseline />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
          >
            <Drawer
              variant={matchesSM ? "temporary" : "permanent"}
              open={drawerOpen}
              onClose={handleDrawerToggle}
              sx={{
                width: 240,
                flexShrink: 0,
                "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
              }}
            >
              <Box
                sx={{
                  minHeight: 64,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  padding: 2,
                }}
              >
                <Avatar
                  src={userData.profilePicture}
                  sx={{ width: 56, height: 56, marginBottom: 1 }}
                />
                <Typography variant="h6">{`${userData.firstName} ${userData.lastName}`}</Typography>
              </Box>
              <Divider />
              <List>
                {renderDrawerContent()}
                {/* Notifications */}
                {/* <ListItemButton
            onClick={() => navigateTo("/notifications")}
            selected={location.pathname === "/notifications"}
          >
            <ListItemIcon>
              <Badge badgeContent={unreadNotificationsCount} color="error">
                <NotificationsIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItemButton> */}
                {/* Settings */}
                {/* <ListItemButton
            onClick={() => navigateTo("/settings")}
            selected={location.pathname === "/settings"}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton> */}
                {/* Logout */}
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </List>
            </Drawer>
          </Box>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: "background.default",
              // backgroundImage: `linear-gradient(to bottom, rgba(217, 241, 251, 0.8), rgba(217, 241, 251, 0.8)), url(${BgImage})`,
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
}
