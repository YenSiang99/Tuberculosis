import React, { useState } from 'react';
import { Box, ThemeProvider, AppBar, Toolbar, Drawer, ListItemButton, ListItemText, Button, Container, Paper, Typography, Collapse, List, ListItemIcon } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import InfoIcon from '@mui/icons-material/Info';
import GamesIcon from '@mui/icons-material/Games';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import theme from '../components/reusable/Theme';
import BgImage from '../assets/cover.jpeg';

const TBInfo = () => {
  const [openGames, setOpenGames] = useState(true);
  const [openAboutTB, setOpenAboutTB] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleGamesClick = () => {
    setOpenGames(!openGames);
  };

  const handleAboutTBClick = () => {
    setOpenAboutTB(!openAboutTB);
  };

  const drawerWidth = 240;

  const drawerStyle = {
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      top: 64,
      height: `calc(100% - 64px)`,
      backgroundColor: '#f4f4f4',
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="fixed" color="transparent" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'white', borderBottom: '1px solid #ddd', display: 'flex' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src="./logo.png" alt="Logo" style={{ height: '70px', marginRight: theme.spacing(2) }} />
              <Typography variant="h5" color="inherit">
                <span style={{ color: '#0046c0', fontWeight: 'bold' }}>My</span>
                <span style={{ color: '#4cbcea', fontWeight: 'bold' }}>TB</span>
                <span style={{ color: '#0046c0', fontWeight: 'bold' }}>Companion</span>
              </Typography>
            </Box>
            <Button variant="contained" sx={{ color: 'white', marginRight: 5 }} onClick={() => navigate("/")}>
              Back to Login
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <Drawer variant="permanent" sx={drawerStyle}>
            <List>
              {/* About TB Section */}
              <ListItemButton onClick={handleAboutTBClick}>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="About TB" />
                {openAboutTB ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openAboutTB} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    onClick={() => navigate('/tb-info/infographics')}
                    selected={location.pathname === '/tb-info/infographics'}
                  >
                    <ListItemText primary="Infographics" />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    onClick={() => navigate('/tb-info/videos')}
                    selected={location.pathname === '/tb-info/videos'}
                  >
                    <ListItemText primary="Videos" />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    onClick={() => navigate('/tb-info/faqs')}
                    selected={location.pathname === '/tb-info/faqs'}
                  >
                    <ListItemText primary="FAQs" />
                  </ListItemButton>
                </List>
              </Collapse>

              {/* Games Section */}
              <ListItemButton onClick={handleGamesClick}>
                <ListItemIcon>
                  <GamesIcon />
                </ListItemIcon>
                <ListItemText primary="Games" />
                {openGames ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openGames} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton 
                    sx={{ pl: 4 }}
                    onClick={() => navigate('/tb-info/games/word-search')}
                    selected={location.pathname === '/tb-info/games/word-search'}
                  >
                    <ListItemText primary="Word Search" />
                  </ListItemButton>
                  <ListItemButton 
                    sx={{ pl: 4 }}
                    onClick={() => navigate('/tb-info/games/quiz')}
                    selected={location.pathname === '/tb-info/games/quiz'}
                  >
                    <ListItemText primary="Quiz" />
                  </ListItemButton>
                  <ListItemButton 
                    sx={{ pl: 4 }}
                    onClick={() => navigate('/tb-info/games/interactive-story')}
                    selected={location.pathname === '/tb-info/games/interactive-story'}
                  >
                    <ListItemText primary="Interactive Story" />
                  </ListItemButton>
                  <ListItemButton 
                    sx={{ pl: 4 }}
                    onClick={() => navigate('/tb-info/games/fill-in-blanks')}
                    selected={location.pathname === '/tb-info/games/fill-in-blanks'}
                  >
                    <ListItemText primary="Fill in the Blanks" />
                  </ListItemButton>
                  <ListItemButton 
                    sx={{ pl: 4 }}
                    onClick={() => navigate('/tb-info/games/true-false')}
                    selected={location.pathname === '/tb-info/games/true-false'}
                  >
                    <ListItemText primary="True or False" />
                  </ListItemButton>
                </List>
              </Collapse>

              {/* About MyTBCompanion */}
              <ListItemButton
                onClick={() => navigate('/tb-info/about')}
                sx={{
                  bgcolor: location.pathname === '/tb-info/about' ? '#0046c0' : 'transparent',
                  color: location.pathname === '/tb-info/about' ? 'white' : 'inherit',
                  '&:hover': { bgcolor: '#e3f2fd', color: 'black' },
                  '&.Mui-selected': {
                    bgcolor: '#0046c0',
                    color: 'white',
                    '&:hover': { bgcolor: '#e3f2fd', color: 'black' }
                  }
                }}
                selected={location.pathname === '/tb-info/about'}
              >
                <ListItemText primary="About MyTBCompanion" />
              </ListItemButton>
            </List>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, backgroundImage: `linear-gradient(to bottom, rgba(217, 241, 251, 0.8), rgba(217, 241, 251, 0.8)), url(${BgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <Container>
              <Paper style={{ padding: theme.spacing(2), marginTop: theme.spacing(8) }}>
                <Outlet />
              </Paper>
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default TBInfo;
