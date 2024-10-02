import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

const VideosPage = () => {
  // Define a list of videos with their filenames and titles
  const videos = [
    {
      src: "./videos/Video 1_ Understanding the Basics_compressed.mp4",
      title: "Understanding the Basics of Tuberculosis",
    },
    {
      src: "./videos/Video 2_ Signs and Symptoms, Treatment and Management of TB_compressed.mp4",
      title: "Fighting Tuberculosis: Innovation and Research",
    },
    {
      src: "./videos/Video 4_ Fighting TB_ Innovation and Research_compressed.mp4",
      title: "Fighting Tuberculosis: Innovation and Research",
    },
    {
      src: "./videos/Video 5_ Direct Observed Therapy (DOT) vs Video Observed Therapy (VOT)_compressed.mp4",
      title: "Fighting Tuberculosis: Innovation and Research",
    },
  ];

  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.light" }}
      >
        Educational Videos
      </Typography>
      <Grid container spacing={2}>
        {videos.map((video, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardMedia
                component="video"
                controls
                src={video.src}
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
