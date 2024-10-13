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

export default function AdminScoreDashboardPage() {
  const { t, i18n } = useTranslation(); // Initialize useTranslation
  const currentLanguage = i18n.language || "en"; // Get current language

  const [tabIndex, setTabIndex] = useState(0);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const gameApis = [
    { name: "Word Search", endpoint: "/score/wordsearch/all-scores/" },
    { name: "Quiz", endpoint: "/score/quizzes/all-scores/" },
    { name: "Interactive Story", endpoint: "/score/stories/all-scores/" },
    { name: "Fill in the Blanks", endpoint: "/score/fillblank/all-scores/" },
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
          {t("admin_score.noDataAvailable")}
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
          t("admin_score.user"),
          t("admin_score.wordListName"),
          t("admin_score.score"),
          t("admin_score.accuracyRate"),
          t("admin_score.timeTaken"),
          t("admin_score.totalGameTime"),
          t("admin_score.completionStatus"),
          t("admin_score.date"),
        ];
        rows = scores.map((score) => ({
          user:
            `${score.user?.firstName || ""} ${
              score.user?.lastName || ""
            }`.trim() ||
            score.user?.email ||
            "N/A",

          wordListName: score.wordList?.name?.[currentLanguage] || "N/A",
          score: `${score.score} ${t("admin_score.outOf")} ${
            score.totalPossibleScore
          }`,
          accuracyRate: `${score.accuracyRate}%`,
          timeTaken: `${score.totalTimeTaken} ${t("admin_score.seconds")}`,
          totalGameTime: `${score.wordList?.totalGameTime || "N/A"} ${t(
            "admin_score.seconds"
          )}`,
          completionStatus:
            t(`admin_score.${score.completionStatus}`) ||
            score.completionStatus,
          date: new Date(score.createdAt).toLocaleString(currentLanguage),
        }));
        break;

      case "Quiz":
        headers = [
          t("admin_score.user"),
          t("admin_score.quizName"),
          t("admin_score.score"),
          t("admin_score.accuracyRate"),
          t("admin_score.averageTimePerQuestion"),
          t("admin_score.timeLimitPerQuestion"),
          t("admin_score.completionStatus"),
          t("admin_score.date"),
        ];
        rows = scores.map((score) => ({
          user:
            `${score.user?.firstName || ""} ${
              score.user?.lastName || ""
            }`.trim() ||
            score.user?.email ||
            "N/A",

          quizName: score.quiz?.name?.[currentLanguage] || "N/A",
          score: `${score.score} ${t("admin_score.outOf")} ${
            score.totalPossibleScore
          }`,
          accuracyRate:
            typeof score.accuracyRate === "number"
              ? `${score.accuracyRate.toFixed(2)}%`
              : "N/A",
          averageTimePerQuestion:
            typeof score.averageTimePerQuestion === "number"
              ? `${score.averageTimePerQuestion.toFixed(2)} ${t(
                  "admin_score.seconds"
                )}`
              : "N/A",
          timeLimitPerQuestion: `${score.timeLimitPerQuestion} ${t(
            "admin_score.seconds"
          )}`,
          completionStatus:
            t(`admin_score.${score.completionStatus}`) ||
            score.completionStatus,
          date: new Date(score.createdAt).toLocaleString(currentLanguage),
        }));
        break;

      case "Interactive Story":
        headers = [
          t("admin_score.user"),
          t("admin_score.storyTitle"),
          t("admin_score.numberOfRetries"),
          t("admin_score.totalTimeTakenSec"),
          t("admin_score.date"),
        ];
        rows = scores.map((score) => ({
          user:
            `${score.user?.firstName || ""} ${
              score.user?.lastName || ""
            }`.trim() ||
            score.user?.email ||
            "N/A",
          storyTitle: score.story?.title?.[currentLanguage] || "N/A",
          numberOfRetries: score.numberOfRetries,
          totalTimeTaken: `${score.totalTimeTaken} ${t("admin_score.seconds")}`,
          date: new Date(score.createdAt).toLocaleString(currentLanguage),
        }));
        break;

      case "Fill in the Blanks":
        headers = [
          t("admin_score.user"),
          t("admin_score.gameName"),
          t("admin_score.score"),
          t("admin_score.accuracyRate"),
          t("admin_score.totalTimeTaken"),
          t("admin_score.totalGameTime"),
          t("admin_score.completionStatus"),
          t("admin_score.date"),
        ];
        rows = scores.map((score) => ({
          user:
            `${score.user?.firstName || ""} ${
              score.user?.lastName || ""
            }`.trim() ||
            score.user?.email ||
            "N/A",
          gameName: score.fillBlank?.name?.[currentLanguage] || "N/A",
          score: `${score.score} ${t("admin_score.outOf")} ${
            score.totalPossibleScore
          }`,
          accuracyRate:
            typeof score.accuracyRate === "number"
              ? `${score.accuracyRate.toFixed(2)}%`
              : "N/A",
          totalTimeTaken: `${score.totalTimeTaken} ${t("admin_score.seconds")}`,
          totalGameTime: `${score.totalGameTime} ${t("admin_score.seconds")}`,
          completionStatus:
            t(`admin_score.${score.completionStatus}`) ||
            score.completionStatus,
          date: new Date(score.createdAt).toLocaleString(currentLanguage),
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
        {t("admin_score.allUsersGameStats")}
      </Typography>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="Game Tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        {gameApis.map((game, index) => (
          <Tab label={t(`admin_score.${game.name}`)} key={index} />
        ))}
      </Tabs>
      <Box>{renderTable()}</Box>
    </Container>
  );
}
