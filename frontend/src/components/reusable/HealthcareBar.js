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
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SettingsIcon from "@mui/icons-material/Settings";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useAuth } from "../../context/AuthContext";

export default function HealthcareSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

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
  const isPasswordReset = location.pathname === "/healthcarepassword";

  const handleLogout = () => {
    // Clear both localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to the homepage
    navigate("/");

    // set application auth
    setAuth(false);
  };

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
          src={user.profilePicture}
          sx={{ width: 56, height: 56, marginBottom: 1 }}
        />
        <Typography variant="h6">{user.fullname}</Typography>
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

        {/* Password Reset */}
        {/* <ListItemButton
          key="PasswordReset"
          onClick={() => navigateTo("/healthcarepassword")}
          selected={isPasswordReset}
        >
          <ListItemIcon>
            <VpnKeyIcon />
          </ListItemIcon>
          <ListItemText primary="Password Reset" />
        </ListItemButton> */}

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
