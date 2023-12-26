import React from "react";
import NavBar from "./reusable/NavBar";
import theme from "./reusable/Theme";
import { ThemeProvider } from "@mui/material/styles"; 
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  useMediaQuery,
} from "@mui/material";
import BgImage from "./image/cover.jpeg";

export default function Public() {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const backgroundOverlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    opacity: 0.5,
  };
  const handleFAQClick = () => {
    navigate('/faq');
  };

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Box
        sx={{
          minHeight: "35vh",
          backgroundColor: theme.palette.background.default,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          p: theme.spacing(4),
        }}
      >
        <Box
          component="img"
          src={BgImage}
          alt="Doctor"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.5,
          }}
        />
        <Box sx={backgroundOverlayStyle} />
        <Container
          maxWidth="md"
          sx={{
            zIndex: 1,
            padding: theme.spacing(4),
            alignSelf: "flex-start",
            marginLeft: 0,
            paddingLeft: 0,
          }}
        >
          <Typography
            variant={isSmallScreen ? "h4" : "h3"}
            component="h1"
            gutterBottom
            sx={{
              color: theme.palette.text.primary,
              fontWeight: "bold",
              textAlign: "left",
            }}
          >
            Tuberculosis (TB)
          </Typography>
          <Typography
            variant={isSmallScreen ? "body2" : "subtitle1"}
            sx={{
              color: theme.palette.text.primary,
              mb: 4,
              textAlign: "left",
            }}
          >
            A bacterial infection that affects your lungs
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              flexWrap: "nowrap",
            }}
          >
            <Button variant="contained" color="primary" sx={{ mr: 2 }}>
              Learn More
            </Button>
            <Button variant="contained" color="primary" onClick={handleFAQClick}>
              FAQ
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
