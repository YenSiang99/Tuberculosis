import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "../../components/axios";
import { useTranslation } from "react-i18next";

const QuizPage = () => {
  const test = false;
  const { i18n, t } = useTranslation();
  const selectedLanguage = i18n.language || "en";

  const [prevLanguage, setPrevLanguage] = useState(selectedLanguage);

  const [questions, setQuestions] = useState([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questionTime, setQuestionTime] = useState(null);
  const [questionTimer, setQuestionTimer] = useState(null);
  const [nextQuestionTimer, setNextQuestionTimer] = useState(0);
  const [answerFeedback, setFeedback] = useState(null);

  const [gameEnd, setGameEnd] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [gamePause, setGamePause] = useState(false);

  const [openInstructionDialog, setOpenInstructionDialog] = useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [totalTimeTaken, setTotalTimeTaken] = useState(0);

  const submitQuizScore = async () => {
    const storedUserData = JSON.parse(sessionStorage.getItem("userData"));

    if (!storedUserData) return;

    const payload = {
      totalTimeTaken: totalTimeTaken,
      score: score,
      completionStatus: score === questions.length ? "Completed" : "Incomplete",
    };

    try {
      const response = await axios.post("/score/quizzes/submit", payload);
      console.log("Score submitted successfully", response.data);
    } catch (error) {
      console.error("Error submitting quiz score", error);
    }
  };

  const handleOptionClick = (option, questionId) => {
    const timeSpentOnQuestion = questionTime - questionTimer;
    setTotalTimeTaken((prevTime) => prevTime + timeSpentOnQuestion);

    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question._id === questionId
          ? { ...question, selectedOption: option._id }
          : question
      )
    );

    setFeedback(option.isCorrect ? "correct" : "wrong");
    if (option.isCorrect) setScore(score + 1);
    if (currentQuestionIndex < questions.length - 1) {
      if (test) {
        goToNextQuestion();
      }
      setQuestionTimer(0);
      setNextQuestionTimer(5);
    } else {
      setGameEnd(true);
    }
  };

  const handleNoAnswer = () => {
    setFeedback("wrong");
    setTotalTimeTaken((prevTime) => prevTime + questionTime);
    setNextQuestionTimer(5);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionTimer(questionTime);
      setFeedback(null);
      setNextQuestionTimer(0);
    } else {
      setGameEnd(true);
      submitQuizScore();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
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

  useEffect(() => {
    if (!test && gameStart && !gamePause) {
      if (questionTimer > 0 && answerFeedback === null) {
        const countdown = setTimeout(
          () => setQuestionTimer(questionTimer - 1),
          1000
        );
        return () => clearTimeout(countdown);
      }
      if (questionTimer === 0 && answerFeedback === null) {
        handleNoAnswer();
      }
    }
  }, [questionTimer, answerFeedback, gameStart, gamePause]);

  useEffect(() => {
    if (!test && gameStart && !gamePause && questionTimer !== null) {
      if (answerFeedback && nextQuestionTimer > 0) {
        const countdown = setTimeout(
          () => setNextQuestionTimer(nextQuestionTimer - 1),
          1000
        );
        return () => clearTimeout(countdown);
      }
      if (nextQuestionTimer === 0 && answerFeedback !== null) {
        goToNextQuestion();
      }
    }
  }, [nextQuestionTimer, answerFeedback, gameStart, gamePause]);

  useEffect(() => {
    const fetchActiveQuiz = async () => {
      try {
        const response = await axios.get("/quizzes/active");
        const data = response.data;
        console.log("Fetched quiz data:", data);
        if (data && data.questions) {
          setQuestions(data.questions);
          setQuestionTime(data.timeLimitPerQuestion);
          setQuestionTimer(data.timeLimitPerQuestion);
        }
      } catch (error) {
        console.error("Failed to fetch active quiz", error);
      }
    };

    fetchActiveQuiz();
  }, []);

  // Detect language change and reset game
  useEffect(() => {
    if (selectedLanguage !== prevLanguage) {
      resetGame();
      setPrevLanguage(selectedLanguage);
    }
  }, [selectedLanguage, prevLanguage]);

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuestionTimer(questionTime);
    setNextQuestionTimer(0);
    setFeedback(null);
    setGameEnd(false);
    setGameStart(false);
    setGamePause(false);
    setOpenInstructionDialog(true);
    setTotalTimeTaken(0);
  };

  console.log("Current Question:", questions[currentQuestionIndex]);

  const colors = ["#7f0000", "#002984", "#827717", "#1b5e20"];

  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
      >
        {t("quiz_game.title")}
      </Typography>
      {/* <DataViewer data={questions} variableName="questions"></DataViewer> */}
      {!gameEnd && questions.length > 0 ? (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          spacing={1}
        >
          {/* View instruction */}
          <Grid
            item
            container
            xs={12}
            sx={{ justifyContent: "start", alignItems: "center" }}
          >
            <Button
              variant="contained"
              onClick={() => {
                handleOpenInstructionDialog();
              }}
            >
              {t("quiz_game.viewInstruction")}
            </Button>
          </Grid>
          {/* Title */}

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography variant="h4">
              {questions[currentQuestionIndex]?.questionText?.[
                selectedLanguage
              ] ||
                questions[currentQuestionIndex]?.questionText?.en ||
                t("quiz_game.questionTextNotAvailable")}
            </Typography>
          </Grid>
          {/* Time Countdown for question */}
          <Grid item xs={12} sm={12} md={12} lg={12}>
            {questionTimer !== null ? (
              <Typography variant="h7">
                {t("quiz_game.timeLeft")}: {questionTimer}{" "}
                {t("quiz_game.seconds")}
              </Typography>
            ) : (
              <Typography variant="h7">{t("quiz_game.loading")}</Typography>
            )}
          </Grid>
          {/* Answer Selection */}
          <Grid item container spacing={1}>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <Grid item xs={12} sm={12} md={6} lg={6} key={option._id}>
                <Button
                  variant="contained"
                  onClick={() =>
                    handleOptionClick(
                      option,
                      questions[currentQuestionIndex]._id
                    )
                  }
                  disabled={answerFeedback !== null}
                  sx={{
                    backgroundColor: colors[index],
                    color: "#fff",
                    width: "100%",
                    height: "100px",
                    fontSize: "1rem",
                    whiteSpace: "normal",
                    lineHeight: 1.5,
                  }}
                >
                  {option.optionText?.[selectedLanguage] ||
                    option.optionText?.en ||
                    t("quiz_game.optionTextNotAvailable")}
                </Button>
              </Grid>
            ))}
          </Grid>
          {/* Time Countdown interval to next question*/}
          {answerFeedback && (
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Typography
                variant="h6"
                sx={{ color: answerFeedback === "correct" ? "green" : "red" }}
              >
                {answerFeedback === "correct"
                  ? t("quiz_game.correct")
                  : t("quiz_game.wrong")}
              </Typography>
              {nextQuestionTimer > 0 && (
                <Typography variant="caption">
                  {t("quiz_game.nextQuestionIn")}: {nextQuestionTimer}{" "}
                  {t("quiz_game.seconds")}
                </Typography>
              )}
            </Grid>
          )}

          {/* Next and Previous button */}
          {test && (
            <Grid
              item
              container
              justifyContent="space-between"
              alignItems="center"
              direction="row"
            >
              <Grid
                item
                sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}
              >
                {currentQuestionIndex > 0 && (
                  <Button variant="contained" onClick={handlePreviousQuestion}>
                    {t("quiz_game.previous")}
                  </Button>
                )}
              </Grid>
              <Grid
                item
                sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}
              >
                {currentQuestionIndex < questions.length - 1 && (
                  <Button
                    variant="contained"
                    onClick={goToNextQuestion}
                    sx={{ flexGrow: 0, display: "flex" }}
                  >
                    {t("quiz_game.next")}
                  </Button>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      ) : (
        // Summary page
        <Box sx={{ my: 2 }}>
          <Typography variant="h3" gutterBottom>
            {t("quiz_game.yourScore")}: {score} / {questions.length}
          </Typography>
          <Typography variant="h4" gutterBottom>
            {t("quiz_game.summaryOfQuestions")}:
          </Typography>
          {questions.length > 0 ? (
            <>
              {questions.map((question) => (
                <Box key={question._id} sx={{ mb: 4 }}>
                  <Typography
                    sx={{ fontSize: "1.25rem", mb: 1, textAlign: "left" }}
                  >
                    {question.questionText?.[selectedLanguage] ||
                      question.questionText?.en ||
                      t("quiz_game.questionTextNotAvailable")}
                  </Typography>
                  <RadioGroup>
                    {question.options.map((option) => {
                      const isUserSelection =
                        question.selectedOption === option._id;
                      const isCorrect = option.isCorrect;
                      return (
                        <FormControlLabel
                          key={option._id}
                          value={
                            option.optionText?.[selectedLanguage] ||
                            option.optionText?.en ||
                            t("quiz_game.optionTextNotAvailable")
                          }
                          control={<Radio checked={isUserSelection} />}
                          label={
                            <span
                              style={{
                                color: isCorrect
                                  ? "green"
                                  : isUserSelection
                                  ? "red"
                                  : "black",
                                fontWeight: isUserSelection ? "bold" : "normal",
                              }}
                            >
                              {option.optionText?.[selectedLanguage] ||
                                option.optionText?.en ||
                                t("quiz_game.optionTextNotAvailable")}
                              {isUserSelection &&
                                !isCorrect &&
                                ` (${t("quiz_game.yourChoice")})`}
                              {isCorrect &&
                                ` (${t("quiz_game.correctAnswer")})`}
                            </span>
                          }
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              color: isUserSelection
                                ? isCorrect
                                  ? "green"
                                  : "red"
                                : isCorrect
                                ? "green"
                                : "black",
                            },
                          }}
                        />
                      );
                    })}
                  </RadioGroup>
                </Box>
              ))}
            </>
          ) : (
            <Typography variant="h6">{t("quiz_game.loadingQuiz")}</Typography>
          )}
        </Box>
      )}
      <Dialog
        open={openInstructionDialog}
        onClose={handleCloseInstructionDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {t("quiz_game.quizGameHowToPlay")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            1. <strong>{t("quiz_game.objective")}:</strong> <br />
            {t("quiz_game.objectiveText")}
            <br />
            <br />
            2. <strong>{t("quiz_game.multipleChoices")}:</strong> <br />
            {t("quiz_game.multipleChoicesText")}
            <br />
            <br />
            3. <strong>{t("quiz_game.timeLimit")}:</strong> <br />
            {t("quiz_game.timeLimitText", { questionTime })}
            <br />
            <br />
            4. <strong>{t("quiz_game.missedAnswers")}:</strong> <br />
            {t("quiz_game.missedAnswersText")}
            <br />
            <br />
            5. <strong>{t("quiz_game.preparationTime")}:</strong> <br />
            {t("quiz_game.preparationTimeText")}
            <br />
            <br />
            6. <strong>{t("quiz_game.finishStrong")}:</strong> <br />
            {t("quiz_game.finishStrongText")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInstructionDialog} autoFocus>
            {t("quiz_game.okay")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuizPage;
