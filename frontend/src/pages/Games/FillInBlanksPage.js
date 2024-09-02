import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  TextField,
} from "@mui/material";

const FillInBlanksPage = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "Tuberculosis (TB) is caused by the bacterium ____.",
      answer: "Mycobacterium tuberculosis",
      answerChoice: "",
    },
    {
      id: 2,
      text: "The primary organ affected by tuberculosis is the ____.",
      answer: "lungs",
      answerChoice: "",
    },
    {
      id: 3,
      text: "TB is typically spread through ____ from an infected person.",
      answer: "airborne droplets",
      answerChoice: "",
    },
    {
      id: 4,
      text: "A common symptom of TB is a persistent ____ lasting more than three weeks.",
      answer: "cough",
      answerChoice: "",
    },
    {
      id: 5,
      text: "The test used to diagnose TB is called the ____ test.",
      answer: "Mantoux",
      answerChoice: "",
    },
  ]);
  const [selectedBlankId, setSelectedBlankId] = useState(1);
  const [usedWords, setUsedWords] = useState([]);

  const [gameTimer, setGameTimer] = useState(15);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleWordSelect = (word) => {
    if (!usedWords.includes(word)) {
      const updatedQuestions = questions.map((q) =>
        q.id === selectedBlankId ? { ...q, answerChoice: word } : q
      );
      setQuestions(updatedQuestions);
      setUsedWords([...usedWords, word]);

      const nextEmptyField = updatedQuestions.find(
        (q) => q.answerChoice === ""
      );
      if (nextEmptyField) {
        setSelectedBlankId(nextEmptyField.id);
      } else {
        setSelectedBlankId(null);
      }
    }
  };

  const handleBlankSelect = (id) => {
    setSelectedBlankId(id);
  };

  const handleBlankRemove = (id) => {
    const wordToRemove = questions.find((q) => q.id === id).answerChoice;
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, answerChoice: "" } : q
    );
    setQuestions(updatedQuestions);
    setUsedWords(usedWords.filter((word) => word !== wordToRemove));
    setSelectedBlankId(id);
  };

  const handleShowResults = () => {
    setShowResult(true);
  };

  const calculateScore = () => {
    let score = 0; // Initialize score counter

    // Loop through each question to compare the user's answerChoice with the correct answer
    questions.forEach((question) => {
      if (
        question.answerChoice.toLowerCase().trim() ===
        question.answer.toLowerCase().trim()
      ) {
        score += 1; // Increment score if the answer is correct
      }
    });

    return score; // Return the total score
  };

  const handleSubmit = () => {
    //handle submit
    setGameTimer(0);
    setShowResult(true);
  };

  const handleReset = () => {
    // Reset each question's answerChoice to an empty string
    const resetQuestions = questions.map((question) => ({
      ...question,
      answerChoice: "",
    }));

    setQuestions(resetQuestions); // Update the questions state with reset questions
    setUsedWords([]); // Clear the used words array
    setGameTimer(30); // Reset the timer to 30 seconds or any other initial value
    setShowResult(false); // Hide the result display
    setScore(0); // Reset the score to 0
  };

  useEffect(() => {
    if (gameTimer > 0) {
      const countdown = setTimeout(() => setGameTimer(gameTimer - 1), 1000);
      return () => clearTimeout(countdown);
    }
    if (gameTimer === 0) {
      const finalScore = calculateScore(); // Calculate the final score
      setScore(finalScore); // Update the score state
      handleShowResults();
    }
  }, [gameTimer]);

  return (
    <Container sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Fill in the blanks!
      </Typography>

      {!showResult ? (
        <Grid container spacing={2}>
          {/* title */}
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
            <Typography variant="h7">Time left: {gameTimer} seconds</Typography>
          </Grid>
          {/* Questions blanks */}
          <Grid item container spacing={2}>
            {questions.map((question, index) => (
              <Grid
                item
                container
                sx={{ alignItems: "center" }}
                key={question.id}
              >
                <Grid item xs={12}>
                  <Typography variant="body1" display="inline">
                    {index + 1 + ") " + question.text.split("____")[0]}
                  </Typography>
                  <TextField
                    size="small"
                    variant="outlined"
                    value={question.answerChoice}
                    onClick={() =>
                      question.answerChoice
                        ? handleBlankRemove(question.id)
                        : handleBlankSelect(question.id)
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ width: "150px", verticalAlign: "middle" }}
                  />
                  <Typography variant="body1" display="inline">
                    {question.text.split("____")[1]}
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
            <Button variant="outlined" onClick={() => handleSubmit()}>
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
            <Box key={question.id} sx={{ mb: 4 }}>
              {/* Question answer */}
              <Typography variant="h7" sx={{ textAlign: "left" }}>
                {index + 1 + ") "}
                {question.text.split("____")[0]}{" "}
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
                {question.text.split("____")[1]}
              </Typography>
              {/* Show Correct answer if answer is wrong. */}
              {question.answerChoice !== question.answer ? (
                <Typography
                  variant="h7"
                  display="block"
                  sx={{
                    color: "green",
                  }}
                >
                  {`Answer: ${question.answer}`}
                </Typography>
              ) : null}
            </Box>
          ))}
          <Button variant="outlined" onClick={() => handleReset()}>
            Reset Game
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default FillInBlanksPage;
