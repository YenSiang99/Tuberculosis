import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "../../components/axios"; // Adjust with your axios instance
import { useTranslation } from "react-i18next";

// Instruction Dialog Component
const InstructionDialog = ({
  showInstructions,
  dontShowAgain,
  setDontShowAgain,
  handleCloseInstructionDialog,
  gameState,
  gameTime,
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
      {t("fill_in_the_blanks.gameInstructionsTitle")}
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        1. <strong>{t("fill_in_the_blanks.objective")}:</strong> <br />
        {t("fill_in_the_blanks.objectiveText")}
        <br />
        <br />
        2. <strong>{t("fill_in_the_blanks.selectingWords")}:</strong> <br />
        {t("fill_in_the_blanks.selectingWordsText")}
        <br />
        <br />
        3. <strong>{t("fill_in_the_blanks.removingWords")}:</strong> <br />
        {t("fill_in_the_blanks.removingWordsText")}
        <br />
        <br />
        4. <strong>{t("fill_in_the_blanks.timeLimit")}:</strong> <br />
        {t("fill_in_the_blanks.timeLimitText", {
          gameTime:
            gameTime !== null
              ? gameTime
              : t("fill_in_the_blanks.aLimitedAmountOf"),
        })}
        <br />
        <br />
        5. <strong>{t("fill_in_the_blanks.submitYourAnswers")}:</strong> <br />
        {t("fill_in_the_blanks.submitYourAnswersText")}
        <br />
        <br />
        6. <strong>{t("fill_in_the_blanks.scoring")}:</strong> <br />
        {t("fill_in_the_blanks.scoringText")}
        <br />
        <br />
        7. <strong>{t("fill_in_the_blanks.resettingTheGame")}:</strong> <br />
        {t("fill_in_the_blanks.resettingTheGameText")}
      </DialogContentText>
      {gameState === "initial" && (
        <FormControlLabel
          control={
            <Checkbox
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
          }
          label={t("fill_in_the_blanks.dontShowAgain")}
        />
      )}
    </DialogContent>
    <DialogActions>
      <Button
        onClick={handleCloseInstructionDialog}
        variant="contained"
        fullWidth
      >
        {t("fill_in_the_blanks.okay")}
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
        {t("fill_in_the_blanks.areYouReady")}
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={handleStartGame}
        sx={{ mt: 3, minWidth: 200 }}
      >
        {t("fill_in_the_blanks.startGame")}
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

const FillInBlanksPage = () => {
  const { t, i18n } = useTranslation();
  const selectedLanguage = i18n.language || "en";
  const [prevLanguage, setPrevLanguage] = useState(selectedLanguage);

  const [questions, setQuestions] = useState([]);
  const [selectedBlankId, setSelectedBlankId] = useState(null);
  const [usedWords, setUsedWords] = useState([]);
  const [gameTime, setGameTime] = useState(null);
  const [gameTimer, setGameTimer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [randomizedWords, setRandomizedWords] = useState([]);

  const [gameState, setGameState] = useState("initial");
  const [showInstructions, setShowInstructions] = useState(true);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [gamePause, setGamePause] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);

  const resetGame = () => {
    setQuestions([]);
    setSelectedBlankId(null);
    setUsedWords([]);
    setGameTime(null);
    setGameTimer(null);
    setShowResult(false);
    setScore(0);
    setGameState("initial");
    setGameStart(false);
    setGamePause(false);
    setGameEnd(false);
    setShowCountdown(false);
    setCountdown(3);

    // Check localStorage preference for instructions
    const hideInstructions = localStorage.getItem("hideFillBlanksInstructions");
    if (hideInstructions === "true") {
      setShowInstructions(false);
      setShowStartDialog(true);
    } else {
      setShowInstructions(true);
      setShowStartDialog(false);
    }

    fetchQuestions();
  };

  // Handle language change and reset the game
  useEffect(() => {
    resetGame();
  }, [selectedLanguage]);

  // Check local storage preference on mount
  useEffect(() => {
    const hideInstructions = localStorage.getItem("hideFillBlanksInstructions");
    if (hideInstructions === "true") {
      setShowInstructions(false);
      setShowStartDialog(true);
    }
  }, []);

  // Handle instruction dialog close
  const handleCloseInstructionDialog = () => {
    if (dontShowAgain) {
      localStorage.setItem("hideFillBlanksInstructions", "true");
    }
    setShowInstructions(false);

    if (gameState === "initial") {
      setShowStartDialog(true);
    } else {
      setGamePause(false);
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
      setGameStart(true);
      setGamePause(false);
    }
  }, [countdown, gameState]);

  const handleOpenInstructionDialog = () => {
    setShowInstructions(true);
    setGamePause(true);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Handle language change and reset the game
  useEffect(() => {
    if (selectedLanguage !== prevLanguage) {
      resetGame();
      setPrevLanguage(selectedLanguage);
    }
  }, [selectedLanguage, prevLanguage]);

  const submitFillBlankScore = async () => {
    console.log("submit called...");
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    if (!storedUserData) return; // Only submit score if user is logged in

    const totalTimeTaken =
      gameTime !== null && gameTimer !== null ? gameTime - gameTimer : 0;

    const payload = {
      totalTimeTaken, // Total time taken to complete the game
      score: calculateScore(), // Calculate the user's score
    };

    try {
      const response = await axios.post("/score/fillblank/submit", payload, {});
      console.log("Score submitted successfully", response.data);
    } catch (error) {
      console.error("Error submitting fill-in-the-blank score", error);
    }
  };

  const handleWordSelect = (word) => {
    if (!usedWords.includes(word)) {
      const updatedQuestions = questions.map((q) =>
        q._id === selectedBlankId ? { ...q, answerChoice: word } : q
      );
      setQuestions(updatedQuestions);
      setUsedWords([...usedWords, word]);

      const nextEmptyField = updatedQuestions.find(
        (q) => q.answerChoice === ""
      );
      if (nextEmptyField) {
        setSelectedBlankId(nextEmptyField._id);
      } else {
        setSelectedBlankId(null);
      }
    }
  };

  const handleBlankSelect = (id) => {
    setSelectedBlankId(id);
  };

  const handleBlankRemove = (id) => {
    const wordToRemove = questions.find((q) => q._id === id).answerChoice;
    const updatedQuestions = questions.map((q) =>
      q._id === id ? { ...q, answerChoice: "" } : q
    );
    setQuestions(updatedQuestions);
    setUsedWords(usedWords.filter((word) => word !== wordToRemove));
    setSelectedBlankId(id);
  };

  const calculateScore = () => {
    let score = 0;

    // Loop through each question to compare the user's answerChoice with the correct answer
    questions.forEach((question) => {
      if (
        question.answerChoice.toLowerCase().trim() ===
        question.answer.toLowerCase().trim()
      ) {
        score += 1;
      }
    });

    return score;
  };

  const handleGameEnd = () => {
    setGameStart(false);
    setGamePause(false);
    setGameEnd(true);
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResult(true);
    submitFillBlankScore();
  };

  const handleSubmit = () => {
    if (!gameEnd) {
      handleGameEnd();
    }
  };

  const handleReset = () => {
    resetGame();
    // const resetQuestions = questions.map((question) => ({
    //   ...question,
    //   answerChoice: "",
    // }));

    // setQuestions(resetQuestions);
    // setUsedWords([]);

    // // Re-randomize the words on reset
    // setRandomizedWords(shuffleArray([...randomizedWords]));

    // if (gameTime !== null) {
    //   setGameTimer(gameTime);
    // }
    // setGameEnd(false);
    // setGamePause(false);
    // setGameStart(true);
    // setScore(0);

    // if (resetQuestions.length > 0) {
    //   setSelectedBlankId(resetQuestions[0]._id);
    // }
  };

  useEffect(() => {
    if (gameStart && !gamePause && gameTimer !== null) {
      if (gameTimer > 0) {
        const countdown = setTimeout(() => setGameTimer(gameTimer - 1), 1000);
        return () => clearTimeout(countdown);
      } else if (gameTimer === 0) {
        handleGameEnd();
      }
    }
  }, [gameTimer, gameStart, gamePause]);

  const fetchQuestions = () => {
    axios
      .get("/fillBlanks/active")
      .then((response) => {
        const data = response.data;

        setGameTime(data.totalGameTime);
        setGameTimer(data.totalGameTime);

        const questionsWithAnswers = data.questions.map((q) => ({
          _id: q._id,
          textBefore:
            q.textBefore[selectedLanguage] || q.textBefore["en"] || "",
          textAfter: q.textAfter[selectedLanguage] || q.textAfter["en"] || "",
          answer: q.answer[selectedLanguage] || q.answer["en"] || "",
          answerChoice: "",
        }));

        setQuestions(questionsWithAnswers);

        // Create and shuffle the word options
        const uniqueWords = [
          ...new Set(questionsWithAnswers.map((q) => q.answer)),
        ];
        setRandomizedWords(shuffleArray(uniqueWords));

        if (questionsWithAnswers.length > 0) {
          setSelectedBlankId(questionsWithAnswers[0]._id);
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <Container sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        {t("fill_in_the_blanks.title")}
      </Typography>

      <InstructionDialog
        showInstructions={showInstructions}
        dontShowAgain={dontShowAgain}
        setDontShowAgain={setDontShowAgain}
        handleCloseInstructionDialog={handleCloseInstructionDialog}
        gameState={gameState}
        gameTime={gameTime}
        t={t}
      />

      <StartGameDialog
        showStartDialog={showStartDialog}
        handleStartGame={handleStartGame}
        t={t}
      />

      <CountdownDialog showCountdown={showCountdown} countdown={countdown} />

      {(gameState === "playing" || gameEnd) &&
        // Your existing game content JSX
        (!gameEnd ? (
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  handleOpenInstructionDialog();
                }}
              >
                {t("fill_in_the_blanks.viewInstruction")}
              </Button>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">
                {t("fill_in_the_blanks.chooseAWord")}:
              </Typography>
            </Grid>
            {/* Word selection */}
            <Grid
              item
              xs={12}
              container
              direction="row"
              spacing={1}
              sx={{ justifyContent: "center", width: "100%" }}
            >
              {randomizedWords.map((word, index) => (
                <Grid item key={index} xs={6} md={3}>
                  <Button
                    variant="outlined"
                    onClick={() => handleWordSelect(word)}
                    disabled={usedWords.includes(word)}
                    fullWidth
                    sx={{ height: "100%" }}
                  >
                    {word}
                  </Button>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              {gameTimer !== null ? (
                <Typography variant="h7">
                  {t("fill_in_the_blanks.timeLeft")}: {gameTimer}{" "}
                  {t("fill_in_the_blanks.seconds")}
                </Typography>
              ) : (
                <Typography variant="h7">
                  {t("fill_in_the_blanks.loading")}
                </Typography>
              )}
            </Grid>

            {/* Questions blanks */}
            <Grid item container spacing={2}>
              {questions.map((question, index) => (
                <Grid
                  item
                  container
                  sx={{ alignItems: "center" }}
                  key={question._id}
                >
                  <Grid item xs={12}>
                    <Typography variant="body1" display="inline">
                      {index + 1 + ") " + question.textBefore}
                    </Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      value={question.answerChoice}
                      onClick={() =>
                        question.answerChoice
                          ? handleBlankRemove(question._id)
                          : handleBlankSelect(question._id)
                      }
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ width: "150px", verticalAlign: "middle" }}
                    />
                    <Typography variant="body1" display="inline">
                      {question.textAfter}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid
              item
              container
              sx={{ justifyContent: "flex-end", alignItems: "center" }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  handleSubmit();
                }}
              >
                {t("fill_in_the_blanks.submit")}
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ my: 2 }}>
            <Typography variant="h4" gutterBottom>
              {t("fill_in_the_blanks.yourScore")}: {score} / {questions.length}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {t("fill_in_the_blanks.summaryOfQuestions")}:
            </Typography>
            {questions.map((question, index) => (
              <Box key={question._id} sx={{ mb: 4 }}>
                <Typography variant="h7" sx={{ textAlign: "left" }}>
                  {index + 1 + ") "}
                  {question.textBefore}{" "}
                  <span
                    style={{
                      color:
                        question.answerChoice === question.answer
                          ? "green"
                          : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {question.answerChoice
                      ? question.answerChoice === question.answer
                        ? question.answer +
                          ` (${t("fill_in_the_blanks.correct")})`
                        : question.answerChoice +
                          ` (${t("fill_in_the_blanks.wrong")})`
                      : t("fill_in_the_blanks.noAnswer")}
                  </span>{" "}
                  {question.textAfter}
                </Typography>
                {question.answerChoice !== question.answer ? (
                  <Typography
                    variant="h7"
                    display="block"
                    sx={{ color: "green" }}
                  >
                    {t("fill_in_the_blanks.answer")}: {question.answer}
                  </Typography>
                ) : null}
              </Box>
            ))}
            <Button variant="outlined" onClick={handleReset}>
              {t("fill_in_the_blanks.resetGame")}
            </Button>
          </Box>
        ))}
    </Container>
  );
};

export default FillInBlanksPage;
