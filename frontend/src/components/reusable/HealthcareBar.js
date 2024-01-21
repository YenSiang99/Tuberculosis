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
import GroupIcon from '@mui/icons-material/Group'; 
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront'; 
import ReportProblemIcon from '@mui/icons-material/ReportProblem'; 
import EventAvailableIcon from '@mui/icons-material/EventAvailable'; 
import SettingsIcon from '@mui/icons-material/Settings'; 
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; 

export default function HealthcareSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (path) => {
    navigate(path);
  };

  // Update these paths and states to match your new routes
  const isAllPatients = location.pathname === '/healthcarepatient';
  const isReviewVideo = location.pathname === '/healthcarevideo';
  const isReviewSideEffect = location.pathname === '/healthcaresideeffect';
  const isAppointment = location.pathname === '/healthcareappointment';
  const isSetting = location.pathname === '/healthcaresetting';

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
      <div style={{ minHeight: 64 }} /> 
      <Typography variant="h6" sx={{ padding: 2 }}>
        Name
      </Typography>
      <Divider />
      <List>
        {/* All Patients */}
        <ListItemButton key="AllPatients" onClick={() => navigateTo('/healthcarepatient')} selected={isAllPatients}>
          <ListItemIcon><GroupIcon /></ListItemIcon>
          <ListItemText primary="All Patients" />
        </ListItemButton>

        {/* Review Video */}
        <ListItemButton key="ReviewVideo" onClick={() => navigateTo('/healthcarevideo')} selected={isReviewVideo}>
          <ListItemIcon><VideoCameraFrontIcon /></ListItemIcon>
          <ListItemText primary="Review Video" />
        </ListItemButton>

        {/* Review Side Effect */}
        <ListItemButton key="ReviewSideEffect" onClick={() => navigateTo('/healthcaresideeffect')} selected={isReviewSideEffect}>
          <ListItemIcon><ReportProblemIcon /></ListItemIcon>
          <ListItemText primary="Review Side Effect" />
        </ListItemButton>

        {/* Appointment */}
        <ListItemButton key="Appointment" onClick={() => navigateTo('/healthcareappointment')} selected={isAppointment}>
          <ListItemIcon><EventAvailableIcon /></ListItemIcon>
          <ListItemText primary="Appointment" />
        </ListItemButton>

        {/* Settings */}
        <ListItemButton key="Settings" onClick={() => navigateTo('/healthcaresetting')} selected={isSetting}>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>

        {/* Logout */}
        <ListItemButton key="Logout" onClick={() => navigateTo('/')}>
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
