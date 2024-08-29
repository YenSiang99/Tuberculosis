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
    <Box my={4}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
      >
        Infographics
      </Typography>
      <Grid
        container spacing={2} justifyContent="center" alignItems="center"
      >
        <Grid item container justifyContent="space-between" xs={12} sx={{ mt: 2 }}>
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {currentInfographicIndex > 0 && (
              <Button onClick={handlePreviousInfographic}>
                Previous
              </Button>
            )}
          </Box>
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {currentInfographicIndex < totalInfographics - 1 && (
              <Button onClick={handleNextInfographic}>
                Next
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item container justifyContent="center" xs={12}>
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
      </Grid>

    </Box>
  );
};

export default InfographicsPage;
