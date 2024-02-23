import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Box,
  Badge,
} from "@mui/material";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import axios from "../../components/axios";

import { useAuth } from "../../context/AuthContext";

export default function PatientSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { setAuth } = useAuth();
  const [patientData, setPatientData] = useState({});

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
    if (handleDrawerToggle) {
      handleDrawerToggle();
    }
  };

  const isVideo = location.pathname === "/patientvideo";
  const isSideEffect = location.pathname === "/patientsideeffect";
  const isAppointment = location.pathname === "/patientappointment";
  const isProfile = location.pathname === "/patientprofile";
  const isSettings = location.pathname === "/patientsettings";
  const isNotifications = location.pathname === "/patientnotification";

  const handleLogout = () => {
    // Clear both localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to the homepage
    navigate("/");

    // set application auth
    setAuth(false);
  };

  const fetchPatientData = async () => {
    try {
      const response = await axios.get("/users/profile");
      console.log("Patient data", response.data);
      setPatientData(response.data);
    } catch (error) {
      console.error("Failed to fetch patient data:", error);
      if (error.response && error.response.data) {
        console.error("Error details:", error.response.data);
      }
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchPatientData();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  const fetchUnreadNotificationsCount = async () => {
    try {
      const response = await axios.get("/notifications"); 
      const unreadCount = response.data.filter(notification => notification.status === 'unread').length;
      setUnreadNotificationsCount(unreadCount); 
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };
  
  useEffect(() => {
    fetchUnreadNotificationsCount();
  }, []); 

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      <div style={{ minHeight: 64 }} /> {/* Replacing the toolbar height */}
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
          src={patientData.profilePicture}
          sx={{ width: 56, height: 56, marginBottom: 1 }}
        />
        <Typography variant="h6">{`${patientData.firstName} ${patientData.lastName}`}</Typography>
      </Box>
      <Divider />
      <List>
        {/* Video Upload */}
        <ListItemButton
          key="VideoUpload"
          onClick={() => navigateTo("/patientvideo")}
          selected={isVideo}
        >
          <ListItemIcon>
            <VideoCameraFrontIcon />
          </ListItemIcon>
          <ListItemText primary="Upload Video" />
        </ListItemButton>

        {/* Side Effect Reporting */}
        <ListItemButton
          key="SideEffects"
          onClick={() => navigateTo("/patientsideeffect")}
          selected={isSideEffect}
        >
          <ListItemIcon>
            <ReportProblemIcon />
          </ListItemIcon>
          <ListItemText primary="Report Side Effects" />
        </ListItemButton>

        {/* Book Appointment */}
        <ListItemButton
          key="BookAppointment"
          onClick={() => navigateTo("/patientappointment")}
          selected={isAppointment}
        >
          <ListItemIcon>
            <EventAvailableIcon />
          </ListItemIcon>
          <ListItemText primary="Appointment" />
        </ListItemButton>

        {/* My Calendar */}
        <ListItemButton
          key="MyCalendar"
          onClick={() => navigateTo("/patientcalendar")}
          selected={location.pathname === "/patientcalendar"}
        >
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText primary="Progress Tracker" />
        </ListItemButton>

        {/* Profile */}
        <ListItemButton
          key="Profile"
          onClick={() => navigateTo("/patientprofile")}
          selected={isProfile}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>

        {/* Notifications */}
        <ListItemButton
          key="Notifications"
          onClick={() => navigateTo("/patientnotification")}
          selected={isNotifications}
        >
          <ListItemIcon>
            <Badge badgeContent={unreadNotificationsCount} color="error">
              <NotificationsIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItemButton>

        {/* Setting */}
        <ListItemButton
          key="Settings"
          onClick={() => navigateTo("/patientsettings")}
          selected={isSettings}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>

        {/* Logout */}
        <ListItemButton key="Logout" onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
