import React, { useState } from "react";
import { Typography, Box, Grid, Card, CardContent,CardMedia, Button ,
Accordion,
AccordionSummary,
AccordionDetails,
styled,
Dialog, 
DialogActions, 
DialogContent
 } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import theme from "../components/reusable/Theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { getInfographicSrc } from '../utils'; // Assuming you move reusable functions to utils

const AboutTBPage = () => {

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

  const navigate = useNavigate();
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

  // View infographic hooks
  const [open, setOpen] = useState(false);
  const [currentInfographic, setCurrentInfographic] = useState(null);
  const handleClickOpen = (infographic) => {
    setCurrentInfographic(infographic);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getInfographicSrc = (folder, file) => {
        if(file){
          return require(`../infographics/${folder}/${file}`);
        } else {
          return require(`../infographics/${folder}`);
        }
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

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <InfographicModalContent infographic={currentInfographic} />
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      
      </Box>
  );
};

export default AboutTBPage;
