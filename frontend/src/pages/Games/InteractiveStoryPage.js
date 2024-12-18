import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "../../components/axios";
import { useTranslation } from "react-i18next";

// Instruction Dialog Component
const InstructionDialog = ({
  showInstructions,
  dontShowAgain,
  setDontShowAgain,
  handleCloseInstructionDialog,
  gameState,
  t,
}) => (
  <Dialog
    open={showInstructions}
    onClose={handleCloseInstructionDialog}
    aria-labelledby="instruction-dialog-title"
    maxWidth="sm"
    fullWidth
  >
    <DialogTitle id="instruction-dialog-title">
      {t("interactive_story.quizGameHowToPlay")}
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        1. <strong>{t("interactive_story.introductionToTheStory")}:</strong>{" "}
        <br />
        {t("interactive_story.introductionText")}
        <br />
        <br />
        2. <strong>{t("interactive_story.makeYourChoice")}:</strong> <br />
        {t("interactive_story.makeYourChoiceText")}
        <br />
        <br />
        3. <strong>{t("interactive_story.gameOver")}:</strong> <br />
        {t("interactive_story.gameOverText")}
        <br />
        <br />
        4. <strong>{t("interactive_story.goal")}:</strong> <br />
        {t("interactive_story.goalText")}
      </DialogContentText>
      {gameState === "initial" && (
        <FormControlLabel
          control={
            <Checkbox
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
          }
          label={t("interactive_story.dontShowAgain")}
        />
      )}
    </DialogContent>
    <DialogActions>
      <Button
        onClick={handleCloseInstructionDialog}
        variant="contained"
        fullWidth
      >
        {t("interactive_story.okay")}
      </Button>
    </DialogActions>
  </Dialog>
);

// Start Game Dialog Component
const StartGameDialog = ({ showStartDialog, handleStartGame, t }) => (
  <Dialog
    open={showStartDialog}
    aria-labelledby="start-game-dialog-title"
    maxWidth="sm"
    fullWidth
  >
    <DialogContent sx={{ textAlign: "center", py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("interactive_story.areYouReady")}
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={handleStartGame}
        sx={{ mt: 3, minWidth: 200 }}
      >
        {t("interactive_story.startGame")}
      </Button>
    </DialogContent>
  </Dialog>
);

// Countdown Dialog Component
const CountdownDialog = ({ showCountdown, countdown }) => (
  <Dialog
    open={showCountdown}
    maxWidth="sm"
    fullWidth
    PaperProps={{
      sx: {
        backgroundColor: "transparent",
        boxShadow: "none",
      },
    }}
  >
    <DialogContent
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 200,
      }}
    >
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          size={100}
          thickness={2}
          sx={{ color: "primary.main" }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h2"
            component="div"
            sx={{ color: "primary.main", fontWeight: "bold" }}
          >
            {countdown}
          </Typography>
        </Box>
      </Box>
    </DialogContent>
  </Dialog>
);

const InteractiveStoryPage = () => {
  const { i18n, t } = useTranslation();
  const selectedLanguage = i18n.language || "en";
  const theme = useTheme();

  const [prevLanguage, setPrevLanguage] = useState(selectedLanguage);
  const [storyData, setStoryData] = useState({
    title: {
      en: "A Day in the Life of a TB Patient",
      ms: "Sehari dalam Kehidupan Pesakit TB",
    },
    description: {
      en: "Navigate through choices as a tuberculosis patient.",
      ms: "Melalui pilihan sebagai pesakit tuberkulosis.",
    },
    steps: [
      {
        stepId: "step1",
        content: {
          en: "You wake up feeling unwell with a persistent cough. What do you do?",
          ms: "Anda bangun berasa tidak sihat dengan batuk yang berterusan. Apa yang anda lakukan?",
        },
        options: [
          {
            optionText: {
              en: "Ignore it and go to work",
              ms: "Abaikan dan pergi bekerja",
            },
            nextStep: "step2", // References the next step by stepId
          },
          {
            optionText: {
              en: "Visit a clinic for a check-up",
              ms: "Lawati klinik untuk pemeriksaan",
            },
            nextStep: "step3",
          },
        ],
      },
      {
        stepId: "step2",
        content: {
          en: "At work, your symptoms worsen. What's your next step?",
          ms: "Di tempat kerja, gejala anda semakin teruk. Apakah langkah seterusnya?",
        },
        options: [
          {
            optionText: {
              en: "Take some over-the-counter medicine",
              ms: "Ambil ubat dari kaunter",
            },
            nextStep: "end1", // References an end by endId
          },
          {
            optionText: {
              en: "Inform your supervisor and go home",
              ms: "Maklumkan penyelia anda dan pulang ke rumah",
            },
            nextStep: "end2",
          },
        ],
      },
      {
        stepId: "step3",
        content: {
          en: "The doctor suspects TB and orders tests. What's your response?",
          ms: "Doktor mengesyaki TB dan mengarahkan ujian. Apakah respons anda?",
        },
        options: [
          {
            optionText: {
              en: "Agree to the tests",
              ms: "Bersetuju untuk ujian",
            },
            nextStep: "end3",
          },
          {
            optionText: {
              en: "Refuse and leave the clinic",
              ms: "Menolak dan meninggalkan klinik",
            },
            nextStep: "end4",
          },
        ],
      },
    ],
    ends: [
      {
        endId: "end1",
        content: {
          en: "Your condition worsens without proper treatment.",
          ms: "Keadaan anda semakin teruk tanpa rawatan yang betul.",
        },
        endType: "negative",
      },
      {
        endId: "end2",
        content: {
          en: "You rest at home but miss early diagnosis.",
          ms: "Anda berehat di rumah tetapi terlepas diagnosis awal.",
        },
        endType: "negative",
      },
      {
        endId: "end3",
        content: {
          en: "You begin treatment early and recover well.",
          ms: "Anda memulakan rawatan awal dan pulih dengan baik.",
        },
        endType: "positive",
      },
      {
        endId: "end4",
        content: {
          en: "Without diagnosis, your health deteriorates.",
          ms: "Tanpa diagnosis, kesihatan anda merosot.",
        },
        endType: "negative",
      },
    ],
  });
  const [currentStepId, setCurrentStepId] = useState(
    storyData?.steps[0]?.stepId || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retries, setRetries] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [finalTimeTaken, setFinalTimeTaken] = useState(null);

  const [gameState, setGameState] = useState("initial");
  const [showInstructions, setShowInstructions] = useState(true);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const currentStep =
    storyData?.steps.find((step) => step.stepId === currentStepId) ||
    storyData?.ends.find((end) => end.endId === currentStepId);
  const isEnd = currentStep && "endType" in currentStep;
  const [openInstructionDialog, setOpenInstructionDialog] = useState(true);

  const resetGame = () => {
    setCurrentStepId(storyData?.steps[0]?.stepId || null);
    setRetries(0);
    setStartTime(null);
    setFinalTimeTaken(null);
    setGameStarted(false);
    setGameState("initial");
    setShowCountdown(false);
    setCountdown(3);

    // Check localStorage preference for instructions
    const hideInstructions = localStorage.getItem("hideStoryInstructions");
    if (hideInstructions === "true") {
      setShowInstructions(false);
      setShowStartDialog(true);
    } else {
      setShowInstructions(true);
      setShowStartDialog(false);
    }
  };

  useEffect(() => {
    if (selectedLanguage) {
      resetGame();
    }
  }, [selectedLanguage]);

  useEffect(() => {
    const hideInstructions = localStorage.getItem("hideStoryInstructions");
    if (hideInstructions === "true") {
      setShowInstructions(false);
      setShowStartDialog(true);
    }
  }, []);

  // Handle instruction dialog close
  const handleCloseInstructionDialog = () => {
    if (dontShowAgain) {
      localStorage.setItem("hideStoryInstructions", "true");
    }
    setShowInstructions(false);

    if (gameState === "initial") {
      setShowStartDialog(true);
    }
  };

  // Handle game start
  const handleStartGame = () => {
    setShowStartDialog(false);
    setShowCountdown(true);
    setGameState("countdown");
    setCountdown(3);
  };

  // Countdown effect
  useEffect(() => {
    if (gameState === "countdown" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "countdown" && countdown === 0) {
      setShowCountdown(false);
      setGameState("playing");
      setGameStarted(true);
      setStartTime(Date.now());
    }
  }, [countdown, gameState]);

  const handleOpenInstructionDialog = () => {
    setShowInstructions(true);
  };

  const generateImageUrl = (content) => {
    const englishContent = content?.en || content?.[selectedLanguage] || "";
    const formattedContent = englishContent
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/\s+/g, "-");
    console.log("formattedContent", formattedContent);
    return `https://image.pollinations.ai/prompt/${formattedContent}-kids-animation-16-by-9-image`;
  };

  const handleRestartStory = () => {
    resetGame();
  };

  useEffect(() => {
    if (selectedLanguage !== prevLanguage) {
      resetGame();
      setPrevLanguage(selectedLanguage);
    }
  }, [selectedLanguage, prevLanguage]);

  const handleRetryStory = () => {
    setRetries(retries + 1);
    setFinalTimeTaken(null);
    setCurrentStepId(storyData?.steps[0]?.stepId || null);
  };

  const calculateTimeTaken = () => {
    return ((Date.now() - startTime) / 1000).toFixed(2); // returns time in seconds
  };

  const submitStoryScore = async (finalTime) => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    if (!storedUserData) return; // Only submit score if user is logged in

    const payload = {
      numberOfRetries: retries,
      totalTimeTaken: finalTime || calculateTimeTaken(),
    };

    try {
      const response = await axios.post("/score/stories/submit", payload);
      console.log("Score submitted successfully", response.data);
    } catch (error) {
      console.error("Failed to submit story score", error);
    }
  };

  // Fetch story API
  useEffect(() => {
    axios
      .get("/stories/active")
      .then((response) => {
        console.log("reading stories .. response.data", response.data);
        setStoryData(response.data);
        // setCurrentStepId(response.data.steps[0].content); // Set initial step to the first step
        setCurrentStepId(response.data.steps[0]?.stepId || null); // Use stepId

        setLoading(false); // Stop loading once data is fetched
      })
      .catch((err) => {
        setError("Failed to load the story.");
        setLoading(false);
      });
  }, []);

  // Determine whether the user reaches the correct ending
  useEffect(() => {
    if (isEnd) {
      const finalTime = calculateTimeTaken();
      setFinalTimeTaken(finalTime); // Freeze the final time when the game ends
      if (currentStep.endType === "positive") {
        submitStoryScore(finalTime); // Automatically submit the score on positive ending
      }
    }
  }, [isEnd, currentStep]);

  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
      >
        {t("interactive_story.title")}
      </Typography>

      <InstructionDialog
        showInstructions={showInstructions}
        dontShowAgain={dontShowAgain}
        setDontShowAgain={setDontShowAgain}
        handleCloseInstructionDialog={handleCloseInstructionDialog}
        gameState={gameState}
        t={t}
      />

      <StartGameDialog
        showStartDialog={showStartDialog}
        handleStartGame={handleStartGame}
        t={t}
      />

      <CountdownDialog showCountdown={showCountdown} countdown={countdown} />

      {(gameState === "playing" || gameStarted) && (
        // Your existing game content JSX
        <Grid container spacing={1}>
          {/* Title */}
          <Grid
            item
            container
            xs={12}
            sx={{ justifyContent: "start", alignItems: "center" }}
          >
            <Button variant="contained" onClick={handleOpenInstructionDialog}>
              {t("interactive_story.viewInstruction")}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">
              {storyData.title?.[selectedLanguage] ||
                storyData.title?.en ||
                t("interactive_story.storyTitleFallback")}
            </Typography>
          </Grid>

          <Grid
            item
            container
            spacing={2}
            direction="row"
            sx={{ alignItems: "stretch" }}
          >
            {/* Photo */}
            <Grid item xs={12} md={6}>
              <Grid item xs={6}>
                <Typography variant="h6">
                  {t("interactive_story.retries")}: {retries}
                </Typography>
              </Grid>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image={generateImageUrl(currentStep.content)}
                  alt="Dynamic story image"
                  sx={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              </Card>
            </Grid>
            {/* Content and Decisions */}
            <Grid
              item
              container
              direction="column"
              sx={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
              spacing={1}
              xs={12}
              md={6}
            >
              <Grid item>
                <Typography variant="h6">
                  {currentStep?.content?.[selectedLanguage] ||
                    t("interactive_story.contentNotAvailable")}
                </Typography>
              </Grid>
              {!isEnd &&
                currentStep.options.map((option, index) => (
                  <Grid item key={index}>
                    <Button
                      variant="outlined"
                      onClick={() => setCurrentStepId(option.nextStep)}
                      sx={{ width: "100%" }}
                    >
                      {option.optionText?.[selectedLanguage] ||
                        option.optionText?.en}
                    </Button>
                  </Grid>
                ))}
              {isEnd && (
                <Grid container spacing={1} sx={{ justifyContent: "center" }}>
                  {currentStep.endType === "negative" ? (
                    <Grid
                      item
                      container
                      xs={12}
                      md={8}
                      spacing={1}
                      sx={{ justifyContent: "center", alignItems: "center" }}
                    >
                      {/* Negative ending content */}
                      <Grid item>
                        <Typography variant="h6" sx={{ color: "red" }}>
                          {t("interactive_story.ohNoWrongMove")}
                        </Typography>
                      </Grid>
                      {/* Retry the story */}
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleRetryStory}
                        >
                          {t("interactive_story.retryStory")}
                        </Button>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid
                      item
                      container
                      xs={12}
                      md={8}
                      spacing={1}
                      sx={{ justifyContent: "center", alignItems: "center" }}
                    >
                      {/* Positive ending content */}
                      <Grid item xs={12}>
                        <Typography variant="h6" color="green">
                          {t("interactive_story.congratulations")}
                        </Typography>
                      </Grid>
                      {/* Display retries and total time */}
                      <Grid item xs={6}>
                        <Typography variant="h6">
                          {t("interactive_story.numberOfRetries")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">: {retries}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">
                          {t("interactive_story.totalTimeTaken")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">
                          : {finalTimeTaken} {t("interactive_story.seconds")}
                        </Typography>
                      </Grid>
                      {/* Restart the story */}
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleRestartStory}
                        >
                          {t("interactive_story.restartStory")}
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default InteractiveStoryPage;
