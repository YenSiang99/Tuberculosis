import React, { useState, useEffect } from 'react';
import NavBar from './reusable/NavBar';
import theme from './reusable/Theme';
import { 
  ThemeProvider, 
  useMediaQuery, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  alpha 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const faqData = {
  'About Tuberculosis': [
    { question: "What is Tuberculosis?", answer: "Tuberculosis (TB) is an infectious disease usually caused by Mycobacterium tuberculosis bacteria." },
    { question: "How is TB spread?", answer: "TB is spread through the air when a person with TB of the lungs or throat coughs, speaks, or sings." },
    // Add more questions here
  ],
  'About Website': [
    { question: "How to register?", answer: "..." },
    // Add more questions here
  ],
  // Add more categories and their questions here
};

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState(sessionStorage.getItem('selectedCategory') || Object.keys(faqData)[0]);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    sessionStorage.setItem('selectedCategory', selectedCategory);
  }, [selectedCategory]);

  const handleListItemClick = (category) => {
    setSelectedCategory(category);
  };

  const renderCategoryItem = (category) => (
    <ListItem
      button
      key={category}
      selected={selectedCategory === category}
      onClick={() => handleListItemClick(category)}
      style={{
        backgroundColor: selectedCategory === category ? alpha(theme.palette.primary.main, 0.2) : 'transparent',
        borderRadius: '4px',
        marginBottom: theme.spacing(1)
      }}
    >
      <HelpOutlineIcon color="primary" style={{ marginRight: theme.spacing(1) }} />
      <Typography variant="body1">{category}</Typography>
    </ListItem>
  );

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Container maxWidth="lg" style={{ marginTop: 30, padding: isSmallScreen ? 15 : 30 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom style={{ color: theme.palette.primary.main }}>
              FAQ Categories
            </Typography>
            <List component="nav">
              {Object.keys(faqData).map(renderCategoryItem)}
            </List>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', marginBottom: 20 }}>
              Frequently Asked Questions
            </Typography>
            <Paper elevation={0} style={{
                padding: isSmallScreen ? 15 : 30, 
                border: '1px solid #ddd', 

              }}>
              {faqData[selectedCategory].map((faq, index) => (
                <Accordion key={index} style={{ marginBottom: 10, boxShadow: 'none' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: '#f7f7f7' }}>                    <Typography style={{ fontWeight: 'bold' }}>{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
