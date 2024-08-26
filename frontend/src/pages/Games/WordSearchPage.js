import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';

const WordSearchPage = () => {
  const wordsToFind = ['TUBERCULOSIS', 'BACTERIA', 'LUNGS', 'SYMPTOMS', 'COUGH', 'FEVER', 'NIGHT SWEATS', 'FATIGUE', 'DIAGNOSIS', 'TREATMENT'];
  const gridSize = 15;

  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);

  useEffect(() => {
    const emptyGrid = generateEmptyGrid(gridSize);
    const gridWithWords = placeWordsInGrid(emptyGrid, wordsToFind);
    setGrid(gridWithWords);
  }, []);

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

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Find the TB-related Words!
      </Typography>
      <Grid container spacing={1} justifyContent="center">
        {grid.map((row, rowIndex) => (
          <Grid key={rowIndex} container item xs={12} justifyContent="center">
            {row.map((letter, colIndex) => (
              <Grid
              key={colIndex}
              item
              sx={{
                width: 40,
                height: 40,
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
            ))}
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Words to Find:</Typography>
        <ul>
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
        </Box>
      <Button
        variant="contained"
        sx={{ mt: 4 }}
        onClick={() => {
          setSelectedCells([]);
          setFoundWords([]);
          const gridWithWords = placeWordsInGrid(generateEmptyGrid(gridSize), wordsToFind);
          setGrid(gridWithWords);
        }}
      >
        Reset Game
      </Button>
    </Box>
  );
};

export default WordSearchPage;
