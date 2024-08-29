import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel, Grid } from '@mui/material';

const QuizPage = () => {
  const questions = [
    {
      id: 1,
      questionText: "What is Tuberculosis?",
      options: [
        { id: "q1o1", optionText: "A bacterial infection", isCorrect: true },
        { id: "q1o2", optionText: "A viral infection", isCorrect: false },
        { id: "q1o3", optionText: "A fungal infection", isCorrect: false },
        { id: "q1o4", optionText: "None of the above", isCorrect: false }
      ]
    },
    {
      id: 2,
      questionText: "How is Tuberculosis spread?",
      options: [
        { id: "q2o1", optionText: "Through contaminated water", isCorrect: false },
        { id: "q2o2", optionText: "Through the air when an infected person coughs or sneezes", isCorrect: true },
        { id: "q2o3", optionText: "Through insect bites", isCorrect: false },
        { id: "q2o4", optionText: "By touching infected surfaces", isCorrect: false }
      ]
    },
    {
      id: 3,
      questionText: "Which organ is primarily affected by Tuberculosis?",
      options: [
        { id: "q3o1", optionText: "Liver", isCorrect: false },
        { id: "q3o2", optionText: "Heart", isCorrect: false },
        { id: "q3o3", optionText: "Lungs", isCorrect: true },
        { id: "q3o4", optionText: "Kidneys", isCorrect: false }
      ]
    },
    {
      id: 4,
      questionText: "What is the standard treatment duration for Tuberculosis?",
      options: [
        { id: "q4o1", optionText: "1 week", isCorrect: false },
        { id: "q4o2", optionText: "2 months", isCorrect: false },
        { id: "q4o3", optionText: "6 to 9 months", isCorrect: true },
        { id: "q4o4", optionText: "1 year", isCorrect: false }
      ]
    },
    {
      id: 5,
      questionText: "What is the vaccine used to prevent Tuberculosis?",
      options: [
        { id: "q5o1", optionText: "BCG vaccine", isCorrect: true },
        { id: "q5o2", optionText: "Hepatitis B vaccine", isCorrect: false },
        { id: "q5o3", optionText: "MMR vaccine", isCorrect: false },
        { id: "q5o4", optionText: "Polio vaccine", isCorrect: false }
      ]
    }
  ];
  

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(10);
  const [nextQuestionTimer, setNextQuestionTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (timer > 0 && feedback === null) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
    if (timer === 0 && feedback === null) {
      handleNoAnswer();
    }
  }, [timer, feedback]);

  useEffect(() => {
    if (feedback && nextQuestionTimer > 0) {
      const countdown = setTimeout(() => setNextQuestionTimer(nextQuestionTimer - 1), 1000);
      return () => clearTimeout(countdown);
    }
    if (nextQuestionTimer === 0 && feedback !== null) {
      goToNextQuestion();
    }
  }, [nextQuestionTimer, feedback]);

  const handleOptionClick = (option) => {
    setFeedback(option.isCorrect ? 'correct' : 'wrong');
    if (option.isCorrect) setScore(score + 1);
    if (currentQuestionIndex < questions.length - 1) {
      setTimer(0);
      setNextQuestionTimer(5);
    } else {
      setShowSummary(true);
    }
  };

  const handleNoAnswer = () => {
    setFeedback('wrong');
    setNextQuestionTimer(5); // Start the countdown to the next question
  };

  

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(10);
      setFeedback(null);
      setNextQuestionTimer(0);
    } else {
      setShowSummary(true);
    }
  };


  const colors = ['#7f0000', '#002984', '#827717', '#1b5e20']; // Dark Red, Dark Blue, Dark Yellow, Dark Green

  return (
    <Box sx={{ p: 4, textAlign: 'center', height: '100vh', position: 'relative' }}>
      {!showSummary ? (
        <>
          <Typography variant="h4" sx={{ mb: 2, fontSize: '2rem' }}>
            {questions[currentQuestionIndex].questionText}
          </Typography>
          
          <Typography variant="h5" sx={{ mb: 2 }}>
            Time left: {timer} seconds
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <Grid item xs={6} key={option.id}>
                <Button
                  variant="contained"
                  onClick={() => handleOptionClick(option)}
                  disabled={feedback !== null}
                  sx={{
                    backgroundColor: colors[index],
                    color: '#fff',
                    width: '100%',
                    height: '100px',
                    fontSize: '1rem',
                    whiteSpace: 'normal',
                    lineHeight: 1.5,
                  }}
                >
                  {option.optionText}
                </Button>
              </Grid>
            ))}
          </Grid>
          {feedback && (
            <>
              <Typography
                variant="h6"
                sx={{ mt: 2, color: feedback === 'correct' ? 'green' : 'red' }}
              >
                {feedback === 'correct' ? 'Correct!' : 'Wrong!'}
              </Typography>
              {nextQuestionTimer > 0 && (
                <Typography
                  variant="caption"
                  sx={{ mt: 2 }}
                >
                  Next question in: {nextQuestionTimer} seconds
                </Typography>
              )}
            </>
          )}
        </>
      ) : (
        <Box>
          <Typography variant="h3" gutterBottom>
            Your Score: {score} / {questions.length}
          </Typography>
          <Typography variant="h4" gutterBottom>
            Summary of Questions:
          </Typography>
          {questions.map((question) => (
            <Box key={question.id} sx={{ mb: 4 }}>
              <Typography sx={{ fontSize: '1.25rem', mb: 1,textAlign: 'left', }}>
                {question.questionText}
              </Typography>
              <RadioGroup>
                {question.options.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.optionText}
                    control={<Radio checked={option.isCorrect} />}
                    label={option.optionText}
                    disabled
                  />
                ))}
              </RadioGroup>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default QuizPage;
