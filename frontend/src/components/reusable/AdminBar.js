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
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PeopleIcon from '@mui/icons-material/People';
// import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  const handleFAQ = () => {
    navigate('/adminfaq');
  };

  const handleUser = () => {
    navigate('/adminuser');
  };

  const isFAQPage = location.pathname === '/adminfaq';
  const isUserPage = location.pathname === '/adminuser';

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
        Admin 
      </Typography>
      <Divider />
      <List>
        
        {/* FAQ Management */}
        <ListItemButton key="FAQs" onClick={handleFAQ} selected={isFAQPage}>
          <ListItemIcon><QuestionAnswerIcon /></ListItemIcon>
          <ListItemText primary="Manage FAQs" />
        </ListItemButton>

        {/* User Management */}
        <ListItemButton key="Users" onClick={handleUser} selected={isUserPage}>
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Manage Users" />
        </ListItemButton>

        {/* Settings */}
        {/* <ListItemButton key="Settings">
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Settings" />
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
