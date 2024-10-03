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

import { useTranslation } from "react-i18next";

const AboutTBCompanionPage = () => {
  const { t } = useTranslation();
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

  const faqKeys = [
    "q1",
    "q2",
    "q3",
    "q4",
    "q5",
    "q6",
    "q7",
    "q8",
    "q9",
    "q10",
    "q11",
    "q12",
    "q13",
  ];
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

        {faqKeys.map((key, index) => (
          <StyledAccordion key={index}>
            {/* Title */}
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{t(`about.${key}.title`)}</Typography>
            </StyledAccordionSummary>
            {/* Content */}
            <StyledAccordionDetails>
              <Typography>
                {/* If the content is an array, render a list */}
                {Array.isArray(
                  t(`about.${key}.content`, { returnObjects: true })
                ) ? (
                  <ul>
                    {t(`about.${key}.content`, { returnObjects: true }).map(
                      (item, idx) => (
                        <li key={idx}>{item}</li>
                      )
                    )}
                  </ul>
                ) : (
                  t(`about.${key}.content`)
                )}
                {/* Video embedding for specific FAQ (e.g., q11) */}
                {key === "q11" && (
                  <div style={{ width: "100%", overflow: "hidden" }}>
                    <video width="20%" height="40%" controls>
                      <source
                        src="./videos/Presentation1.mp4"
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>
        ))}
      </Box>
    </Box>
  );
};

export default AboutTBCompanionPage;
