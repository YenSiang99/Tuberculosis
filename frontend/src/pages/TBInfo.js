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

  const StyledAccordion = styled(Accordion)(({ theme }) => ({
    margin: '0.5rem 0',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '8px',
    '&:before': {
      display: 'none',
    },
    '&.Mui-expanded': {
      margin: '0.5rem 0',
    },
    '&:first-of-type': {
      marginTop: 0,
    },
    '&:last-of-type': {
      marginBottom: 0,
    },
  }));

  const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: -1,
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(180deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));
  
  const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }));

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
            sx={{ fontWeight: "bold", color: theme.palette.primary.light, }}
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

        {/* FAQ Section */}
        <Box my={4}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
      >
        Frequently Asked Questions (FAQ)
      </Typography>

      {/* FAQ 1 */}
      <StyledAccordion>
  <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
  <Typography>
      What is Tuberculosis (TB)?
    </Typography>
  </StyledAccordionSummary>
  <StyledAccordionDetails>
    <Typography>
      Tuberculosis (TB) is an infectious disease that most often affects the lungs. 
      TB is caused by a type of bacteria. It spreads through the air when infected people cough, 
      sneeze or spit.
    </Typography>
  </StyledAccordionDetails>
</StyledAccordion>
{/* FAQ 2 */}
<StyledAccordion>
  <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>What are the common signs and symptoms of TB?</Typography>
  </StyledAccordionSummary>
  <StyledAccordionDetails>
    <Typography>
      The most common symptoms of TB include:
      <ul>
        <li>A cough that lasts for more than two (2) weeks</li>
        <li>Cough with sputum which is occasionally bloodstained</li>
        <li>Loss of appetite and weight</li>
        <li>Fever</li>
        <li>Dyspnea, night sweats, chest pain, and hoarseness of voice</li>
      </ul>
    </Typography>
  </StyledAccordionDetails>
</StyledAccordion>

{/* FAQ 3 */}
<StyledAccordion>
  <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>How does TB spread?</Typography>
  </StyledAccordionSummary>
  <StyledAccordionDetails>
    <Typography>
      Infection is usually by direct airborne transmission from person to person.
    </Typography>
  </StyledAccordionDetails>
</StyledAccordion>

{/* FAQ 4 */}
<StyledAccordion>
  <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>Can TB be cured?</Typography>
  </StyledAccordionSummary>
  <StyledAccordionDetails>
    <Typography>
      The vast majority of TB cases can be cured when medicines are provided and taken properly.
    </Typography>
  </StyledAccordionDetails>
</StyledAccordion>

{/* FAQ 5 */}
<StyledAccordion>
  <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>What is the treatment and management of TB?</Typography>
  </StyledAccordionSummary>
  <StyledAccordionDetails>
    <Typography>
      TB disease is treated with a multiple drug regimen for 6-8 months 
      (usually isoniazid, rifampin, ethambutol, and pyrazinamide for 2 months, 
      followed by isoniazid and rifampin for 4 to 6 months) if the TB is not drug resistant.
    </Typography>
  </StyledAccordionDetails>
</StyledAccordion>

{/* FAQ 6 */}
<StyledAccordion>
  <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>What is Direct Observed Therapy (DOT)?</Typography>
  </StyledAccordionSummary>
  <StyledAccordionDetails>
    <Typography>
      DOT is a strategy used to ensure TB patient adherence to and tolerability of the 
      prescribed treatment regimen; a health care worker or another designated person watches 
      the TB patient swallow each dose of the prescribed drugs.
    </Typography>
  </StyledAccordionDetails>
</StyledAccordion>

{/* FAQ 7 */}
<StyledAccordion>
  <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>What is Video Observed Therapy (VOT)?</Typography>
  </StyledAccordionSummary>
  <StyledAccordionDetails>
    <Typography>
      VOT is the use of a videophone or other video/computer equipment to observe tuberculosis (TB) 
      patients taking their medications remotely.
    </Typography>
  </StyledAccordionDetails>
</StyledAccordion>
</Box>

        {/* Videos Section */}
        {/* <Box my={4}>
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
          </Grid>
        </Box> */}

        {/* Links */}
        {/* <Box my={4}>
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
          </List>
        </Box> */}
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
        {/* <Box my={4}>
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
                <Box p={2} textAlign="center">
                  <Typography variant="subtitle1">Video Title 1</Typography>
                  <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
                    <iframe
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                      src="https://www.youtube.com/embed/videoID" 
                      allowFullScreen
                    ></iframe>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box> */}

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
      top: 64,
      height: `calc(100% - 64px)`,
      backgroundColor: "#f4f4f4",
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
            display: "flex",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Logo and Title */}
            <Box
              sx={{
                display: "flex", //
                alignItems: "center",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{ height: "70px", marginRight: theme.spacing(2) }}
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
              sx={{ color: "white", marginRight: 5 }}
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
