import React, { useState } from "react";
import { Box, Grid, Card, CardContent, Button, Typography } from '@mui/material';
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

  const handleNextInfographic = () => {
    setCurrentInfographicIndex((prevIndex) => (prevIndex + 1) % infographics.length);
  };

  const handlePreviousInfographic = () => {
    setCurrentInfographicIndex((prevIndex) => (prevIndex - 1 + infographics.length) % infographics.length);
  };

  const getInfographicSrc = (folder, file) => {
    if (file) {
      return require(`../../infographics/${folder}/${file}`);
    } else {
      return require(`../../infographics/${folder}`);
    }
  };

  return (
    <Box my={4}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
      >
        Infographics
      </Typography>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={1} container justifyContent="center">
          <Button onClick={handlePreviousInfographic} variant="contained" fullWidth>
            Previous
          </Button>
        </Grid>
        <Grid item container justifyContent="center" xs={10}>
          <Card>
            <CardContent>
              {infographics[currentInfographicIndex].type === 'multi' ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  {infographics[currentInfographicIndex].pages.map((page, index) => (
                    <img
                      key={index}
                      src={getInfographicSrc(infographics[currentInfographicIndex].name, page)}
                      style={{ width: "48%", height: "auto", marginLeft: index === 0 ? 0 : "2%" }}
                      alt={`Page ${index + 1}`}
                    />
                  ))}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={getInfographicSrc(infographics[currentInfographicIndex].name)}
                    style={{ width: "100%", height: "100%" }}
                    alt={`Infographic ${currentInfographicIndex + 1}`}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={1} container justifyContent="center">
          <Button onClick={handleNextInfographic} variant="contained" fullWidth>
            Next
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InfographicsPage;
