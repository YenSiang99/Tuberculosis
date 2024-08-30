import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import theme from "../../components/reusable/Theme";

const VideosPage = () => {
  return (
    <Container  sx={{padding: 0 , margin: 0 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
      >
        Educational Videos
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="iframe"
              src="https://drive.google.com/file/d/1-8GPpy16eowM2e0K9_e665oceZPkNYBm/preview"
              title="Understanding the Basics of Tuberculosis"
              style={{ height: 300 }}
            />
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Understanding the Basics of Tuberculosis
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="iframe"
              src="https://drive.google.com/file/d/1ZVMwGYad30XSEbY_QWXupF0pQWrYX1xq/preview"
              title="Fighting Tuberculosis: Innovation and Research"
              style={{ height: 300 }}
            />
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Fighting Tuberculosis: Innovation and Research
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VideosPage;
