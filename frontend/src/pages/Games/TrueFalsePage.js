import React, { useState } from 'react';
import { Box, Typography, Button, FormControlLabel, RadioGroup, Radio, FormGroup } from '@mui/material';

const TrueFalsePage = () => {
  // Temporary hardcoded data for true/false questions
  const questions = [
    { id: 1, statement: "TB can only affect the lungs.", answer: "false" },
    { id: 2, statement: "The Mantoux test is used to detect TB infection.", answer: "true" },
    { id: 3, statement: "TB is highly contagious and can be spread by touching.", answer: "false" }
  ];

  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);

  const handleChange = (id, event) => {
    setAnswers({
      ...answers,
      [id]: event.target.value
    });
  };

  const handleSubmit = () => {
    const newResults = questions.map(question => ({
      id: question.id,
      correct: answers[question.id] === question.answer
    }));
    setResults(newResults);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>True/False Questions</Typography>
      <FormGroup>
        {questions.map((question) => (
          <Box key={question.id} sx={{ mb: 2 }}>
            <Typography variant="body1">{question.statement}</Typography>
            <RadioGroup
              row
              name={`question-${question.id}`}
              value={answers[question.id] || ''}
              onChange={(e) => handleChange(question.id, e)}
            >
              <FormControlLabel value="true" control={<Radio />} label="True" />
              <FormControlLabel value="false" control={<Radio />} label="False" />
            </RadioGroup>
            {results.find(result => result.id === question.id) !== undefined && (
              <Typography variant="body2" color={results.find(result => result.id === question.id).correct ? 'green' : 'red'}>
                {results.find(result => result.id === question.id).correct ? "Correct!" : "Incorrect!"}
              </Typography>
            )}
          </Box>
        ))}
      </FormGroup>
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Check Answers
      </Button>
    </Box>
  );
};

export default TrueFalsePage;
