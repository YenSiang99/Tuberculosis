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

const FillInBlanksPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedBlankId, setSelectedBlankId] = useState(null);
  const [usedWords, setUsedWords] = useState([]);
  const [gameTime, setGameTime] = useState(null);
  const [gameTimer, setGameTimer] = useState(null);

  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const [openInstructionDialog, setOpenInstructionDialog] = useState(true);

  const [gameOver, setGameOver] = useState(false);

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

  const endGame = () => {
    if (!gameOver) {
      setGameOver(true);
      const finalScore = calculateScore();
      setScore(finalScore);
      setShowResult(true);
      submitFillBlankScore();
    }
  };

  const handleSubmit = () => {
    endGame();
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
    setShowResult(false);
    setScore(0);

    // Automatically set focus to the first blank (if it exists)
    if (resetQuestions.length > 0) {
      setSelectedBlankId(resetQuestions[0]._id);
    }

    setGameOver(false);
  };

  useEffect(() => {
    if (!openInstructionDialog && !gameOver && gameTimer !== null) {
      if (gameTimer > 0) {
        const countdown = setTimeout(() => setGameTimer(gameTimer - 1), 1000);
        return () => clearTimeout(countdown);
      } else if (gameTimer === 0) {
        endGame();
      }
    }
  }, [gameTimer, openInstructionDialog, gameOver]);

  useEffect(() => {
    axios
      .get("/fillBlanks/active")
      .then((response) => {
        const data = response.data;

        setGameTime(data.totalGameTime);
        setGameTimer(data.totalGameTime);
        const questionsWithAnswers = response.data.questions.map((q) => ({
          ...q,
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
  }, []);

  return (
    <Container sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Fill in the blanks!
      </Typography>

      {!showResult ? (
        <Grid container spacing={2}>
          <Grid item>
            <Typography variant="subtitle1">Choose a word:</Typography>
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
            {questions.map((question, index) => (
              <Grid item key={index} xs={6} md={3}>
                <Button
                  variant="outlined"
                  onClick={() => handleWordSelect(question.answer)}
                  disabled={usedWords.includes(question.answer)}
                  fullWidth
                  sx={{ height: "100%" }}
                >
                  {question.answer}
                </Button>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            {gameTimer !== null ? (
              <Typography variant="h7">
                Time left: {gameTimer} seconds
              </Typography>
            ) : (
              <Typography variant="h7">Loading...</Typography>
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
            <Button variant="outlined" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ my: 2 }}>
          <Typography variant="h4" gutterBottom>
            Your Score: {score} / {questions.length}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Summary of Questions:
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
                      ? question.answer + " (Correct)"
                      : question.answerChoice + " (Wrong)"
                    : "No answer"}
                </span>{" "}
                {question.textAfter}
              </Typography>
              {question.answerChoice !== question.answer ? (
                <Typography
                  variant="h7"
                  display="block"
                  sx={{ color: "green" }}
                >
                  {`Answer: ${question.answer}`}
                </Typography>
              ) : null}
            </Box>
          ))}
          <Button variant="outlined" onClick={handleReset}>
            Reset Game
          </Button>
        </Box>
      )}
      <Dialog
        // fullScreen={fullScreen}
        open={openInstructionDialog}
        onClose={handleCloseInstructionDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Fill in the Blanks Game: How To Play?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            1. <strong>Objective:</strong> <br />
            Fill in the blanks with the correct words to complete the sentences
            about tuberculosis. Each blank represents a missing word that you
            need to find and select.
            <br />
            <br />
            2. <strong>Selecting Words:</strong> <br />
            Choose a word from the list provided by clicking on it. Once
            selected, it will be placed in the highlighted blank. You cannot
            reuse a word once it has been used.
            <br />
            <br />
            3. <strong>Removing Words:</strong> <br />
            If you want to change a word, click on the blank where the word is
            placed. This will remove the word and allow you to select a
            different one.
            <br />
            <br />
            4. <strong>Time Limit:</strong> <br />
            You have {gameTime !== null ? gameTime : "a limited amount of"}{" "}
            seconds to fill in all the blanks. Keep an eye on the timer at the
            top of the screen.
            <br />
            <br />
            5. <strong>Submit Your Answers:</strong> <br />
            Once you have filled in all the blanks, or when time runs out,
            submit your answers to see your score and review the correct
            answers.
            <br />
            <br />
            6. <strong>Scoring:</strong> <br />
            You will earn points for each correct word you place. The final
            score will be shown after you submit your answers or when time runs
            out.
            <br />
            <br />
            7. <strong>Resetting the Game:</strong> <br />
            You can reset the game at any time to try again with a fresh start.
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

export default FillInBlanksPage;
