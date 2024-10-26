import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import theme from "../../components/reusable/Theme";

const InfographicsPage = () => {
  const { t, i18n } = useTranslation(); // Add t from useTranslation
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const languageMap = {
    en: "English",
    ms: "Malay",
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "ms", label: "Malay" },
    { code: "zh", label: "Mandarin" },
    { code: "ta", label: "Tamil" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(
    languageMap[i18n.language] || "English"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState({});

  const infographics = [
    { index: 1, type: "single" },
    { index: 2, type: "single" },
    { index: 3, type: "single" },
    { index: 4, type: "single" },
    { index: 5, type: "single" },
    { index: 6, type: "single" },
    { index: 7, type: "single" },
    { index: 8, type: "single" },
  ];

  const [currentInfographicIndex, setCurrentInfographicIndex] = useState(0);
  const totalInfographics = infographics.length;

  // Preload images for a specific language
  const preloadImagesForLanguage = async (language) => {
    const imagePromises = infographics.map((infographic) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const src = `./infographics/${language}/Infographic ${infographic.index} (${language}).png`;
        img.src = src;
        img.onload = () => resolve({ src, img });
        img.onerror = reject;
      });
    });

    try {
      const loadedImages = await Promise.all(imagePromises);
      const imagesMap = {};
      loadedImages.forEach(({ src, img }) => {
        imagesMap[src] = img;
      });
      return imagesMap;
    } catch (error) {
      console.error("Error preloading images:", error);
      return {};
    }
  };

  // Effect to handle language changes and preloading
  useEffect(() => {
    const loadImagesForLanguage = async () => {
      setIsLoading(true);
      const images = await preloadImagesForLanguage(selectedLanguage);
      setPreloadedImages((prev) => ({ ...prev, [selectedLanguage]: images }));
      setIsLoading(false);
    };

    if (!preloadedImages[selectedLanguage]) {
      loadImagesForLanguage();
    } else {
      setIsLoading(false);
    }
  }, [selectedLanguage]);

  // Update selectedLanguage when i18n language changes
  useEffect(() => {
    if (
      languageMap[i18n.language] &&
      ["English", "Malay"].includes(selectedLanguage)
    ) {
      setSelectedLanguage(languageMap[i18n.language]);
    }
  }, [i18n.language]);

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

  const getInfographicSrc = (index) => {
    return `./infographics/${selectedLanguage}/Infographic ${index} (${selectedLanguage}).png`;
  };

  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: theme.palette.primary.light,
          mb: 3,
        }}
      >
        {t("infographics.title")}{" "}
        {/* Replace hardcoded text with translation */}
      </Typography>

      <Grid container spacing={3}>
        {/* Language selector - Single row */}
        <Grid
          item
          xs={12}
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: { xs: 0.5, sm: 1 },
              "& .MuiButton-root": {
                minWidth: { xs: "70px", sm: "100px" },
                px: { xs: 1, sm: 2 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              },
            }}
          >
            {languages.map(({ code, label }) => (
              <Button
                key={code}
                variant={selectedLanguage === label ? "contained" : "outlined"}
                onClick={() => setSelectedLanguage(label)}
                size={isMobile ? "small" : "medium"}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Grid>

        {/* Navigation buttons */}
        <Grid
          item
          container
          justifyContent="space-between"
          alignItems="center"
          xs={12}
          sx={{ mb: 2 }}
        >
          <Button
            variant="contained"
            onClick={handlePreviousInfographic}
            disabled={currentInfographicIndex === 0}
            size={isMobile ? "small" : "medium"}
          >
            Previous
          </Button>
          <Typography>
            {currentInfographicIndex + 1} / {totalInfographics}
          </Typography>
          <Button
            variant="contained"
            onClick={handleNextInfographic}
            disabled={currentInfographicIndex === totalInfographics - 1}
            size={isMobile ? "small" : "medium"}
          >
            Next
          </Button>
        </Grid>

        {/* Infographic content with loading state */}
        <Grid item xs={12}>
          {isLoading ? (
            <Box sx={{ position: "relative" }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={600}
                animation="wave"
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <CircularProgress />
                <Typography>Loading infographic...</Typography>
              </Box>
            </Box>
          ) : (
            <Box
              component="img"
              src={getInfographicSrc(
                infographics[currentInfographicIndex].index
              )}
              alt={`Infographic ${infographics[currentInfographicIndex].index}`}
              sx={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: 1,
              }}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default InfographicsPage;
