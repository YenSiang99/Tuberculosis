import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
  Container,
} from "@mui/material";
import theme from "../../components/reusable/Theme";

const InfographicsPage = () => {
  const languages = ["English", "Malay", "Mandarin", "Tamil"];
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const infographics = [
    {
      index: 1,
      type: "single",
    },
    {
      index: 2,
      type: "single",
    },
    {
      index: 3,
      type: "single",
    },
    {
      index: 4,
      type: "single",
    },
    {
      index: 5,
      type: "single",
    },
    {
      index: 6,
      type: "single",
    },
    {
      index: 7,
      type: "single",
    },
    {
      index: 8,
      type: "single",
    },
    // Example of a multi-page infographic
    // {
    //   index: 6,
    //   type: "multi",
    //   pages: 2, // Number of pages
    // },
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

  const getInfographicSrc = (index, pageNumber) => {
    const folder = selectedLanguage;
    let fileName;
    if (pageNumber) {
      fileName = `Infographic ${index} (${selectedLanguage}).png`;
    } else {
      fileName = `Infographic ${index} (${selectedLanguage}).png`;
    }
    return `./infographics/${folder}/${fileName}`;
  };

  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
      >
        Infographics
      </Typography>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {/* Language selector */}
        <Grid item container justifyContent="center" xs={12}>
          {languages.map((language) => (
            <Button
              key={language}
              variant={selectedLanguage === language ? "contained" : "outlined"}
              onClick={() => setSelectedLanguage(language)}
              sx={{ margin: "0 8px" }}
            >
              {language}
            </Button>
          ))}
        </Grid>
        {/* Previous and next button */}
        <Grid item container justifyContent="space-between" xs={12}>
          <Grid
            item
            sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}
          >
            {currentInfographicIndex > 0 && (
              <Button variant="contained" onClick={handlePreviousInfographic}>
                Previous
              </Button>
            )}
          </Grid>
          <Grid
            item
            sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}
          >
            {currentInfographicIndex < totalInfographics - 1 && (
              <Button variant="contained" onClick={handleNextInfographic}>
                Next
              </Button>
            )}
          </Grid>
        </Grid>
        {/* Infographic content */}
        <Grid item container>
          {infographics[currentInfographicIndex].type === "multi" ? (
            <Grid item container spacing={2}>
              {Array.from(
                {
                  length: infographics[currentInfographicIndex].pages,
                },
                (_, index) => (
                  <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
                    <img
                      key={index}
                      src={getInfographicSrc(
                        infographics[currentInfographicIndex].index,
                        index + 1
                      )}
                      alt={`Infographic ${
                        infographics[currentInfographicIndex].index
                      } Page ${index + 1}`}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Grid>
                )
              )}
            </Grid>
          ) : (
            <Grid item>
              <img
                src={getInfographicSrc(
                  infographics[currentInfographicIndex].index
                )}
                style={{ width: "100%", height: "auto" }}
                alt={`Infographic ${infographics[currentInfographicIndex].index}`}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default InfographicsPage;
