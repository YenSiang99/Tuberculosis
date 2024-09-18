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

const QuizPage = () => {
  const test = false;

  const [questions, setQuestions] = useState([]); // Initialize as empty array

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  // Timer variables
  const [questionTimer, setQuestionTimer] = useState(10);
  const [nextQuestionTimer, setNextQuestionTimer] = useState(0);
  // Asnwer Feedback for each question and summary
  const [answerFeedback, setFeedback] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const [openInstructionDialog, setOpenInstructionDialog] = useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOptionClick = (option, questionId) => {
    // Set user selection option
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? { ...question, selectedOption: option.id }
          : question
      )
    );
    // Let user know if they selected the right or wrong answer
    setFeedback(option.isCorrect ? "correct" : "wrong");
    if (option.isCorrect) setScore(score + 1);
    if (currentQuestionIndex < questions.length - 1) {
      if (test) {
        goToNextQuestion();
      }
      setQuestionTimer(0);
      setNextQuestionTimer(5);
    } else {
      setShowResult(true);
    }
  };

  const handleNoAnswer = () => {
    setFeedback("wrong");
    setNextQuestionTimer(5); // Start the countdown to the next question
  };

  const goToNextQuestion = () => {
    console.log("Hello this is go to next question");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionTimer(10);
      setFeedback(null);
      setNextQuestionTimer(0);
    } else {
      setShowResult(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleCloseInstructionDialog = () => {
    setOpenInstructionDialog(false);
  };

  // State to countdown question timer
  useEffect(() => {
    if (!test && !openInstructionDialog) {
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
  }, [questionTimer, answerFeedback, openInstructionDialog]);

  // State to countdown next question timer
  useEffect(() => {
    if (!test && !openInstructionDialog) {
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
  }, [nextQuestionTimer, answerFeedback, openInstructionDialog]);

  useEffect(() => {
    const fetchActiveQuiz = async () => {
      try {
        const response = await axios.get("/quizzes/active");
        const data = response.data;

        if (data && data.questions) {
          setQuestions(data.questions); // Set the questions based on the API response
        }
      } catch (error) {
        console.error("Failed to fetch active quiz", error);
      }
    };

    fetchActiveQuiz();
  }, []);

  const colors = ["#7f0000", "#002984", "#827717", "#1b5e20"]; // Dark Red, Dark Blue, Dark Yellow, Dark Green

  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
      >
        Quiz Time!
      </Typography>
      {!showResult && questions.length > 0 ? (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          spacing={1}
        >
          {/* Title */}
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography variant="h4">
              {questions[currentQuestionIndex].questionText}
            </Typography>
          </Grid>
          {/* Time Countdown for question */}
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography variant="h7">
              Time left: {questionTimer} seconds
            </Typography>
          </Grid>
          {/* Time Countdown interval to next question*/}
          {answerFeedback && (
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Typography
                variant="h6"
                sx={{ color: answerFeedback === "correct" ? "green" : "red" }}
              >
                {answerFeedback === "correct" ? "Correct!" : "Wrong!"}
              </Typography>
              {nextQuestionTimer > 0 && (
                <Typography variant="caption">
                  Next question in: {nextQuestionTimer} seconds
                </Typography>
              )}
            </Grid>
          )}

          {/* Answer Selection */}
          <Grid item container spacing={1}>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <Grid item xs={12} sm={12} md={6} lg={6} key={option.id}>
                <Button
                  variant="contained"
                  onClick={() =>
                    handleOptionClick(
                      option,
                      questions[currentQuestionIndex].id
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
                  {option.optionText}
                </Button>
              </Grid>
            ))}
          </Grid>
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
                    previous
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
                    Next
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
            Your Score: {score} / {questions.length}
          </Typography>
          <Typography variant="h4" gutterBottom>
            Summary of Questions:
          </Typography>
          {questions.length > 0 ? (
            <>
              {questions.map((question) => (
                <Box key={question.id} sx={{ mb: 4 }}>
                  <Typography
                    sx={{ fontSize: "1.25rem", mb: 1, textAlign: "left" }}
                  >
                    {question.questionText}
                  </Typography>
                  <RadioGroup>
                    {question.options.map((option) => {
                      const isUserSelection =
                        question.selectedOption === option.id;
                      const isCorrect = option.isCorrect;
                      return (
                        <FormControlLabel
                          key={option.id}
                          value={option.optionText}
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
                              {option.optionText}
                              {isUserSelection &&
                                !isCorrect &&
                                " (Your Choice)"}
                              {isCorrect && " (Correct)"}
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
            <Typography variant="h6">Loading quiz...</Typography> // Show loading message until data is fetched
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
          {"Quiz Game: How To Play?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            1. <strong>Objective:</strong> <br />
            Answer all the questions correctly to complete the quiz.
            <br />
            <br />
            2. <strong>Multiple Choices:</strong> <br />
            Each question will present 4 possible answers. Select the one you
            think is correct.
            <br />
            <br />
            3. <strong>Time Limit:</strong> <br />
            You have 10 seconds to answer each question.
            <br />
            <br />
            4. <strong>Missed Answers:</strong> <br />
            If the timer runs out before you answer, the question will be marked
            as incorrect.
            <br />
            <br />
            5. <strong>Preparation Time:</strong> <br />
            There will be a 5-second interval between questions to get ready for
            the next one.
            <br />
            <br />
            6. <strong>Finish Strong:</strong> <br />
            Keep going until you’ve answered all the questions. Good luck!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInstructionDialog} autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuizPage;
