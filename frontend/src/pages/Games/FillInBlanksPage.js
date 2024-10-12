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
} from "@mui/material";
import axios from "../../components/axios"; // Adjust with your axios instance
import { useTranslation } from "react-i18next";

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

  const [openInstructionDialog, setOpenInstructionDialog] = useState(true);

  const [gameStart, setGameStart] = useState(false);
  const [gamePause, setGamePause] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);

  // Handle language change and reset the game
  useEffect(() => {
    if (selectedLanguage !== prevLanguage) {
      resetGame();
      setPrevLanguage(selectedLanguage);
    }
  }, [selectedLanguage, prevLanguage]);

  const resetGame = () => {
    setQuestions([]);
    setSelectedBlankId(null);
    setUsedWords([]);
    setGameTime(null);
    setGameTimer(null);
    setShowResult(false);
    setScore(0);
    setGameStart(false);
    setGamePause(false);
    setGameEnd(false);
    setOpenInstructionDialog(true);
    fetchQuestions(); // Fetch questions in the new language
  };

  const submitFillBlankScore = async () => {
    console.log("submit called...");
    const storedUserData = JSON.parse(sessionStorage.getItem("userData"));

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

  const handleCloseInstructionDialog = () => {
    setOpenInstructionDialog(false);
    setGameStart(true);
    if (gamePause) {
      setGamePause(false);
    }
  };

  const handleOpenInstructionDialog = () => {
    setOpenInstructionDialog(true);
    setGamePause(true);
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

  const handleSubmit = () => {
    if (!gameEnd) {
      setGameStart(false);
      setGamePause(false);
      setGameEnd(true);
      const finalScore = calculateScore();
      setScore(finalScore);
      setShowResult(true);
      submitFillBlankScore();
    }
  };

  const handleReset = () => {
    const resetQuestions = questions.map((question) => ({
      ...question,
      answerChoice: "",
    }));

    setQuestions(resetQuestions);
    setUsedWords([]);
    if (gameTime !== null) {
      setGameTimer(gameTime); // Reset the game timer
    }
    setGameEnd(false);
    setGamePause(false);
    setGameStart(true);
    setScore(0);

    // Automatically set focus to the first blank (if it exists)
    if (resetQuestions.length > 0) {
      setSelectedBlankId(resetQuestions[0]._id);
    }
    setGameEnd(false);
    setGamePause(false);
    setGameStart(true);
  };

  useEffect(() => {
    if (gameStart && !gamePause && gameTimer !== null) {
      if (gameTimer > 0) {
        const countdown = setTimeout(() => setGameTimer(gameTimer - 1), 1000);
        return () => clearTimeout(countdown);
      } else if (gameTimer === 0) {
        setGameEnd(true);
        submitFillBlankScore();
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

        // Map questions to include the selected language
        const questionsWithAnswers = data.questions.map((q) => ({
          _id: q._id,
          textBefore:
            q.textBefore[selectedLanguage] || q.textBefore["en"] || "",
          textAfter: q.textAfter[selectedLanguage] || q.textAfter["en"] || "",
          answer: q.answer[selectedLanguage] || q.answer["en"] || "",
          answerChoice: "", // Add empty answerChoice field to each question
        }));

        setQuestions(questionsWithAnswers);

        // Automatically select the first blank by setting the selectedBlankId
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

      {gameStart ? (
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
            {/* Generate unique words to select */}
            {[...new Set(questions.map((q) => q.answer))].map((word, index) => (
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
      )}
      <Dialog
        open={openInstructionDialog}
        onClose={handleCloseInstructionDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
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
            5. <strong>
              {t("fill_in_the_blanks.submitYourAnswers")}:
            </strong>{" "}
            <br />
            {t("fill_in_the_blanks.submitYourAnswersText")}
            <br />
            <br />
            6. <strong>{t("fill_in_the_blanks.scoring")}:</strong> <br />
            {t("fill_in_the_blanks.scoringText")}
            <br />
            <br />
            7. <strong>{t("fill_in_the_blanks.resettingTheGame")}:</strong>{" "}
            <br />
            {t("fill_in_the_blanks.resettingTheGameText")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInstructionDialog} autoFocus>
            {t("fill_in_the_blanks.okay")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FillInBlanksPage;
