import React, { useState, useEffect } from "react";
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
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../../context/AuthContext";
import axios from "../../components/axios";

export default function DrawerBar({ handleDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const [userData, setUserData] = useState({});
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/users/profile");
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
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
    fetchUnreadNotificationsCount();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
    setAuth(false);
  };

  const navigateTo = (path) => {
    navigate(path);
    if (handleDrawerToggle) handleDrawerToggle();
  };

  // Menu items for healthcare and patients
  const menuItems = {
    patient: [
      {
        label: "Upload Video",
        icon: <VideoCameraFrontIcon />,
        path: "/patientvideo",
        selected: location.pathname === "/patientvideo",
      },
      {
        label: "Report Side Effects",
        icon: <ReportProblemIcon />,
        path: "/patientsideeffect",
        selected: location.pathname === "/patientsideeffect",
      },
      {
        label: "Appointment",
        icon: <EventAvailableIcon />,
        path: "/patientappointment",
        selected: location.pathname === "/patientappointment",
      },
      {
        label: "Progress Tracker",
        icon: <CalendarTodayIcon />,
        path: "/patientcalendar",
        selected: location.pathname === "/patientcalendar",
      },
      {
        label: "Profile",
        icon: <PersonIcon />,
        path: "/patientprofile",
        selected: location.pathname === "/patientprofile",
      },
    ],
    healthcare: [
      {
        label: "All Patients",
        icon: <GroupIcon />,
        path: "/healthcarepatient",
        selected: location.pathname === "/healthcarepatient",
      },
      {
        label: "Review Video",
        icon: <VideoCameraFrontIcon />,
        path: "/healthcarevideo",
        selected: location.pathname === "/healthcarevideo",
      },
      {
        label: "Review Side Effects",
        icon: <ReportProblemIcon />,
        path: "/healthcaresideeffect",
        selected: location.pathname === "/healthcaresideeffect",
      },
      {
        label: "Appointment",
        icon: <EventAvailableIcon />,
        path: "/healthcareappointment",
        selected: location.pathname === "/healthcareappointment",
      },
      {
        label: "Profile",
        icon: <SettingsIcon />,
        path: "/healthcareprofile",
        selected: location.pathname === "/healthcareprofile",
      },
    ],
  };

  // Determine the role and show the corresponding menu
  const hasRole = (role) => userData.roles && userData.roles.includes(role);

  const isPatient = hasRole("patient");
  const isHealthcare = hasRole("healthcare");
  const isAdmin = hasRole("admin");

  const selectedMenu = isPatient
    ? menuItems.patient
    : isHealthcare
    ? menuItems.healthcare
    : [];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
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
        {selectedMenu.map((item, index) => (
          <ListItemButton
            key={index}
            onClick={() => navigateTo(item.path)}
            selected={item.selected}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        {/* Notifications */}
        <ListItemButton
          onClick={() =>
            navigateTo(
              isPatient ? "/patientnotification" : "/healthcarenotification"
            )
          }
          selected={
            location.pathname ===
            (isPatient ? "/patientnotification" : "/healthcarenotification")
          }
        >
          <ListItemIcon>
            <Badge badgeContent={unreadNotificationsCount} color="error">
              <NotificationsIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItemButton>
        {/* Logout */}
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
