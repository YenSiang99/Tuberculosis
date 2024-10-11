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
        {t("Quiz Time!")}
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
              {t("View Instruction")}
            </Button>
          </Grid>
          {/* Title */}

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography variant="h4">
              {questions[currentQuestionIndex]?.questionText?.[
                selectedLanguage
              ] ||
                questions[currentQuestionIndex]?.questionText?.en ||
                "Question text not available"}
            </Typography>
          </Grid>
          {/* Time Countdown for question */}
          <Grid item xs={12} sm={12} md={12} lg={12}>
            {questionTimer !== null ? (
              <Typography variant="h7">
                {t("Time left")}: {questionTimer} {t("seconds")}
              </Typography>
            ) : (
              <Typography variant="h7">{t("Loading...")}</Typography>
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
                    "Option text not available"}
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
                {answerFeedback === "correct" ? t("Correct!") : t("Wrong!")}
              </Typography>
              {nextQuestionTimer > 0 && (
                <Typography variant="caption">
                  {t("Next question in")}: {nextQuestionTimer} {t("seconds")}
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
                    {t("Previous")}
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
                    {t("Next")}
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
            {t("Your Score")}: {score} / {questions.length}
          </Typography>
          <Typography variant="h4" gutterBottom>
            {t("Summary of Questions")}:
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
                      "Question text not available"}
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
                            "Option text not available"
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
                                "Option text not available"}
                              {isUserSelection &&
                                !isCorrect &&
                                ` (${t("Your Choice")})`}
                              {isCorrect && ` (${t("Correct")})`}
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
            <Typography variant="h6">{t("Loading quiz...")}</Typography>
          )}
        </Box>
      )}
      <Dialog
        // fullScreen={fullScreen}
        open={openInstructionDialog}
        onClose={handleCloseInstructionDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {t("Quiz Game: How To Play?")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* Instructions translated */}
            1. <strong>{t("Objective")}:</strong> <br />
            {t("Answer all the questions correctly to complete the quiz.")}
            <br />
            <br />
            2. <strong>{t("Multiple Choices")}:</strong> <br />
            {t(
              "Each question will present 4 possible answers. Select the one you think is correct."
            )}
            <br />
            <br />
            3. <strong>{t("Time Limit")}:</strong> <br />
            {t("You have")} {questionTime} {t("seconds")}{" "}
            {t("to answer each question.")}
            <br />
            <br />
            4. <strong>{t("Missed Answers")}:</strong> <br />
            {t(
              "If the timer runs out before you answer, the question will be marked as incorrect."
            )}
            <br />
            <br />
            5. <strong>{t("Preparation Time")}:</strong> <br />
            {t(
              "There will be a 5-second interval between questions to get ready for the next one."
            )}
            <br />
            <br />
            6. <strong>{t("Finish Strong")}:</strong> <br />
            {t(
              "Keep going until you’ve answered all the questions. Good luck!"
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInstructionDialog} autoFocus>
            {t("Okay")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuizPage;
