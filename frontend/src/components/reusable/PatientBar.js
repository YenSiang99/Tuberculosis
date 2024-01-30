import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; 
import VpnKeyIcon from '@mui/icons-material/VpnKey';

export default function PatientSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  
const handleDrawerToggle = () => {
  setMobileOpen(!mobileOpen);
};

const navigateTo = (path) => {
  navigate(path);
  if (handleDrawerToggle) {
    handleDrawerToggle(); 
  }
};

  const isVideo = location.pathname === '/patientvideo';
  const isSideEffect = location.pathname === '/patientsideeffect';
  const isAppointment = location.pathname === '/patientappointment';
  const isProfile = location.pathname === '/patientprofile';
  const isPasswordReset = location.pathname === '/patientpassword';
  
  const handleLogout = () => {
    // Clear both localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to the homepage
    navigate('/'); 
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <div style={{ minHeight: 64 }} /> {/* Replacing the toolbar height */}
      <Typography variant="h6" sx={{ padding: 2 }}>
        Patient Name
      </Typography>
      <Divider />
      <List>
        {/* Video Upload */}
        <ListItemButton key="VideoUpload" onClick={() => navigateTo('/patientvideo')} selected={isVideo}>
          <ListItemIcon><VideoCameraFrontIcon /></ListItemIcon>
          <ListItemText primary="Upload Video" />
        </ListItemButton>

        {/* Side Effect Reporting */}
        <ListItemButton key="SideEffects" onClick={() => navigateTo('/patientsideeffect')} selected={isSideEffect}>
          <ListItemIcon><ReportProblemIcon /></ListItemIcon>
          <ListItemText primary="Report Side Effects" />
        </ListItemButton>

        {/* Book Appointment */}
        <ListItemButton key="BookAppointment" onClick={() => navigateTo('/patientappointment')} selected={isAppointment}>
          <ListItemIcon><EventAvailableIcon /></ListItemIcon>
          <ListItemText primary="Appointment" />
        </ListItemButton>

         {/* My Calendar */}
         <ListItemButton key="MyCalendar" onClick={() => navigateTo('/patientcalendar')} selected={location.pathname === '/patientcalendar'}>
          <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
          <ListItemText primary="Progress Tracker" />
        </ListItemButton>

        {/* Profile */}
        <ListItemButton key="Profile" onClick={() => navigateTo('/patientprofile')} selected={isProfile}>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>

        {/* Password Reset
        <ListItemButton key="PasswordReset" onClick={() => navigateTo('/patientpassword')} selected={isPasswordReset}>
          <ListItemIcon><VpnKeyIcon /></ListItemIcon>
          <ListItemText primary="Password Reset" />
        </ListItemButton> */}

        {/* Logout */}
        <ListItemButton key="Logout" onClick={handleLogout}>
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
