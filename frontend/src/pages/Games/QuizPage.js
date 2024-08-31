import React, { useState, useEffect } from 'react';
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

} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const QuizPage = () => {
  const test = true;

  const [questions, setQuestions] = useState([
    {
      id: 1,
      questionText: "What is Tuberculosis?",
      options: [
        { id: "q1o1", optionText: "A bacterial infection", isCorrect: true },
        { id: "q1o2", optionText: "A viral infection", isCorrect: false },
        { id: "q1o3", optionText: "A fungal infection", isCorrect: false },
        { id: "q1o4", optionText: "None of the above", isCorrect: false }
      ],
      selectedOption: null,
    },
    {
      id: 2,
      questionText: "How is Tuberculosis spread?",
      options: [
        { id: "q2o1", optionText: "Through contaminated water", isCorrect: false },
        { id: "q2o2", optionText: "Through the air when an infected person coughs or sneezes", isCorrect: true },
        { id: "q2o3", optionText: "Through insect bites", isCorrect: false },
        { id: "q2o4", optionText: "By touching infected surfaces", isCorrect: false }
      ],
      selectedOption: null,
    },
    {
      id: 3,
      questionText: "Which organ is primarily affected by Tuberculosis?",
      options: [
        { id: "q3o1", optionText: "Liver", isCorrect: false },
        { id: "q3o2", optionText: "Heart", isCorrect: false },
        { id: "q3o3", optionText: "Lungs", isCorrect: true },
        { id: "q3o4", optionText: "Kidneys", isCorrect: false }
      ],
      selectedOption: null,
    },
    {
      id: 4,
      questionText: "What is the standard treatment duration for Tuberculosis?",
      options: [
        { id: "q4o1", optionText: "1 week", isCorrect: false },
        { id: "q4o2", optionText: "2 months", isCorrect: false },
        { id: "q4o3", optionText: "6 to 9 months", isCorrect: true },
        { id: "q4o4", optionText: "1 year", isCorrect: false }
      ],
      selectedOption: null,
    },
    {
      id: 5,
      questionText: "What is the vaccine used to prevent Tuberculosis?",
      options: [
        { id: "q5o1", optionText: "BCG vaccine", isCorrect: true },
        { id: "q5o2", optionText: "Hepatitis B vaccine", isCorrect: false },
        { id: "q5o3", optionText: "MMR vaccine", isCorrect: false },
        { id: "q5o4", optionText: "Polio vaccine", isCorrect: false }
      ],
      selectedOption: null,
    }
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  // Timer variables
  const [questionTimer, setQuestionTimer] = useState(10);
  const [nextQuestionTimer, setNextQuestionTimer] = useState(0);
  // Asnwer Feedback for each question and summary
  const [answerFeedback, setFeedback] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const [openInstructionDialog, setOpenInstructionDialog] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleOptionClick = (option,questionId) => {
    // Set user selection option
    setQuestions(prevQuestions =>
      prevQuestions.map(question =>
        question.id === questionId
          ? { ...question, selectedOption: option.id }
          : question
      )
    );
    // Let user know if they selected the right or wrong answer
    setFeedback(option.isCorrect ? 'correct' : 'wrong');
    if (option.isCorrect) setScore(score + 1);
    if (currentQuestionIndex < questions.length - 1) {
      if(test){
        goToNextQuestion()
      }
      setQuestionTimer(0);
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
    console.log('Hello this is go to next question')
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionTimer(10);
      setFeedback(null);
      setNextQuestionTimer(0);
    } else {
      setShowSummary(true);
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
    if(!test){
      if (questionTimer > 0 && answerFeedback === null) {
        const countdown = setTimeout(() => setQuestionTimer(questionTimer - 1), 1000);
        return () => clearTimeout(countdown);
      }
      if (questionTimer === 0 && answerFeedback === null) {
        handleNoAnswer();
      }
    }
  }, [questionTimer, answerFeedback]);

  // State to countdown next question timer
  useEffect(() => {
    if(!test){
      if (answerFeedback && nextQuestionTimer > 0) {
        const countdown = setTimeout(() => setNextQuestionTimer(nextQuestionTimer - 1), 1000);
        return () => clearTimeout(countdown);
      }
      if (nextQuestionTimer === 0 && answerFeedback !== null) {
        goToNextQuestion();
      }
    }
  }, [nextQuestionTimer, answerFeedback]);

  useEffect(() => {
    setOpenInstructionDialog(true);
  }, []);


  const colors = ['#7f0000', '#002984', '#827717', '#1b5e20']; // Dark Red, Dark Blue, Dark Yellow, Dark Green

  return (
    <Container sx={{padding: 0 , margin: 0 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold",  color: theme.palette.primary.light }}
      >
        Quiz Time!
      </Typography>
      {!showSummary ? (
        <Grid container justifyContent="center" alignItems="center" textAlign='center' spacing={1}>
          {/* Title */}
          <Grid item  xs={12} sm={12} md={12} lg={12}>
            <Typography  variant="h4" >
              {questions[currentQuestionIndex].questionText}
            </Typography>
          </Grid>
          {/* Time Countdown for question */}
          <Grid item  xs={12} sm={12} md={12} lg={12}>
            <Typography variant="h7" >
              Time left: {questionTimer} seconds
            </Typography>
          </Grid>
          {/* Time Countdown interval to next question*/}
          {answerFeedback && (
            <Grid item  xs={12} sm={12} md={12} lg={12}>
              <Typography
                variant="h6"
                sx={{  color: answerFeedback === 'correct' ? 'green' : 'red' }}
              >
                {answerFeedback === 'correct' ? 'Correct!' : 'Wrong!'}
              </Typography>
              {nextQuestionTimer > 0 && (
                <Typography
                  variant="caption"
                >
                  Next question in: {nextQuestionTimer} seconds
                </Typography>
              )}
            </Grid>
            ) 
          }

          {/* Answer Selection */}
          <Grid item container spacing={1} >
            {questions[currentQuestionIndex].options.map((option, index) => (
              <Grid item xs={12} sm={12} md={6} lg={6} key={option.id}>
                <Button
                  variant="contained"
                  onClick={() => handleOptionClick(option, questions[currentQuestionIndex].id)}
                  disabled={answerFeedback !== null}
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
          {/* Next and Previous button */}
          {test && (
            <Grid item container justifyContent="space-between" alignItems="center" direction="row" >
              <Grid item  sx={{flexGrow: 0, display: 'flex',alignItems: 'center'}}>
                {currentQuestionIndex > 0 && (
                    <Button
                    variant="contained"
                    onClick={handlePreviousQuestion}
                  >
                    previous
                  </Button>
                )}
              </Grid>
              <Grid item  sx={{flexGrow: 0, display: 'flex',alignItems: 'center'}}>
                {currentQuestionIndex < questions.length - 1 && (
                      <Button
                      variant="contained"
                      onClick={goToNextQuestion}
                      sx={{flexGrow: 0, display: 'flex',}}
                    >
                    Next
                  </Button>
                )}
              </Grid>
            </Grid>
            ) 
          }
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
          {questions.map((question) => (
            <Box key={question.id} sx={{ mb: 4 }}>
              <Typography sx={{ fontSize: '1.25rem', mb: 1,textAlign: 'left', }}>
                {question.questionText}
              </Typography>
              <RadioGroup>
                {question.options.map((option) => {
                  const isUserSelection = question.selectedOption === option.id;
                  const isCorrect = option.isCorrect;
                  return (
                    <FormControlLabel
                      key={option.id}
                      value={option.optionText}
                      control={<Radio checked={isUserSelection} />}
                      label={
                        <span
                          style={{
                            color: isCorrect ? 'green' : isUserSelection ? 'red' : 'black',
                            fontWeight: isUserSelection ? 'bold' : 'normal'
                          }}
                        >
                          {option.optionText}
                          {isUserSelection && !isCorrect && ' (Your Choice)'}
                          {isCorrect && ' (Correct)'}
                        </span>
                      }
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          color: isUserSelection
                            ? isCorrect
                              ? 'green'
                              : 'red'
                            : isCorrect
                            ? 'green'
                            : 'black'
                        }
                      }}
                    />
                  );
                })}
              </RadioGroup>
            </Box>
          ))}
        </Box>
      )}
      <Dialog
        fullScreen={fullScreen}
        open={openInstructionDialog}
        onClose={handleCloseInstructionDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Quiz Game: How To Play?"}
        </DialogTitle>
        <DialogContent>
        <DialogContentText>
          1. The objective of the quiz is to answer all the questions correctly.
          <br />
          2. Each question will have 4 possible answers. You need to select the correct one.
          <br />
          3. You have a total of 10 seconds to answer each question.
          <br />
          4. If the timer runs out before you answer, the question will be marked as incorrect.
          <br />
          5. There will be a 5-second interval between each question to prepare for the next one.
          <br />
          6. Keep answering until all questions are completed! Good luck!
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