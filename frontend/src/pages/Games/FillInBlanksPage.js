import React, { useState } from 'react';
import { Container, Typography, Grid, Button, Box, TextField } from '@mui/material';

const FillInBlanksPage = () => {
  const initialQuestions = [
    { id: 1, text: 'Tuberculosis (TB) is caused by the bacterium ____.', blank: '' },
    { id: 2, text: 'The primary organ affected by tuberculosis is the ____.', blank: '' },
    { id: 3, text: 'TB is typically spread through ____ from an infected person.', blank: '' },
    { id: 4, text: 'A common symptom of TB is a persistent ____ lasting more than three weeks.', blank: '' },
    { id: 5, text: 'The test used to diagnose TB is called the ____ test.', blank: '' },
  ];
  const wordChoices = [
    'Mycobacterium tuberculosis',
    'lungs',
    'airborne droplets',
    'cough',
    'Mantoux',
  ];
  

  const [questions, setQuestions] = useState(initialQuestions);
  const [selectedBlankId, setSelectedBlankId] = useState(1);
  const [usedWords, setUsedWords] = useState([]);

  const handleWordSelect = (word) => {
    if (!usedWords.includes(word)) {
      const updatedQuestions = questions.map((q) =>
        q.id === selectedBlankId ? { ...q, blank: word } : q
      );
      setQuestions(updatedQuestions);
      setUsedWords([...usedWords, word]);

      const nextEmptyField = updatedQuestions.find((q) => q.blank === '');
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
    const wordToRemove = questions.find((q) => q.id === id).blank;
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, blank: '' } : q
    );
    setQuestions(updatedQuestions);
    setUsedWords(usedWords.filter((word) => word !== wordToRemove));
    setSelectedBlankId(id);
  };

  return (
    <Container sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Fill in the blanks!
      </Typography>

      <Box mb={2}>
        <Typography variant="subtitle1">Choose a word:</Typography>
        <Grid container spacing={1} sx={{justifyContent:'center'}}>
          {wordChoices.map((word, index) => (
            <Grid item key={index} xs={6} md={3}>
              <Button
                variant="outlined"
                onClick={() => handleWordSelect(word)}
                disabled={usedWords.includes(word)}
                fullWidth
                sx={{height:'100%'}}
              >
                {word}
              </Button>
            </Grid>
           
          ))}
        </Grid>
      </Box>
      <Grid container spacing={2}>
        {questions.map((question,index) => (
          <Grid item container  sx={{alignItems:'center'}} key={question.id}   >
            <Grid item xs={12}>
              <Typography variant="body1"  display="inline">
                {index+1 + ") " +  question.text.split('____')[0]}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                value={question.blank}
                onClick={() =>
                  question.blank
                    ? handleBlankRemove(question.id)
                    : handleBlankSelect(question.id)
                }
                InputProps={{
                  readOnly: true,
                }}
                sx={{ width: '150px', verticalAlign: 'middle' }}
              />
              <Typography variant="body1" display="inline" >
                {question.text.split('____')[1]}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FillInBlanksPage;
