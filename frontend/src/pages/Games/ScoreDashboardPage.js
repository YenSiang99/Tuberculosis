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

export default function GamePerformanceDashboard() {
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
          No data available.
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
          "Word List Name",
          "Score",
          "Accuracy Rate",
          "Time Taken",
          "Total Game Time",
          "Completion Status",
          "Date",
        ];
        rows = scores.map((score) => ({
          wordListName: score.wordList?.name || "N/A",
          score: `${score.score} out of ${score.totalPossibleScore}`,
          accuracyRate: `${score.accuracyRate}%`,
          timeTaken: `${score.totalTimeTaken} seconds`,
          totalGameTime: `${score.wordList?.totalGameTime || "N/A"} seconds`,
          completionStatus: score.completionStatus,
          date: new Date(score.createdAt).toLocaleString(),
        }));
        break;

      case "Quiz":
        headers = [
          "Quiz Name",
          "Score",
          "Accuracy Rate",
          "Average Time per Question",
          "Time Limit per Question",
          "Completion Status",
          "Date",
        ];
        rows = scores.map((score) => ({
          quizName: score.quiz?.name || "N/A",
          score: `${score.score} out of ${score.totalPossibleScore}`,
          accuracyRate:
            typeof score.accuracyRate === "number"
              ? `${score.accuracyRate.toFixed(2)}%`
              : "N/A",
          averageTimePerQuestion:
            typeof score.averageTimePerQuestion === "number"
              ? `${score.averageTimePerQuestion.toFixed(2)} seconds`
              : "N/A",
          timeLimitPerQuestion: `${score.timeLimitPerQuestion} seconds`,

          completionStatus: score.completionStatus,
          date: new Date(score.createdAt).toLocaleString(),
        }));
        break;

      case "Interactive Story":
        headers = [
          "Story Title",
          "Number of Retries",
          "Total Time Taken (sec)",
          "Date",
        ];
        rows = scores.map((score) => ({
          storyTitle: score.story?.title || "N/A",
          numberOfRetries: score.numberOfRetries,
          totalTimeTaken: score.totalTimeTaken,
          date: new Date(score.createdAt).toLocaleString(),
        }));
        break;

      case "Fill in the Blanks":
        headers = [
          "Game Name",
          "Score",
          "Accuracy Rate",
          "Total Time Taken",
          "Total Game Time",
          "Completion Status",
          "Date",
        ];
        rows = scores.map((score) => ({
          gameName: score.fillBlank?.name || "N/A",
          score: `${score.score} out of ${score.totalPossibleScore}`,
          accuracyRate:
            typeof score.accuracyRate === "number"
              ? `${score.accuracyRate.toFixed(2)}%`
              : "N/A",
          totalTimeTaken: `${score.totalTimeTaken} seconds`,
          totalGameTime: `${score.totalGameTime} seconds`,
          completionStatus: score.completionStatus,
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
        My Game Stats
      </Typography>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="Game Tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        {gameApis.map((game, index) => (
          <Tab label={game.name} key={index} />
        ))}
      </Tabs>
      <Box>{renderTable()}</Box>
    </Container>
  );
}
