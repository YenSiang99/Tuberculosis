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
} from "@mui/material";
import { useTranslation } from "react-i18next";

const VideosPage = () => {
  const { t, i18n } = useTranslation();
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

  // Video titles in different languages
  const videoTitles = {
    English: [
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
    ],
    Malay: [
      {
        index: 1,
        title: "Memahami Asas Tuberkulosis",
      },
      {
        index: 2,
        title: "Tanda dan Gejala, Rawatan dan Pengurusan TB",
      },
      {
        index: 3,
        title: "Memerangi Tuberkulosis: Inovasi dan Penyelidikan",
      },
      {
        index: 4,
        title:
          "Terapi Pemerhatian Langsung (DOT) vs Terapi Pemerhatian Video (VOT)",
      },
    ],
    Mandarin: [
      {
        index: 1,
        title: "了解结核病的基础知识",
      },
      {
        index: 2,
        title: "结核病的症状、治疗和管理",
      },
      {
        index: 3,
        title: "对抗结核病：创新与研究",
      },
      {
        index: 4,
        title: "直接观察治疗 (DOT) vs 视频观察治疗 (VOT)",
      },
    ],
    Tamil: [
      {
        index: 1,
        title: "காசநோயின் அடிப்படைகளைப் புரிந்துகொள்ளுதல்",
      },
      {
        index: 2,
        title: "காசநோயின் அறிகுறிகள், சிகிச்சை மற்றும் மேலாண்மை",
      },
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

  // Update selectedLanguage when i18n language changes (only for English/Malay)
  useEffect(() => {
    if (
      languageMap[i18n.language] &&
      ["English", "Malay"].includes(selectedLanguage)
    ) {
      setSelectedLanguage(languageMap[i18n.language]);
    }
  }, [i18n.language]);

  const getVideoSrc = (index) => {
    return `./videos/${selectedLanguage}/compressed/Video ${index} (${selectedLanguage}).mp4`;
  };

  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      {/* Page title - Always uses i18n translation */}
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

      {/* Videos Grid */}
      <Grid container spacing={2}>
        {videoTitles[selectedLanguage].map((video, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardMedia
                component="video"
                controls
                src={getVideoSrc(video.index)}
                title={video.title}
                sx={{
                  height: { xs: 200, sm: 300 },
                  backgroundColor: "black",
                }}
              />
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
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default VideosPage;
