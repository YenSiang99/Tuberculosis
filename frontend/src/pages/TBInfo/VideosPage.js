import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const VideoCard = ({ video, src, isLoading }) => {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = React.useRef(null);

  useEffect(() => {
    setIsVideoReady(false);
    setError(null);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  const handleCanPlay = () => {
    setIsVideoReady(true);
  };

  const handleError = () => {
    setError("Failed to load video");
    setIsVideoReady(false);
  };

  return (
    <Card>
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="video"
          controls={isVideoReady && !isLoading}
          src={src}
          title={video.title}
          ref={videoRef}
          onCanPlay={handleCanPlay}
          onError={handleError}
          sx={{
            height: { xs: 200, sm: 300 },
            backgroundColor: "black",
            opacity: isVideoReady && !isLoading ? 1 : 0.5,
          }}
        />
        {(!isVideoReady || isLoading) && !error && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading video...
            </Typography>
          </Box>
        )}
        {error && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
            }}
          >
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          </Box>
        )}
      </Box>
      <CardContent>
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
            fontWeight: "medium",
          }}
        >
          {video.title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const VideosPage = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [error, setError] = useState(null);

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

  // Complete videoTitles object with all languages
  const videoTitles = {
    English: [
      { index: 1, title: "Understanding the Basics of Tuberculosis" },
      { index: 2, title: "Signs and Symptoms, Treatment and Management of TB" },
      { index: 3, title: "Fighting Tuberculosis: Innovation and Research" },
      {
        index: 4,
        title: "Direct Observed Therapy (DOT) vs Video Observed Therapy (VOT)",
      },
    ],
    Malay: [
      { index: 1, title: "Memahami Asas Tuberkulosis" },
      { index: 2, title: "Tanda dan Gejala, Rawatan dan Pengurusan TB" },
      { index: 3, title: "Memerangi Tuberkulosis: Inovasi dan Penyelidikan" },
      {
        index: 4,
        title:
          "Terapi Pemerhatian Langsung (DOT) vs Terapi Pemerhatian Video (VOT)",
      },
    ],
    Mandarin: [
      { index: 1, title: "了解结核病的基础知识" },
      { index: 2, title: "结核病的症状、治疗和管理" },
      { index: 3, title: "对抗结核病：创新与研究" },
      { index: 4, title: "直接观察治疗 (DOT) vs 视频观察治疗 (VOT)" },
    ],
    Tamil: [
      { index: 1, title: "காசநோயின் அடிப்படைகளைப் புரிந்துகொள்ளுதல்" },
      { index: 2, title: "காசநோயின் அறிகுறிகள், சிகிச்சை மற்றும் மேலாண்மை" },
      {
        index: 3,
        title: "காசநோயை எதிர்த்துப் போராடுதல்: புதுமை மற்றும் ஆராய்ச்சி",
      },
      {
        index: 4,
        title:
          "நேரடி கண்காணிப்பு சிகிச்சை (DOT) vs வீடியோ கண்காணிப்பு சிகிச்சை (VOT)",
      },
    ],
  };

  const [selectedLanguage, setSelectedLanguage] = useState(
    languageMap[i18n.language] || "English"
  );

  // Initial load effect
  useEffect(() => {
    const initializePage = async () => {
      try {
        setIsLoadingVideos(true);
        setError(null);
        // Simulate initial load time
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoadingVideos(false);
      } catch (err) {
        setError("Failed to initialize videos");
        setIsLoadingVideos(false);
      }
    };

    initializePage();
  }, []);

  useEffect(() => {
    if (
      languageMap[i18n.language] &&
      ["English", "Malay"].includes(selectedLanguage)
    ) {
      setSelectedLanguage(languageMap[i18n.language]);
    }
  }, [i18n.language]);

  const handleLanguageChange = async (newLanguage) => {
    try {
      setIsLoadingVideos(true);
      setError(null);
      setSelectedLanguage(newLanguage);

      // Simulate a minimum loading time to prevent flickering
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsLoadingVideos(false);
    } catch (err) {
      setError("Failed to change language");
      setIsLoadingVideos(false);
    }
  };

  const getVideoSrc = (index) => {
    return `./videos/${selectedLanguage}/compressed/Video ${index} (${selectedLanguage}).mp4`;
  };

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  // Safe check for videoTitles
  const currentLanguageVideos = videoTitles[selectedLanguage] || [];

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
        {t("videos.title")}
      </Typography>

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
              onClick={() => handleLanguageChange(label)}
              size={isMobile ? "small" : "medium"}
              disabled={isLoadingVideos}
            >
              {label}
            </Button>
          ))}
        </Box>
      </Grid>

      <Grid container spacing={2}>
        {currentLanguageVideos.map((video, index) => (
          <Grid item xs={12} md={6} key={index}>
            <VideoCard
              video={video}
              src={getVideoSrc(video.index)}
              isLoading={isLoadingVideos}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default VideosPage;
