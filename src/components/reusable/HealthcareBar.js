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
import GroupIcon from "@mui/icons-material/Group";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "../../context/AuthContext";
import axios from "../../components/axios";

export default function HealthcareSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const [healthcareData, setHealthcareData] = useState({});
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);


  const [user, setUser] = useState({ fullname: "User", profilePicture: "" });
  useEffect(() => {
    // Attempt to fetch user data from session storage or local storage
    const userData =
      JSON.parse(sessionStorage.getItem("userData")) ||
      JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUser({
        fullname: userData.fullname,
        profilePicture: userData.profilePicture,
      });
    }
  }, []);

  const navigateTo = (path) => {
    navigate(path);
  };

  // Update these paths and states to match your new routes
  const isAllPatients = location.pathname === "/healthcarepatient";
  const isReviewVideo = location.pathname === "/healthcarevideo";
  const isReviewSideEffect = location.pathname === "/healthcaresideeffect";
  const isAppointment = location.pathname === "/healthcareappointment";
  const isProfile = location.pathname === "/healthcareprofile";
  const isNotifications = location.pathname === "/healthcarenotifications";

  const handleLogout = () => {
    // Clear both localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to the homepage
    navigate("/");

    // set application auth
    setAuth(false);
  };

  const fetchHealthcareData = async () => {
    try {
      const response = await axios.get("/users/profile");
      console.log("Healthcare data", response.data);
      setHealthcareData(response.data);
    } catch (error) {
      console.error("Failed to fetch healthcare data:", error);
      if (error.response && error.response.data) {
        console.error("Error details:", error.response.data);
      }
    }
  };

  useEffect(() => {
    fetchHealthcareData();
  }, []);
  

  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchHealthcareData();
    };
  
    window.addEventListener('profileUpdated', handleProfileUpdate);
  
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
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
      <div style={{ minHeight: 64 }} />
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
          src={healthcareData.profilePicture}
          sx={{ width: 56, height: 56, marginBottom: 1 }}
        />
<Typography variant="h6">{`${healthcareData.firstName} ${healthcareData.lastName}`}</Typography>
      </Box>
      <Divider />
      <List>
        {/* All Patients */}
        <ListItemButton
          key="AllPatients"
          onClick={() => navigateTo("/healthcarepatient")}
          selected={isAllPatients}
        >
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="All Patients" />
        </ListItemButton>

        {/* Review Video */}
        <ListItemButton
          key="ReviewVideo"
          onClick={() => navigateTo("/healthcarevideo")}
          selected={isReviewVideo}
        >
          <ListItemIcon>
            <VideoCameraFrontIcon />
          </ListItemIcon>
          <ListItemText primary="Review Video" />
        </ListItemButton>

        {/* Review Side Effect */}
        <ListItemButton
          key="ReviewSideEffect"
          onClick={() => navigateTo("/healthcaresideeffect")}
          selected={isReviewSideEffect}
        >
          <ListItemIcon>
            <ReportProblemIcon />
          </ListItemIcon>
          <ListItemText primary="Review Side Effect" />
        </ListItemButton>

        {/* Appointment */}
        <ListItemButton
          key="Appointment"
          onClick={() => navigateTo("/healthcareappointment")}
          selected={isAppointment}
        >
          <ListItemIcon>
            <EventAvailableIcon />
          </ListItemIcon>
          <ListItemText primary="Appointment" />
        </ListItemButton>

        {/* Profile */}
        <ListItemButton
          key="Profile"
          onClick={() => navigateTo("/healthcareprofile")}
          selected={isProfile}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>

        {/* Notifications */}
        <ListItemButton
          key="Notifications"
          onClick={() => navigateTo("/healthcarenotification")}
          selected={isNotifications}
        >
          <ListItemIcon>
            <Badge badgeContent={unreadNotificationsCount} color="error">
              <NotificationsIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Notifications" />
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
