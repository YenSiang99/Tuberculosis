import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Button , 
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText ,
  DialogTitle ,
  useMediaQuery 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const WordSearchPage = () => {
  const wordsToFind = ['TUBERCULOSIS', 'BACTERIA', 'LUNGS', 'SYMPTOMS', 'COUGH', 'FEVER', 'NIGHT SWEATS', 'FATIGUE', 'DIAGNOSIS', 'TREATMENT'];
  const gridSize = 15;

  const theme = useTheme();

  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);


  const [open, setOpenInstructionDialog] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const generateEmptyGrid = (size) => {
    const emptyGrid = [];
    for (let i = 0; i < size; i++) {
      const row = Array(size).fill('');
      emptyGrid.push(row);
    }
    return emptyGrid;
  };

  const placeWordsInGrid = (grid, words) => {
    const newGrid = [...grid];
  
    words.forEach((word) => {
      let placed = false;
  
      while (!placed) {
        const direction = Math.floor(Math.random() * 3); // 0: horizontal, 1: vertical, 2: diagonal
        const startX = Math.floor(Math.random() * gridSize);
        const startY = Math.floor(Math.random() * gridSize);
  
        if (canPlaceWord(newGrid, word, startX, startY, direction)) {
          for (let i = 0; i < word.length; i++) {
            switch (direction) {
              case 0:
                newGrid[startX][startY + i] = word[i];
                break;
              case 1:
                newGrid[startX + i][startY] = word[i];
                break;
              case 2:
                newGrid[startX + i][startY + i] = word[i];
                break;
              default:
                break;
            }
          }
          placed = true;
        }
      }
    });
  
    // Fill any remaining empty cells with random letters
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }
  
    return newGrid;
  };
  

  const canPlaceWord = (grid, word, startX, startY, direction) => {
    if (direction === 0 && startY + word.length > gridSize) return false;
    if (direction === 1 && startX + word.length > gridSize) return false;
    if (direction === 2 && (startX + word.length > gridSize || startY + word.length > gridSize)) return false;

    for (let i = 0; i < word.length; i++) {
      let x = startX;
      let y = startY;
      if (direction === 0) y += i;
      if (direction === 1) x += i;
      if (direction === 2) {
        x += i;
        y += i;
      }
      if (grid[x][y] !== '' && grid[x][y] !== word[i]) return false;
    }

    return true;
  };

  const handleCellClick = (letter, x, y) => {
    const existingIndex = selectedCells.findIndex(cell => cell.x === x && cell.y === y);
  
    if (existingIndex !== -1) {
      // Deselect the cell
      const newSelectedCells = [...selectedCells];
      newSelectedCells.splice(existingIndex, 1);
      setSelectedCells(newSelectedCells);
    } else {
      // Add the cell to the selection
      const newSelectedCells = [...selectedCells, { letter, x, y }];
      setSelectedCells(newSelectedCells);
  
      let wordFound = false;
  
      // Check for horizontal words
      for (let i = 0; i < gridSize; i++) {
        const rowLetters = newSelectedCells.filter(cell => cell.x === i).sort((a, b) => a.y - b.y).map(cell => cell.letter).join('');
        const foundWord = wordsToFind.find(word => word === rowLetters);
        if (foundWord) {
          const wordCells = newSelectedCells.filter(cell => cell.x === i);
          setFoundWords([...foundWords, { word: foundWord, cells: wordCells }]);
          wordFound = true;
          break;
        }
      }
  
      // Check for vertical words
      if (!wordFound) {
        for (let j = 0; j < gridSize; j++) {
          const colLetters = newSelectedCells.filter(cell => cell.y === j).sort((a, b) => a.x - b.x).map(cell => cell.letter).join('');
          const foundWord = wordsToFind.find(word => word === colLetters);
          if (foundWord) {
            const wordCells = newSelectedCells.filter(cell => cell.y === j);
            setFoundWords([...foundWords, { word: foundWord, cells: wordCells }]);
            wordFound = true;
            break;
          }
        }
      }
  
      // Check for top-left to bottom-right diagonal words
      if (!wordFound) {
        for (let d = 0; d < gridSize * 2 - 1; d++) {
          const diagLetters = newSelectedCells
            .filter(cell => cell.x - cell.y === d - gridSize)
            .sort((a, b) => a.x - b.x)
            .map(cell => cell.letter)
            .join('');
          const foundWord = wordsToFind.find(word => word === diagLetters);
          if (foundWord) {
            const wordCells = newSelectedCells.filter(cell => cell.x - cell.y === d - gridSize);
            setFoundWords([...foundWords, { word: foundWord, cells: wordCells }]);
            wordFound = true;
            break;
          }
        }
      }
  
      // Check for top-right to bottom-left diagonal words
      if (!wordFound) {
        for (let d = 0; d < gridSize * 2 - 1; d++) {
          const diagLetters = newSelectedCells
            .filter(cell => cell.x + cell.y === d)
            .sort((a, b) => a.x - b.x)
            .map(cell => cell.letter)
            .join('');
          const foundWord = wordsToFind.find(word => word === diagLetters);
          if (foundWord) {
            const wordCells = newSelectedCells.filter(cell => cell.x + cell.y === d);
            setFoundWords([...foundWords, { word: foundWord, cells: wordCells }]);
            wordFound = true;
            break;
          }
        }
      }
  
      // Remove only the cells that formed the found word, keep others
      if (wordFound) {
        const remainingCells = newSelectedCells.filter(cell => !foundWords.some(foundWord => foundWord.cells.includes(cell)));
        setSelectedCells(remainingCells);
      }
    }
  };

  const isCellSelected = (x, y) => {
    return selectedCells.some(cell => cell.x === x && cell.y === y);
  };

  const isCellPartOfFoundWord = (x, y) => {
    return foundWords.some(foundWord =>
      foundWord.cells.some(cell => cell.x === x && cell.y === y)
    );
  };

  const handleCloseInstructionDialog = () => {
    setOpenInstructionDialog(false);
  };

  useEffect(() => {
    const emptyGrid = generateEmptyGrid(gridSize);
    const gridWithWords = placeWordsInGrid(emptyGrid, wordsToFind);
    setGrid(gridWithWords);
    setOpenInstructionDialog(true);
  }, []);

  return (
    <Container sx={{padding: 0 , margin: 0 }}>
      <Box sx={{ my: 2}}>
        <Typography variant="h4"  >
          Find the TB-related Words!
        </Typography>
      </Box>
      <Grid container>
        <Grid item sm={12} md={3} sx={{display: { xs: 'none', md: 'inline' }}}  >
          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>Words to Find:</Typography>
          <ul style={{  paddingLeft: '1rem', fontSize: 'inherit' }}>
            {wordsToFind.map((word, index) => (
              <li
                  key={index}
                  style={{
                  textDecoration: foundWords.some(foundWord => foundWord.word === word) ? 'line-through' : 'none',
                  color: foundWords.some(foundWord => foundWord.word === word) ? 'green' : 'inherit',
                  }}
              >
                  {word}
              </li>
            ))}
          </ul>
          <Button
            variant="contained"
            onClick={() => {
              setSelectedCells([]);
              setFoundWords([]);
              const gridWithWords = placeWordsInGrid(generateEmptyGrid(gridSize), wordsToFind);
              setGrid(gridWithWords);
            }}
          >
            Reset Game
          </Button>
        </Grid>
        <Grid item xs={12} sx={{display: { xs: 'inline', md: 'none' }} }  >
          <Grid 
            container
            direction="row"
            columnSpacing = {{xs : 1 }}
            sx={{justifyContent: "space-evenly"}}  
          >
            {wordsToFind.map((word, index) => (
              <Grid item key={index} sx= {{textDecoration: foundWords.some(foundWord => foundWord.word === word) ? 'line-through' : 'none',color: foundWords.some(foundWord => foundWord.word === word) ? 'green' : 'inherit',}}>
                {word}
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item sm={12} md={9}  sx={{ width : '100%'}} >
          {grid.map((row, rowIndex) => (
            <Grid container item xs={12} justifyContent="center" wrap="nowrap" sx={{  minWidth : '275px',  width : '100%' }}>
              {row.map((letter, colIndex) => (
                <Grid
                key={colIndex}
                item
                sx={{
                  width : '100%',
                  border: '1px solid #ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundColor: isCellPartOfFoundWord(rowIndex, colIndex)
                    ? '#a3d2ca' // Green when word is found
                    : (isCellSelected(rowIndex, colIndex) 
                      ? 'red' 
                      : 'white'),
                }}
                onClick={() => handleCellClick(letter, rowIndex, colIndex)}
              >
                <Typography variant="h6">{letter}</Typography>
              </Grid>
                ))
              }
          </Grid>
          ))}
        </Grid>
     
        
       
      </Grid>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleCloseInstructionDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Word Search: How To Play?"}
        </DialogTitle>
        <DialogContent>
        <DialogContentText>
          1. The objective of the game is to find all the hidden words in the grid.
          <br />
          2. Words can be hidden horizontally, vertically, or diagonally.
          <br />
          3. Click or tap letters in the grid to select them.
          <br />
          4. You can deselect a letter by clicking or tapping on it again.
          <br />
          5. When you correctly find a word, the selected letters will turn green, and the word will be crossed out in the word list.
          <br />
          6. Keep searching until all words are found! Good luck!
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

export default WordSearchPage;
