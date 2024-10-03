import React from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import theme from "../../components/reusable/Theme";

import { useTranslation } from "react-i18next";

const FAQsPage = () => {
  const { t } = useTranslation();

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
    // Add more keys if necessary
  ];

  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
      >
        {t("faqs.title")}
      </Typography>

      {faqKeys.map((key, index) => (
        <StyledAccordion key={index}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{t(`faqs.${key}.title`)}</Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Typography>
              {/* Check if content is a list (like symptoms in q2) */}
              {Array.isArray(
                t(`faqs.${key}.symptoms`, { returnObjects: true })
              ) ? (
                <>
                  {t(`faqs.${key}.content`)}
                  <ul>
                    {t(`faqs.${key}.symptoms`, { returnObjects: true }).map(
                      (symptom, idx) => (
                        <li key={idx}>{symptom}</li>
                      )
                    )}
                  </ul>
                </>
              ) : (
                t(`faqs.${key}.content`)
              )}
            </Typography>
          </StyledAccordionDetails>
        </StyledAccordion>
      ))}
    </Container>
  );
};

export default FAQsPage;
