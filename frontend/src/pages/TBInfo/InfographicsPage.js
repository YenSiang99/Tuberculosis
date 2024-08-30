import React, { useState } from "react";
import { Box, Grid, Card, CardContent, Button, Typography,Container } from '@mui/material';
import theme from "../../components/reusable/Theme";

const InfographicsPage = () => {
  const infographics = [
    {
      name: 'Infographic_1.png',
      type: 'single',
    },
    {
      name: 'Infographic_2.png',
      type: 'single',
    },
    {
      name: 'Infographic_3.png',
      type: 'single',
    },
    {
      name: 'Infographic_4.png',
      type: 'single',
    },
    {
      name: 'Infographic_5.png',
      type: 'single',
    },
    {
      name: 'Infographic_6',
      type: 'multi',
      pages: ['Page1.png', 'Page2.png']
    }
  ];

  const [currentInfographicIndex, setCurrentInfographicIndex] = useState(0);
  const totalInfographics = infographics.length;

  const handlePreviousInfographic = () => {
    if (currentInfographicIndex > 0) {
      setCurrentInfographicIndex(currentInfographicIndex - 1);
    }
  };

  const handleNextInfographic = () => {
    if (currentInfographicIndex < totalInfographics - 1) {
      setCurrentInfographicIndex(currentInfographicIndex + 1);
    }
  };

  const getInfographicSrc = (folder, file) => {
    if (file) {
      return require(`../../infographics/${folder}/${file}`);
    } else {
      return require(`../../infographics/${folder}`);
    }
  };

  return (
    <Container sx={{padding: 0 , margin: 0 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold",  color: theme.palette.primary.light }}
      >
        Infographics
      </Typography>
      <Grid container justifyContent="center" alignItems="center">
        {/* Previous and next button */}
        <Grid item container justifyContent="space-between" xs={12}>
          <Grid item  sx={{flexGrow: 0, display: 'flex',alignItems: 'center'}}>
            {currentInfographicIndex > 0 && (
              <Button variant="contained" onClick={handlePreviousInfographic}>
                Previous
              </Button>
            )}
          </Grid>
          <Grid item  sx={{flexGrow: 0, display: 'flex',alignItems: 'center'}}>
            {currentInfographicIndex < totalInfographics - 1 && (
              <Button variant="contained" onClick={handleNextInfographic}>
                Next
              </Button>
            )}
          </Grid>
        </Grid>
        {/*  */}
        <Grid item container>
          { infographics[currentInfographicIndex].type === 'multi' ? (
              <Grid item container  spacing={2} >
                {infographics[currentInfographicIndex].pages.map((page, index) => (
                  <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
                    <img
                      key={index}
                      src={getInfographicSrc(infographics[currentInfographicIndex].name, page)}
                      alt={`Page ${index + 1}`}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </Grid>
                ))}
              </Grid >
          ) : (
            <Grid item >
              <img
                src={getInfographicSrc(infographics[currentInfographicIndex].name)}
                style={{ width: "100%", height: "auto" }}
                alt={`Infographic ${currentInfographicIndex + 1}`}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default InfographicsPage;
