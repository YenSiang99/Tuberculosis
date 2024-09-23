import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "../../components/axios";

const WordSearchPage = () => {
  const [wordsToFind, setWordsToFind] = useState([]);
  const gridSize = 15;

  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);

  const totalTime = 10;
  const [gameTimer, setGameTimer] = useState(totalTime);
  const [showResult, setShowResult] = useState(false);

  const [openInstructionDialog, setOpenInstructionDialog] = useState(true);

  const submitScore = async () => {
    const storedUserData = JSON.parse(sessionStorage.getItem("userData"));

    if (!storedUserData) return; // Only submit score if user is logged in

    try {
      const payload = {
        totalTimeTaken: totalTime - gameTimer,
        accuracyRate: calculateAccuracyRate(),
        longestWordFound: getLongestWordFound(),
        score: foundWords.length,
        completionStatus:
          foundWords.length === wordsToFind.length ? "Completed" : "Incomplete",
      };

      const response = await axios.post("/score/wordsearch/submit", payload);

      console.log("Score submitted successfully", response.data);
    } catch (error) {
      console.error("Failed to submit score", error);
    }
  };

  const generateEmptyGrid = (size) => {
    const emptyGrid = [];
    for (let i = 0; i < size; i++) {
      const row = Array(size).fill("");
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
        if (newGrid[i][j] === "") {
          newGrid[i][j] = String.fromCharCode(
            65 + Math.floor(Math.random() * 26)
          );
        }
      }
    }

    return newGrid;
  };

  const canPlaceWord = (grid, word, startX, startY, direction) => {
    if (direction === 0 && startY + word.length > gridSize) return false;
    if (direction === 1 && startX + word.length > gridSize) return false;
    if (
      direction === 2 &&
      (startX + word.length > gridSize || startY + word.length > gridSize)
    )
      return false;

    for (let i = 0; i < word.length; i++) {
      let x = startX;
      let y = startY;
      if (direction === 0) y += i;
      if (direction === 1) x += i;
      if (direction === 2) {
        x += i;
        y += i;
      }
      if (grid[x][y] !== "" && grid[x][y] !== word[i]) return false;
    }

    return true;
  };

  const handleHorizontalCheck = (newSelectedCells, x, y) => {
    let wordFound = false;

    const rowCells = newSelectedCells
      .filter((cell) => cell.x === x)
      .sort((a, b) => a.y - b.y);

    if (rowCells.length > 0) {
      for (let start = 0; start < rowCells.length; start++) {
        let formedWord = "";
        let wordCells = [];

        for (let end = start; end < rowCells.length; end++) {
          if (end > start && rowCells[end].y !== rowCells[end - 1].y + 1) {
            break;
          }

          formedWord += rowCells[end].letter;
          wordCells.push(rowCells[end]);

          if (wordsToFind.includes(formedWord)) {
            setFoundWords((prevFoundWords) => {
              const updatedFoundWords = [
                ...prevFoundWords,
                { word: formedWord, cells: wordCells },
              ];

              // Remove the cells that formed the word from selectedCells
              const updatedSelectedCells = newSelectedCells.filter(
                (cell) =>
                  !updatedFoundWords.some((foundWord) =>
                    foundWord.cells.some(
                      (foundCell) =>
                        foundCell.x === cell.x && foundCell.y === cell.y
                    )
                  )
              );
              setSelectedCells(updatedSelectedCells);

              return updatedFoundWords;
            });
            wordFound = true;
            break;
          }
        }

        if (wordFound) break;
      }
    }

    return wordFound;
  };

  const handleVerticalCheck = (newSelectedCells, x, y) => {
    let wordFound = false;

    const colCells = newSelectedCells
      .filter((cell) => cell.y === y)
      .sort((a, b) => a.x - b.x); // Sort by x coordinate to ensure vertical alignment

    if (colCells.length > 0) {
      for (let start = 0; start < colCells.length; start++) {
        let formedWord = "";
        let wordCells = [];

        for (let end = start; end < colCells.length; end++) {
          if (end > start && colCells[end].x !== colCells[end - 1].x + 1) {
            break;
          }

          formedWord += colCells[end].letter;
          wordCells.push(colCells[end]);

          if (wordsToFind.includes(formedWord)) {
            setFoundWords((prevFoundWords) => {
              const updatedFoundWords = [
                ...prevFoundWords,
                { word: formedWord, cells: wordCells },
              ];

              // Remove the cells that formed the word from selectedCells
              const updatedSelectedCells = newSelectedCells.filter(
                (cell) =>
                  !updatedFoundWords.some((foundWord) =>
                    foundWord.cells.some(
                      (foundCell) =>
                        foundCell.x === cell.x && foundCell.y === cell.y
                    )
                  )
              );
              setSelectedCells(updatedSelectedCells);

              return updatedFoundWords;
            });
            wordFound = true;
            break;
          }
        }

        if (wordFound) break;
      }
    }

    return wordFound;
  };

  const handleDiagonalTLBRCheck = (newSelectedCells, x, y) => {
    let wordFound = false;

    const diagonalCells = newSelectedCells
      .filter((cell) => cell.x - cell.y === x - y) // Ensure the diagonal alignment
      .sort((a, b) => a.x - b.x); // Sort by x (and by y implicitly) to ensure the top-left to bottom-right direction

    if (diagonalCells.length > 0) {
      for (let start = 0; start < diagonalCells.length; start++) {
        let formedWord = "";
        let wordCells = [];

        for (let end = start; end < diagonalCells.length; end++) {
          if (
            end > start &&
            (diagonalCells[end].x !== diagonalCells[end - 1].x + 1 ||
              diagonalCells[end].y !== diagonalCells[end - 1].y + 1)
          ) {
            break;
          }

          formedWord += diagonalCells[end].letter;
          wordCells.push(diagonalCells[end]);

          if (wordsToFind.includes(formedWord)) {
            setFoundWords((prevFoundWords) => {
              const updatedFoundWords = [
                ...prevFoundWords,
                { word: formedWord, cells: wordCells },
              ];

              // Remove the cells that formed the word from selectedCells
              const updatedSelectedCells = newSelectedCells.filter(
                (cell) =>
                  !updatedFoundWords.some((foundWord) =>
                    foundWord.cells.some(
                      (foundCell) =>
                        foundCell.x === cell.x && foundCell.y === cell.y
                    )
                  )
              );
              setSelectedCells(updatedSelectedCells);

              return updatedFoundWords;
            });
            wordFound = true;
            break;
          }
        }

        if (wordFound) break;
      }
    }

    return wordFound;
  };

  const handleCellClick = (letter, x, y) => {
    const existingIndex = selectedCells.findIndex(
      (cell) => cell.x === x && cell.y === y
    );

    if (existingIndex !== -1) {
      // Deselect the cell
      const newSelectedCells = [...selectedCells];
      newSelectedCells.splice(existingIndex, 1);
      setSelectedCells(newSelectedCells);
    } else {
      // Add the cell to the selection
      const newSelectedCells = [...selectedCells, { letter, x, y }];
      setSelectedCells(newSelectedCells);

      // Check for horizontal, vertical, and diagonal words
      let wordFound =
        handleHorizontalCheck(newSelectedCells, x, y) ||
        handleVerticalCheck(newSelectedCells, x, y) ||
        handleDiagonalTLBRCheck(newSelectedCells, x, y);
    }
  };

  const isCellSelected = (x, y) => {
    return selectedCells.some((cell) => cell.x === x && cell.y === y);
  };

  const isCellPartOfFoundWord = (x, y) => {
    return foundWords.some((foundWord) =>
      foundWord.cells.some((cell) => cell.x === x && cell.y === y)
    );
  };

  const handleCloseInstructionDialog = () => {
    setOpenInstructionDialog(false);
  };

  const calculateAccuracyRate = () => {
    return (foundWords.length / wordsToFind.length) * 100;
  };

  const getLongestWordFound = () => {
    return foundWords.reduce(
      (longest, current) =>
        current.word.length > longest.length ? current.word : longest,
      ""
    );
  };

  const handleShowResults = () => {
    setShowResult(true);
  };

  // countdown timer
  useEffect(() => {
    if (!openInstructionDialog) {
      if (gameTimer > 0) {
        if (foundWords.length === wordsToFind.length) {
          handleShowResults();
          submitScore(); // Submit score when user finds all words
        } else {
          const countdown = setTimeout(() => setGameTimer(gameTimer - 1), 1000);
          return () => clearTimeout(countdown);
        }
      }
      if (gameTimer === 0) {
        handleShowResults();
        submitScore(); // Submit score when timer runs out
      }
    }
  }, [gameTimer, openInstructionDialog, foundWords]);

  // fetch word list
  useEffect(() => {
    const fetchActiveWordList = async () => {
      try {
        const response = await axios.get("/wordLists/active");
        const data = response.data;
        if (data && data.words) {
          setWordsToFind(data.words); // Set the fetched words in the state
          const emptyGrid = generateEmptyGrid(gridSize);
          const gridWithWords = placeWordsInGrid(emptyGrid, data.words); // Use the fetched words
          setGrid(gridWithWords); // Set the grid with the words
        }
      } catch (error) {
        console.error("Failed to fetch word list", error);
      }
    };

    fetchActiveWordList();
  }, [gridSize]);

  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Box sx={{ my: 2 }}>
        <Typography variant="h4">Find the TB-related Words!</Typography>
      </Box>
      <Grid container direction="row">
        {showResult ? (
          // Show the results if the timer is zero
          <>
            {/* Summary title */}
            <Grid
              item
              xs={12}
              sx={{
                textAlign: "center",
              }}
            >
              <Typography variant="h4">Game Summary</Typography>
            </Grid>
            <Grid
              item
              container
              sx={{
                textAlign: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Grid
                container
                item
                xs={12}
                sm={8}
                md={6}
                sx={{
                  justifyContent: "center",
                  width: "100%",
                  textAlign: "left",
                }}
                spacing={2}
              >
                <Grid item xs={6}>
                  <Typography variant="h6">Total Time Taken</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">
                    : {totalTime - gameTimer} seconds
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">Accuracy Rate</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">
                    : {calculateAccuracyRate().toFixed(2)}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">Longest Word Found</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">
                    : {getLongestWordFound()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">Score</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">
                    : {foundWords.length} / {wordsToFind.length}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">Completion Status</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">
                    :{" "}
                    {foundWords.length === wordsToFind.length
                      ? "All words found! Well done!"
                      : "Some words are still missing. Try again!"}
                  </Typography>
                </Grid>
              </Grid>
              {/* Reset game button */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedCells([]);
                    setFoundWords([]);
                    const gridWithWords = placeWordsInGrid(
                      generateEmptyGrid(gridSize),
                      wordsToFind
                    );
                    setGrid(gridWithWords);
                    setGameTimer(totalTime); // Reset the timer
                    setShowResult(false); // Go back to the game
                  }}
                >
                  Play Again
                </Button>
              </Grid>
            </Grid>
          </>
        ) : (
          // Show the game grid if results are not being shown
          <>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography variant="h6">
                Time left: {gameTimer} seconds
              </Typography>
            </Grid>
            {/* Words to find list big screen */}
            <Grid
              item
              sm={12}
              md={3}
              sx={{ display: { xs: "none", md: "inline" } }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }}
              >
                Words to Find:
              </Typography>
              <ul style={{ paddingLeft: "1rem", fontSize: "inherit" }}>
                {wordsToFind.map((word, index) => (
                  <li
                    key={index}
                    style={{
                      textDecoration: foundWords.some(
                        (foundWord) => foundWord.word === word
                      )
                        ? "line-through"
                        : "none",
                      color: foundWords.some(
                        (foundWord) => foundWord.word === word
                      )
                        ? "green"
                        : "inherit",
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
                  const gridWithWords = placeWordsInGrid(
                    generateEmptyGrid(gridSize),
                    wordsToFind
                  );
                  setGrid(gridWithWords);
                }}
              >
                Reset Game
              </Button>
            </Grid>
            {/* Words to find list, small screen */}
            <Grid
              item
              container
              direction="row"
              columnSpacing={{ xs: 1 }}
              xs={12}
              sx={{
                display: {
                  md: "none",
                  justifyContent: "space-evenly",
                },
              }}
            >
              {wordsToFind.map((word, index) => (
                <Grid
                  item
                  key={index}
                  sx={{
                    textDecoration: foundWords.some(
                      (foundWord) => foundWord.word === word
                    )
                      ? "line-through"
                      : "none",
                    color: foundWords.some(
                      (foundWord) => foundWord.word === word
                    )
                      ? "green"
                      : "inherit",
                  }}
                >
                  {word}
                </Grid>
              ))}
            </Grid>
            {/* Game grid */}
            <Grid item sm={12} md={9} sx={{ width: "100%" }}>
              {grid.map((row, rowIndex) => (
                <Grid
                  container
                  item
                  xs={12}
                  justifyContent="center"
                  wrap="nowrap"
                  sx={{ minWidth: "275px", width: "100%" }}
                >
                  {row.map((letter, colIndex) => (
                    <Grid
                      key={colIndex}
                      item
                      sx={{
                        width: "100%",
                        border: "1px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        backgroundColor: isCellPartOfFoundWord(
                          rowIndex,
                          colIndex
                        )
                          ? "#a3d2ca" // Green when word is found
                          : isCellSelected(rowIndex, colIndex)
                          ? "red"
                          : "white",
                      }}
                      onClick={() =>
                        handleCellClick(letter, rowIndex, colIndex)
                      }
                    >
                      <Typography variant="h6">{letter}</Typography>
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Grid>

      <Dialog
        // fullScreen={fullScreen}
        open={openInstructionDialog}
        onClose={handleCloseInstructionDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Word Search: How To Play?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            1. <strong>Objective:</strong> <br />
            Find all the hidden words in the grid to complete the game.
            <br />
            <br />
            2. <strong>Word Directions:</strong> <br />
            Words may be hidden horizontally, vertically, or diagonally.
            <br />
            <br />
            3. <strong>Select Letters:</strong> <br />
            Click or tap on the letters in the grid to select them as part of a
            word.
            <br />
            <br />
            4. <strong>Deselect Letters:</strong> <br />
            If you change your mind, click or tap the letter again to deselect
            it.
            <br />
            <br />
            5. <strong>Finding Words:</strong> <br />
            Once you've correctly selected a word, the letters will turn green,
            and the word will be crossed out in the list.
            <br />
            <br />
            6. <strong>Complete the Challenge:</strong> <br />
            The game will end after you find all of the words or the timer ends.
            Good luck!
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
