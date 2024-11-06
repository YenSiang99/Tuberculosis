import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "../../components/axios"; // Adjust the import path based on your project structure
import { useTranslation } from "react-i18next"; // Import useTranslation

export default function GamePerformanceDashboard() {
  const { t, i18n } = useTranslation(); // Initialize useTranslation
  const currentLanguage = i18n.language || "en"; // Get current language

  const [tabIndex, setTabIndex] = useState(0);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state
  const [error, setError] = useState(null); // New error state

  const gameApis = [
    { name: "Word Search", endpoint: "/score/wordsearch/my-scores/" },
    { name: "Quiz", endpoint: "/score/quizzes/my-scores/" },
    { name: "Interactive Story", endpoint: "/score/stories/my-scores/" },
    { name: "Fill in the Blanks", endpoint: "/score/fillblank/my-scores/" },
  ];

  useEffect(() => {
    // Reset scores and set loading to true when the tab changes
    setScores([]);
    setLoading(true);
    setError(null); // Reset error state

    // Fetch data when the tab changes
    axios
      .get(gameApis[tabIndex].endpoint)
      .then((response) => {
        setScores(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
        setError("Failed to fetch data.");
        setLoading(false);
      });
  }, [tabIndex]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const renderTable = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      );
    }

    if (!scores || scores.length === 0) {
      return (
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          {t("user_score.noDataAvailable")}
        </Typography>
      );
    }

    // Define table headers and rows based on the selected game
    const currentGame = gameApis[tabIndex].name;

    let headers = [];
    let rows = [];

    switch (currentGame) {
      case "Word Search":
        headers = [
          t("user_score.wordListName"),
          t("user_score.score"),
          t("user_score.accuracyRate"),
          t("user_score.timeTaken"),
          t("user_score.totalGameTime"),
          t("user_score.completionStatus"),
          t("user_score.date"),
        ];
        rows = scores.map((score) => ({
          wordListName: score.wordList?.name?.[currentLanguage] || "N/A",
          score: `${score.score} ${t("user_score.outOf")} ${
            score.totalPossibleScore
          }`,
          accuracyRate: score.accuracyRate
            ? `${score.accuracyRate.toFixed(2)}%`
            : "N/A",
          timeTaken: `${score.totalTimeTaken} ${t("user_score.seconds")}`,
          totalGameTime: `${score.wordList?.totalGameTime || "N/A"} ${t(
            "user_score.seconds"
          )}`,
          completionStatus:
            t(`user_score.${score.completionStatus}`) || score.completionStatus,
          date: new Date(score.createdAt).toLocaleString(),
        }));
        break;

      case "Quiz":
        headers = [
          t("user_score.quizName"),
          t("user_score.score"),
          t("user_score.accuracyRate"),
          t("user_score.averageTimePerQuestion"),
          t("user_score.timeLimitPerQuestion"),
          t("user_score.completionStatus"),
          t("user_score.date"),
        ];
        rows = scores.map((score) => ({
          quizName: score.quiz?.name?.[currentLanguage] || "N/A",
          score: `${score.score} ${t("user_score.outOf")} ${
            score.totalPossibleScore
          }`,
          accuracyRate: score.accuracyRate
            ? `${score.accuracyRate.toFixed(2)}%`
            : "N/A",
          averageTimePerQuestion:
            typeof score.averageTimePerQuestion === "number"
              ? `${score.averageTimePerQuestion.toFixed(2)} ${t(
                  "user_score.seconds"
                )}`
              : "N/A",
          timeLimitPerQuestion: `${score.timeLimitPerQuestion} ${t(
            "user_score.seconds"
          )}`,
          completionStatus:
            t(`user_score.${score.completionStatus}`) || score.completionStatus,
          date: new Date(score.createdAt).toLocaleString(),
        }));
        break;

      case "Interactive Story":
        headers = [
          t("user_score.storyTitle"),
          t("user_score.numberOfRetries"),
          t("user_score.totalTimeTaken"),
          t("user_score.date"),
        ];
        rows = scores.map((score) => ({
          storyTitle: score.story?.title?.[currentLanguage] || "N/A",
          numberOfRetries: score.numberOfRetries,
          totalTimeTaken: `${score.totalTimeTaken} ${t("user_score.seconds")}`,
          date: new Date(score.createdAt).toLocaleString(),
        }));
        break;

      case "Fill in the Blanks":
        headers = [
          t("user_score.gameName"),
          t("user_score.score"),
          t("user_score.accuracyRate"),
          t("user_score.totalTimeTaken"),
          t("user_score.totalGameTime"),
          t("user_score.completionStatus"),
          t("user_score.date"),
        ];
        rows = scores.map((score) => ({
          gameName: score.fillBlank?.name?.[currentLanguage] || "N/A",
          score: `${score.score} ${t("user_score.outOf")} ${
            score.totalPossibleScore
          }`,
          accuracyRate: score.accuracyRate
            ? `${score.accuracyRate.toFixed(2)}%`
            : "N/A",
          totalTimeTaken: `${score.totalTimeTaken} ${t("user_score.seconds")}`,
          totalGameTime: `${score.totalGameTime} ${t("user_score.seconds")}`,
          completionStatus:
            t(`user_score.${score.completionStatus}`) || score.completionStatus,
          date: new Date(score.createdAt).toLocaleString(),
        }));
        break;
      default:
        break;
    }

    return (
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header} align="center">
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((value, idx) => (
                  <TableCell key={idx} align="center">
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        {t("user_score.myGameStats")}
      </Typography>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="Game Tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        {gameApis.map((game, index) => (
          <Tab label={t(`user_score.${game.name}`)} key={index} />
        ))}
      </Tabs>
      <Box>{renderTable()}</Box>
    </Container>
  );
}
