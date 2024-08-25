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
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  Button,
  Dialog, 
  DialogContent, 
  DialogActions, 
  Slide
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

// assets
import theme from "../components/reusable/Theme";
import BgImage from "../assets/cover.jpeg";

// import infographics
import infographic1 from "../infographics/Infographic_1.png";


// import videos
import demoMedicineVideo from "../videos/Presentation1.mp4";

const drawerWidth = 240;

export default function Public() {
  const [activeSection, setActiveSection] = useState("About TB");
  const navigate = useNavigate();

  // View infographic hooks
  const [open, setOpen] = useState(false);
  const [currentInfographic, setCurrentInfographic] = useState(null);

  // Modal handling functions
  const handleClickOpen = (infographic) => {
    setCurrentInfographic(infographic);
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  // This function can determine the path based on infographic id or name
  const getInfographicSrc = (folder, file) => {
    if(file){
      return require(`../infographics/${folder}/${file}`);
    } else {
      return require(`../infographics/${folder}`);
    }
  };


  // Style code
  const StyledAccordion = styled(Accordion)(({ theme }) => ({
    margin: "0.5rem 0",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "8px",
    "&:before": {
      display: "none",
    },
    "&.Mui-expanded": {
      margin: "0.5rem 0",
    },
    "&:first-of-type": {
      marginTop: 0,
    },
    "&:last-of-type": {
      marginBottom: 0,
    },
  }));

  const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: -1,
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(180deg)",
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  }));

  const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));


  // Component
  const AboutTBContent = () => {

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const infographics = [
      {
        name: 'Infographic_1.png',
        type: 'single', 
      },
      {
        name: 'Infographic_2',
        type: 'multi',
        pages: ['Page1.png', 'Page2.png', 'Page3.png', 'Page4.png']
      },
      {
        name: 'Infographic_4',
        type: 'multi',
        pages: ['Page1.png', 'Page2.png']
      }
    ];
    

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
            {infographics.map((infographic, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card onClick={() => handleClickOpen(infographic)}>
                <CardContent>
                  <img
                    src={infographic.type === 'multi' ? getInfographicSrc(infographic.name, infographic.pages[0]) : getInfographicSrc(infographic.name)}
                    style={{ width: "100%", height: "auto" }}
                    alt={`Infographic ${index + 1}`}
                  />
                </CardContent>
                </Card>
                
              </Grid>
            ))}
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
              <Typography>What is Tuberculosis (TB)?</Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>
                Tuberculosis (TB) is an infectious disease that most often
                affects the lungs. TB is caused by a type of bacteria. It
                spreads through the air when infected people cough, sneeze or
                spit.
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>
          {/* FAQ 2 */}
          <StyledAccordion>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                What are the common signs and symptoms of TB?
              </Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>
                The most common symptoms of TB include:
                <ul>
                  <li>A cough that lasts for more than two (2) weeks</li>
                  <li>Cough with sputum which is occasionally bloodstained</li>
                  <li>Loss of appetite and weight</li>
                  <li>Fever</li>
                  <li>
                    Dyspnea, night sweats, chest pain, and hoarseness of voice
                  </li>
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
                Infection is usually by direct airborne transmission from person
                to person.
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
                The vast majority of TB cases can be cured when medicines are
                provided and taken properly.
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>

          {/* FAQ 5 */}
          <StyledAccordion>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                What is the treatment and management of TB?
              </Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>
                TB disease is treated with a multiple drug regimen for 6-8
                months (usually isoniazid, rifampin, ethambutol, and
                pyrazinamide for 2 months, followed by isoniazid and rifampin
                for 4 to 6 months) if the TB is not drug resistant.
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
                DOT is a strategy used to ensure TB patient adherence to and
                tolerability of the prescribed treatment regimen; a health care
                worker or another designated person watches the TB patient
                swallow each dose of the prescribed drugs.
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
                VOT is the use of a videophone or other video/computer equipment
                to observe tuberculosis (TB) patients taking their medications
                remotely.
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>
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
          {/* Video 1 */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardMedia
                  component="iframe"
                  src="https://drive.google.com/file/d/1-8GPpy16eowM2e0K9_e665oceZPkNYBm/preview"
                  title="Understanding the Basics of Tuberculosis"
                  style={{ height: 300 }}
                />
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Understanding the Basics of Tuberculosis
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardMedia
                  component="iframe"
                  src="https://drive.google.com/file/d/1ZVMwGYad30XSEbY_QWXupF0pQWrYX1xq/preview"
                  title="Fighting Tuberculosis: Innovation and Research"
                  style={{ height: 300 }}
                />
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Fighting Tuberculosis: Innovation and Research
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

           
                 
          </Grid>
        </Box>

        {/* Links */}
      
      </Box>
    );
  };

  const AboutMyTBCompanion = () => {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          MyTBCompanion
        </Typography>

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
              <Typography>What is MyTBCompanion?</Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>
                MyTBCompanion is a mobile health application to improve the
                Tuberculosis management among the patients and healthcare. Its
                main feature is the Video Observed Therapy.
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>
          {/* FAQ 2 */}
          <StyledAccordion>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>What can MyTBCompanion do?</Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>
                <ul>
                  <li>Self-medication video upload</li>
                  <li>Side-effect reporting</li>
                  <li>Booking appointment</li>
                  <li>Progress monitoring</li>
                  <li>Reminders for medications and alerts</li>
                </ul>
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>

          {/* FAQ 3 */}
          <StyledAccordion>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>How should I register?</Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>
                Enter email, password, personal information and treatment
                information.
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>

          {/* FAQ 4 */}
          <StyledAccordion>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>How do I record and upload the video?</Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>
                Click the ‘Upload Video’ button in the homepage. Record the
                video then press “Upload” button.
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>

          {/* FAQ 5 */}
          <StyledAccordion>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                Is there any specification and requirement of the video?
              </Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>No</Typography>
            </StyledAccordionDetails>
          </StyledAccordion>

          {/* FAQ 6 */}
          <StyledAccordion>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                How should I report the side effects of the medication?
              </Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>
                Click the ‘Report Side Effects’ button in the homepage. Select
                the date and time, then tick the checkbox on the symptoms that
                you are experiencing. Then press ‘Submit’ button.
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>

          {/* FAQ 7 */}
          <StyledAccordion>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                How should I track the progress of my medication?
              </Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>
                Go to Profile page and click the progress tracker.
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>

          {/* FAQ 9 */}
          <StyledAccordion>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                How should I make an appointment for online consultations?
              </Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>
                Click the ‘Make Appointment’ button in the homepage. Then select
                the date and time. Finally click the ‘Book” button.
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>

          {/* FAQ 10 */}
          <StyledAccordion>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                How should I set the reminder to remind me to take medications
                on time?
              </Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>
                Go to Profile page and click ‘Settings’. Then click ‘Reminder’.
                Toggle the ‘Medication Reminder’ then set the time for the
                reminder.{" "}
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>

          {/* FAQ 11 */}
          <StyledAccordion>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                Where can I find information related to TB or the app?
              </Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>
                You may use Umi (chatbot) or explore the Materials section.
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>

          {/* FAQ 12 */}
          <StyledAccordion>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>What should I record for the video?</Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>
                You need to record your daily medication intake. Please watch
                this video:
              </Typography>
              {/* Embedding the video */}
              <div style={{ width: "100%", overflow: "hidden" }}>
                <video width="20%" height="40%" controls>
                  <source src={demoMedicineVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </StyledAccordionDetails>
          </StyledAccordion>

          {/* FAQ 13 */}
          <StyledAccordion>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>How do I edit my profile ?</Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>
                Go to Profile page and click the ‘Pen’ icon on the top right
                corner to edit your profile information.{" "}
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>

          {/* FAQ 14 */}
          <StyledAccordion>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                How do I view the history of my appointment and side effects ?
              </Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>Go to Profile page and click ‘History’. </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>
        </Box>
      </Box>
    );
  };

  const InfographicModalContent = ({ infographic }) => {
    const [activeStep, setActiveStep] = useState(0);
  
    if (!infographic) return null;
  
    const isMultiPage = infographic.type === 'multi';
    const maxSteps = isMultiPage ? infographic.pages.length : 1;
  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
    };
  
    return (
      <DialogContent>
        {isMultiPage ? (
          <Box>
            <img
              src={getInfographicSrc(infographic.name, infographic.pages[activeStep])}
              style={{ width: "100%", height: "auto" }}
              alt={`Page ${activeStep + 1}`}
            />
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, justifyContent: 'space-between' }}>
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                {'Back'}
              </Button>
              <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                {'Next'}
              </Button>
            </Box>
          </Box>
        ) : (
          <img src={getInfographicSrc(infographic.name)} style={{ width: "100%", height: "auto" }} alt="Infographic" />
        )}
      </DialogContent>
    );
  };

  // Page layout code
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
                src="./logo.png"
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

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <InfographicModalContent infographic={currentInfographic} />
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
