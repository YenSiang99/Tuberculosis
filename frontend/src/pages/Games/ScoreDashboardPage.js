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
  Grid,
} from "@mui/material";
import axios from "../../components/axios"; // Adjust the import path based on your project structure
import { useTranslation } from "react-i18next"; // Import useTranslation
import { Star, Award, Trophy, Crown, Medal } from "lucide-react";

const BadgeSummary = ({ scores, isTime = false }) => {
  // Skip if no scores
  if (!scores || scores.length === 0) return null;

  // Calculate badge counts based on scores
  const badgeCounts = scores.reduce((acc, score) => {
    const value = isTime ? score.totalTimeTaken : score.accuracyRate;
    if (value === null || value === undefined) return acc;

    const badge = getBadgeInfo(value, isTime);
    if (badge) {
      acc[badge.label] = (acc[badge.label] || 0) + 1;
    }
    return acc;
  }, {});

  // Only show badges that have a count > 0
  const badgesToShow = Object.entries(badgeCounts)
    .filter(([_, count]) => count > 0)
    .map(([label, count]) => {
      const config = (
        isTime ? TIME_BADGE_CONFIGS : ACCURACY_BADGE_CONFIGS
      ).find((cfg) => cfg.label === label);
      return { ...config, count };
    });

  if (badgesToShow.length === 0) return null;

  return (
    <Grid
      container
      direction="row"
      sx={{
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 1,
      }}
      spacing={2}
    >
      {badgesToShow.map(
        ({ icon: IconComponent, label, color, iconProps, count }) => (
          <Grid item key={label}>
            <Grid container spacing={1} alignItems="center" wrap="nowrap">
              <Grid item>
                <IconComponent className={`w-6 h-6 ${color}`} {...iconProps} />
              </Grid>
              <Grid item>
                <Typography align="center">x {count}</Typography>
              </Grid>
            </Grid>
          </Grid>
        )
      )}
    </Grid>
  );
};

const ACCURACY_BADGE_CONFIGS = [
  {
    threshold: 20,
    icon: Medal,
    label: "Bronze",
    color: "text-amber-600",
    iconProps: { fill: "#B45309", color: "#92400E" },
    description: "Getting Started (0-20%)",
  },
  {
    threshold: 40,
    icon: Star,
    label: "Silver",
    color: "text-gray-400",
    iconProps: { fill: "#9CA3AF", color: "#6B7280" },
    description: "Making Progress (21-40%)",
  },
  {
    threshold: 60,
    icon: Award,
    label: "Gold",
    color: "text-yellow-500",
    iconProps: { fill: "#F59E0B", color: "#D97706" },
    description: "Rising Star (41-60%)",
  },
  {
    threshold: 80,
    icon: Trophy,
    label: "Platinum",
    color: "text-green-500",
    iconProps: { fill: "#10B981", color: "#059669" },
    description: "Expert Player (61-80%)",
  },
  {
    threshold: 100,
    icon: Crown,
    label: "Diamond",
    color: "text-blue-500",
    iconProps: { fill: "#3B82F6", color: "#2563EB" },
    description: "Master (81-100%)",
  },
];

const TIME_BADGE_CONFIGS = [
  {
    threshold: 15,
    icon: Crown,
    label: "Diamond",
    color: "text-blue-500",
    iconProps: { fill: "#3B82F6", color: "#2563EB" },
    description: "Speed Master (Under 15s)",
  },
  {
    threshold: 30,
    icon: Trophy,
    label: "Platinum",
    color: "text-green-500",
    iconProps: { fill: "#10B981", color: "#059669" },
    description: "Swift Solver (15-30s)",
  },
  {
    threshold: 45,
    icon: Award,
    label: "Gold",
    color: "text-yellow-500",
    iconProps: { fill: "#F59E0B", color: "#D97706" },
    description: "Fast Reader (31-45s)",
  },
  {
    threshold: 60,
    icon: Star,
    label: "Silver",
    color: "text-gray-400",
    iconProps: { fill: "#9CA3AF", color: "#6B7280" },
    description: "Steady Pace (46-60s)",
  },
  {
    threshold: Infinity,
    icon: Medal,
    label: "Bronze",
    color: "text-amber-600",
    iconProps: { fill: "#B45309", color: "#92400E" },
    description: "Taking Time (60s+)",
  },
];

const getBadgeInfo = (value, isTime = false) => {
  if (value === null || value === undefined) return null;

  const configs = isTime ? TIME_BADGE_CONFIGS : ACCURACY_BADGE_CONFIGS;
  return configs.find((config) => value <= config.threshold);
};

const BadgeDisplay = ({ value, isTime = false }) => {
  const badge = getBadgeInfo(value, isTime);

  if (!badge) return <span>-</span>;

  const IconComponent = badge.icon;

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Row 1: Badge Icon */}
      <div className="w-full flex justify-center">
        <IconComponent
          className={`w-6 h-6 ${badge.color}`}
          {...badge.iconProps}
        />
      </div>

      {/* Row 2: Badge Label */}
      <div className="w-full text-center">
        <span className="font-medium text-sm">{badge.label}</span>
      </div>

      {/* Row 3: Percentage/Time Range */}
      <div className="w-full text-center">
        <span className="text-gray-500 text-xs">
          {isTime
            ? `${badge.threshold === Infinity ? "60+" : `<${badge.threshold}`}s`
            : `${
                badge.threshold === 100
                  ? "81-100"
                  : `${badge.threshold - 19}-${badge.threshold}`
              }%`}
        </span>
      </div>
    </div>
  );
};

const BadgeLegend = ({ isTime = false }) => {
  const configs = isTime ? TIME_BADGE_CONFIGS : ACCURACY_BADGE_CONFIGS;

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
      <Typography variant="h6" className="mb-4 text-center">
        {isTime
          ? "Time-Based Achievement Levels"
          : "Accuracy-Based Achievement Levels"}
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {configs.map((badge) => {
          const IconComponent = badge.icon;
          return (
            <div
              key={badge.label}
              className="flex flex-col items-center p-2 bg-white rounded shadow-sm"
            >
              <IconComponent
                className={`w-8 h-8 ${badge.color}`}
                {...badge.iconProps}
              />
              <Typography variant="subtitle2" className="font-bold">
                {badge.label}
              </Typography>
              <Typography
                variant="caption"
                className="text-center text-gray-600"
              >
                {badge.description}
              </Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

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

    const showTimeBadges = currentGame === "Interactive Story";

    let headers = [];
    let rows = [];

    switch (currentGame) {
      case "Word Search":
        headers = [
          t("user_score.wordListName"),
          t("user_score.score"),
          t("user_score.accuracyRate"),
          t("user_score.badge"),
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
          badge: (
            <BadgeDisplay
              value={parseFloat(score.accuracyRate)}
              isTime={false}
            />
          ),
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
          t("user_score.badge"),
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

          badge: (
            <BadgeDisplay
              value={parseFloat(score.accuracyRate)}
              isTime={false}
            />
          ),
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
          t("user_score.badge"), // Added badge header
          t("user_score.date"),
        ];
        rows = scores.map((score) => ({
          storyTitle: score.story?.title?.[currentLanguage] || "N/A",
          numberOfRetries: score.numberOfRetries,
          totalTimeTaken: `${score.totalTimeTaken} ${t("user_score.seconds")}`,
          badge: (
            <BadgeDisplay
              value={parseFloat(score.totalTimeTaken)}
              isTime={true}
            />
          ), // Added badge display
          date: new Date(score.createdAt).toLocaleString(),
        }));
        break;

      case "Fill in the Blanks":
        headers = [
          t("user_score.gameName"),
          t("user_score.score"),
          t("user_score.accuracyRate"),
          t("user_score.badge"),
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
          badge: (
            <BadgeDisplay
              value={parseFloat(score.accuracyRate)}
              isTime={false}
            />
          ),
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
      <>
        <BadgeSummary scores={scores} isTime={showTimeBadges} />
        <TableContainer component={Paper} sx={{ marginTop: 1 }}>
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
                  {Object.entries(row).map(([key, value], idx) => (
                    <TableCell
                      key={idx}
                      align="center"
                      className={key === "badge" ? "py-3" : ""} // Add more padding for badge cells
                    >
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
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
