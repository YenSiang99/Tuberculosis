import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import demoMedicineVideo from "../../videos/Presentation1.mp4";
import { useTheme } from "@mui/material/styles";

const AboutTBCompanionPage = () => {
  const theme = useTheme();
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
              Click the ‘Upload Video’ button in the homepage. Record the video
              then press “Upload” button.
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
              Click the ‘Report Side Effects’ button in the homepage. Select the
              date and time, then tick the checkbox on the symptoms that you are
              experiencing. Then press ‘Submit’ button.
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
              How should I set the reminder to remind me to take medications on
              time?
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
              You need to record your daily medication intake. Please watch this
              video:
            </Typography>
            {/* Embedding the video */}
            <div style={{ width: "100%", overflow: "hidden" }}>
              <video width="20%" height="40%" controls>
                <source src="./videos/Presentation1.mp4" type="video/mp4" />
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

export default AboutTBCompanionPage;
