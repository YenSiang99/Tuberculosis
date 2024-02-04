import React, { useState } from "react";
import {
  ThemeProvider,
  AppBar,
  Toolbar,
  Drawer,
  ListItemButton,
  Container,
  CardMedia,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import theme from "../components/reusable/Theme";
import BgImage from "../images/cover.jpeg";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";
import infographic from "../images/TBInfographic.png";

const drawerWidth = 240;

export default function Public() {
  const [activeSection, setActiveSection] = useState("About TB");
  const navigate = useNavigate();

  // const CustomAccordion = styled(Accordion)(({ theme }) => ({
  //   backgroundColor: theme.palette.background.paper, // Background for the entire accordion
  //   boxShadow: theme.shadows[1],
  //   '&:before': {
  //     display: 'none',
  //   },
  //   '& .MuiAccordionSummary-root': {
  //     backgroundColor: '#f3f6f9', // Background color for the question
  //   },

  // }));

  const AboutTBContent = () => {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          Tuberculosis (TB)
        </Typography>

        {/* Infographics Section */}
        <Box my={4}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
          >
            Infographics
          </Typography>
          <Grid container spacing={2}>
            {/* Infographic Card 1 */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <img
                    src={infographic}
                    style={{ width: "100%", height: "auto" }}
                  />
                </CardContent>
              </Card>
            </Grid>
            {/* Infographic Card 2 */}
            {/* <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Infographic Title 2
                  </Typography>
                  <img
                    src="/path-to-infographic1.jpg"
                    alt="Infographic 1"
                    style={{ width: "100%", height: "auto" }}
                  />
                </CardContent>
              </Card>
            </Grid> */}
          </Grid>
        </Box>

        {/* Videos Section */}
        <Box my={4}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
          >
            Educational Videos
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardMedia
                  component="iframe"
                  src="https://www.youtube.com/embed/videoID"
                  title="Video Title 1"
                  style={{ height: 300 }}
                />
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Video Title 1
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* ... Add more videos as needed */}
          </Grid>
        </Box>

        {/* Links */}
        <Box my={4}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
          >
            Links For More Information
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="World Health Organization on TB"
                secondary="https://www.who.int/tb"
              />
            </ListItem>
            {/* ... Add more links as needed */}
          </List>
        </Box>
      </Box>
    );
  };

  const AboutMyTBCompanion = () => {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          MyTBCompanion
        </Typography>

        {/* Videos */}
        <Box my={4}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
          >
            Videos
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3}>
                {/* Replace with actual video */}
                <Box p={2} textAlign="center">
                  <Typography variant="subtitle1">Video Title 1</Typography>
                  {/* Example placeholder for video */}
                  <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
                    <iframe
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                      src="https://www.youtube.com/embed/videoID" // Replace with your video link
                      allowFullScreen
                    ></iframe>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            {/* ... Add more videos as needed */}
          </Grid>
        </Box>

        {/* FAQ Section */}
        {/* <Box my={4}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
      >
        Frequently Asked Questions (FAQ)
      </Typography>
      <CustomAccordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Question 1: What is Tuberculosis?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Tuberculosis (TB) is an infectious disease typically affecting the lungs.
          </Typography>
        </AccordionDetails>
      </CustomAccordion>

    </Box> */}
      </Box>
    );
  };

  const sections = {
    "About TB": <AboutTBContent />,
    "About MyTBCompanion": <AboutMyTBCompanion />,
  };

  const handleListItemClick = (section) => {
    setActiveSection(section);
  };

  const drawerStyle = {
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      top: 64, // Adjust this value to match the height of AppBar
      height: `calc(100% - 64px)`, // Adjust this value to match the height of AppBar
      backgroundColor: "#f4f4f4", // Drawer background color
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppBar
          position="fixed"
          color="transparent"
          elevation={0}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "white",
            borderBottom: "1px solid #ddd",
            display: "flex", // Ensure AppBar is using flex layout
          }}
        >
          <Toolbar
            sx={{
              display: "flex", // Use flex layout for the contents
              justifyContent: "space-between", // Space between logo and button
              width: "100%", // Ensure the Toolbar takes up full width
            }}
          >
            {/* Logo and Title */}
            <Box
              sx={{
                display: "flex", // Use flex layout for the logo and title
                alignItems: "center", // Align items vertically
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{ height: "50px", marginRight: theme.spacing(2) }}
              />
              <Typography variant="h5" color="inherit">
                <span style={{ color: "#0046c0", fontWeight: "bold" }}>My</span>
                <span style={{ color: "#4cbcea", fontWeight: "bold" }}>TB</span>
                <span style={{ color: "#0046c0", fontWeight: "bold" }}>
                  Companion
                </span>
              </Typography>
            </Box>

            {/* Back to Login Button */}
            <Button
              variant="contained"
              sx={{  color: "white", marginRight: 5 }}
              onClick={() => navigate("/")}
            >
              Back to Login
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <Drawer variant="permanent" sx={drawerStyle}>
            <List>
              {Object.keys(sections).map((section) => (
                <ListItemButton
                  key={section}
                  onClick={() => handleListItemClick(section)}
                  sx={{
                    bgcolor:
                      activeSection === section ? "#0046c0" : "transparent",
                    color: activeSection === section ? "white" : "inherit",
                    "&:hover": {
                      bgcolor: "#e3f2fd",
                      color: "black",
                    },
                    "&.Mui-selected": {
                      bgcolor: "#0046c0",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#e3f2fd",
                        color: "black",
                      },
                    },
                  }}
                >
                  <ListItemText primary={section} />
                </ListItemButton>
              ))}
            </List>
          </Drawer>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: "background.default",
              p: 3,
              backgroundImage: `linear-gradient(to bottom, rgba(217, 241, 251, 0.8), rgba(217, 241, 251, 0.8)), url(${BgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Container>
              <Paper
                style={{
                  padding: theme.spacing(2),
                  marginTop: theme.spacing(8),
                }}
              >
                {sections[activeSection]}
              </Paper>
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
