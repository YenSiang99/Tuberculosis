import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, Divider, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

export default function NavBar() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Define the active and hover styles
  const activeStyle = {
    bgcolor: theme.palette.primary.light, 
    color: '#ffffff',
    borderRadius: theme.shape.borderRadius,
    boxShadow: `inset 0 -2px 0 0 ${theme.palette.primary.dark}`,
    '&:hover': {
      bgcolor: theme.palette.primary.light, 
      color: '#ffffff', 
    },
  };

  const linkStyle = {
    color: theme.palette.primary.main, 
    bgcolor: 'transparent', 
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      bgcolor: theme.palette.action.hover, 
      color: "#0046c0", 
    },
  };

  const navButtonStyle = {
    color: theme.palette.primary.main,
    textDecoration: 'none', // Remove the underline from the NavLink
    display: 'flex', // Align the Button inside the NavLink properly
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: 'white', color: theme.palette.text.primary, boxShadow: 1 }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color: theme.palette.primary.main }}
          >
            MyTBCompanion
          </Typography>

          {/* Display navigation links for large screens */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'start' }}>
            <NavLink to="/" style={{ textDecoration: 'none', marginRight: theme.spacing(2) }} end>
              {({ isActive }) => (
                <Button sx={isActive ? activeStyle : linkStyle}>Home</Button>
              )}
            </NavLink>
            <NavLink to="/faq" style={{ textDecoration: 'none', marginRight: theme.spacing(2) }}>
              {({ isActive }) => (
                <Button sx={isActive ? activeStyle : linkStyle}>FAQ</Button>
              )}
            </NavLink>
          </Box>
          
          {/* Always visible Login button */}
          <NavLink to="/login" style={navButtonStyle}>
          <Button color="inherit" sx={{ color: theme.palette.primary.main }}>
            <strong>Login</strong>
          </Button>
          </NavLink>

          {/* Display menu icon for small screens */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>

        {/* Collapsible menu for small screens */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose} component={NavLink} to="/">Home</MenuItem>
          <MenuItem onClick={handleClose} component={NavLink} to="/faq">FAQ</MenuItem>
        </Menu>
      </AppBar>
      <Divider sx={{ bgcolor: theme.palette.divider }} />
    </>
  );
}