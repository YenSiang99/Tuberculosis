import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, styled } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import theme from "../../components/reusable/Theme";

const FAQsPage = () => {

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

  return (
    <Box my={4}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
      >
        Frequently Asked Questions (FAQs)
      </Typography>

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
  );
};

export default FAQsPage;
