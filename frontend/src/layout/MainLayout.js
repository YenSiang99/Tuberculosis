// /layout/MainLayout.js

import React, { useState, useEffect } from "react";
import {
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
} from "@mui/material";
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
    if (userRole?.includes("healthcare")) {
      return (
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

    if (userRole?.includes("patient")) {
      return (
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
          {/* Add more patient-specific links */}
          <ListItemButton
            onClick={() => navigateTo("/patientprofile")}
            selected={location.pathname === "/patientprofile"}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </>
      );
    }

    // If the user has 'admin' role, you can extend it similarly
    if (userRole?.includes("admin")) {
      return (
        <>
          <ListItemButton
            onClick={() => navigateTo("/adminpanel")}
            selected={location.pathname === "/adminpanel"}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Admin Panel" />
          </ListItemButton>
          {/* Add more admin-specific links */}
        </>
      );
    }

    return null; // Return null if no roles match
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Small screen menu button */}
      {matchesSM && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            m: 1,
            display: { sm: "block", md: "none" },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Drawer */}
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

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: "240px", md: "240px" },
          backgroundColor: "background.default",
        }}
      >
        {/* Render child routes */}
        <Outlet />
      </Box>
    </ThemeProvider>
  );
}
