import React, { useState } from 'react';
import {
  Box,
  ThemeProvider,
  AppBar,
  Toolbar,
  Drawer,
  ListItemButton,
  ListItemText,
  Button,
  Container,
  Paper,
  Typography,
  Collapse,
  List,
  ListItemIcon
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import GamesIcon from '@mui/icons-material/Games';  // Icon for the games section
import { useNavigate } from 'react-router-dom';
import theme from '../components/reusable/Theme';
import GamesPage from './GamesPage';
import BgImage from '../assets/cover.jpeg';
import AboutTBPage from './AboutTBPage';
import AboutTBCompanionPage from './AboutTBCompanionPage';
import WordSearchPage from './Games/WordSearchPage';
import QuizPage from './Games/QuizPage';
import InteractiveStoryPage from './Games/InteractiveStoryPage';
import FillInBlanksPage from './Games/FillInBlanksPage';
import TrueFalsePage from './Games/TrueFalsePage';

const TBInfo = () => {
  const [activeSection, setActiveSection] = useState('WordSearch');
  const [openGames, setOpenGames] = useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    setOpenGames(!openGames);
    setActiveSection('Games'); // Show general GamesPage when clicking on "Games"
  };

  const sections = {
    'About TB': <AboutTBPage />,
    'About MyTBCompanion': <AboutTBCompanionPage />,
    'Games': <GamesPage setActiveSection={setActiveSection} />,
    'WordSearch': <WordSearchPage />,
    'QuizPage': <QuizPage />,
    'InteractiveStory': <InteractiveStoryPage />,
    'FillBlanks': <FillInBlanksPage />,
    'TrueFalse': <TrueFalsePage />
  };

  const gamesList = {
    'Word Search Game': 'WordSearch',
    'Quiz': 'QuizPage',
    'Interactive Story': 'InteractiveStory',
    'Fill in the Blanks': 'FillBlanks',
    'True or False': 'TrueFalse'
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
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
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
              {Object.keys(sections).filter(section => !Object.values(gamesList).includes(section)).map((section) => (
                <ListItemButton key={section} onClick={() => setActiveSection(section)} sx={{ bgcolor: activeSection === section ? '#0046c0' : 'transparent', color: activeSection === section ? 'white' : 'inherit', '&:hover': { bgcolor: '#e3f2fd', color: 'black' }, '&.Mui-selected': { bgcolor: '#0046c0', color: 'white', '&:hover': { bgcolor: '#e3f2fd', color: 'black' } } }}>
                  <ListItemText primary={section} />
                </ListItemButton>
              ))}
              <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                  <GamesIcon />
                </ListItemIcon>
                <ListItemText primary="Games" />
                {openGames ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openGames} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {Object.entries(gamesList).map(([game, key]) => (
                    <ListItemButton key={key} sx={{ pl: 4 }} onClick={() => setActiveSection(key)}>
                      <ListItemText primary={game} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </List>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, backgroundImage: `linear-gradient(to bottom, rgba(217, 241, 251, 0.8), rgba(217, 241, 251, 0.8)), url(${BgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <Container>
              <Paper style={{ padding: theme.spacing(2), marginTop: theme.spacing(8) }}>
                {sections[activeSection]}
              </Paper>
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default TBInfo;
