import React from 'react';
import { Grid, TextField, Typography, Box } from '@mui/material';

const FillInTheBlanks = () => {
  const questions = [
    {
      id: 1,
      beforeBlank: 'TB is typically spread through',
      afterBlank: 'from an infected person',
      answer: '',
    },
    // Add more questions as needed
  ];

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={3} >
        {questions.map((item, index) => (
          <Grid item xs={12} key={item.id}>
            <Grid container alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h6" display="inline">
                  {index + 1}. {item.beforeBlank}{' '}
                </Typography>
                <TextField
                  variant="outlined"
                  value={item.answer}
                  onChange={(e) => console.log(e.target.value)} // Handle input change as needed
                  sx={{ width: '150px', verticalAlign: 'middle' }}
                />
                <Typography variant="h6" display="inline">
                  {' '}
                  {item.afterBlank}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FillInTheBlanks;
