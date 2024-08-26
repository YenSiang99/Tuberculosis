import React from 'react';
import { Box, Typography, Card, CardActionArea, CardContent, Grid } from '@mui/material';
import PuzzleIcon from '@mui/icons-material/Extension'; // Example icon for Word Search
import QuizIcon from '@mui/icons-material/Quiz';
import StoryIcon from '@mui/icons-material/MenuBook';
import FillIcon from '@mui/icons-material/Edit';
import TrueFalseIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';

function GamesPage({ setActiveSection }) {
  const navigate = useNavigate();

  const games = [
    { name: 'Word Search Game', description: 'Find TB-related terms hidden in a grid of letters.', icon: <PuzzleIcon />,section: 'WordSearch'},
    { name: 'Quiz', description: 'Answer questions to test your understanding of TB.', icon: <QuizIcon /> ,section: 'QuizPage'},
    { name: 'Interactive Story', description: 'Make choices in a story scenario about TB and see different outcomes.', icon: <StoryIcon />,section: 'InteractiveStory'},
    { name: 'Fill in the Blanks', description: 'Fill in missing words in sentences related to TB facts.', icon: <FillIcon />,section: 'FillBlanks'  },
    { name: 'True or False', description: 'Decide if statements about TB are true or false.', icon: <TrueFalseIcon />,section: 'TrueFalse'}
  ];

  const cardStyle = {
    height: 150, // Fixed height for uniformity
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f0e3', // Pastel background color
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Games to Learn About Tuberculosis
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Select a game to play!
      </Typography>
      <Grid container spacing={2}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} md={4} key={game.name}>
            <Card sx={cardStyle}>
              <CardActionArea onClick={() => setActiveSection(game.section)}>
                <CardContent>
                  {game.icon}
                  <Typography variant="h6" component="div">
                    {game.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {game.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default GamesPage;
