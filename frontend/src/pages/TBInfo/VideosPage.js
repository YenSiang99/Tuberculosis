import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";

const VideosPage = () => {
  const languages = ["English", "Malay", "Mandarin", "Tamil"];
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  // Define a list of videos with their indexes and titles
  const videos = [
    {
      index: 1,
      title: "Understanding the Basics of Tuberculosis",
    },
    {
      index: 2,
      title: "Signs and Symptoms, Treatment and Management of TB",
    },
    {
      index: 3,
      title: "Fighting Tuberculosis: Innovation and Research",
    },
    {
      index: 4,
      title: "Direct Observed Therapy (DOT) vs Video Observed Therapy (VOT)",
    },
  ];

  const getVideoSrc = (index) => {
    return `./videos/${selectedLanguage}/compressed/Video ${index} (${selectedLanguage}).mp4`;
  };

  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.light" }}
      >
        Educational Videos
      </Typography>
      {/* Language selector */}
      <Grid
        item
        container
        justifyContent="center"
        xs={12}
        sx={{ marginBottom: 2 }}
      >
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
      <Grid container spacing={2}>
        {videos.map((video, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardMedia
                component="video"
                controls
                src={getVideoSrc(video.index)}
                title={video.title}
                style={{ height: 300 }}
              />
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {video.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default VideosPage;
