import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "../../../components/axios"; // replace with your axios instance

export default function CreateUpdateWordSearchList() {
  const { id } = useParams(); // Check if we're editing an existing list
  const navigate = useNavigate();

  const [wordList, setWordList] = useState({
    name: "",
    description: "",
    words: [],
  });
  const [newWord, setNewWord] = useState(""); // For adding new words

  useEffect(() => {
    if (id) {
      // Fetch the word list for editing if an ID is provided
      axios
        .get(`/wordLists/${id}`)
        .then((response) => {
          setWordList(response.data);
        })
        .catch((error) => {
          console.error("Error fetching word list", error);
        });
    }
  }, [id]);

  const handleAddWord = () => {
    if (newWord) {
      setWordList((prev) => ({
        ...prev,
        words: [...prev.words, newWord.toUpperCase()],
      }));
      setNewWord(""); // Clear input after adding
    }
  };

  const handleRemoveWord = (wordToRemove) => {
    setWordList((prev) => ({
      ...prev,
      words: prev.words.filter((word) => word !== wordToRemove),
    }));
  };

  const handleSubmit = () => {
    if (id) {
      // Update word list
      axios
        .put(`/wordLists/${id}`, wordList)
        .then(() => {
          navigate("/wordsearchmenu");
        })
        .catch((error) => {
          console.error("Error updating word list", error);
        });
    } else {
      // Create new word list
      axios
        .post("/wordLists", wordList)
        .then(() => {
          navigate("/wordsearchmenu");
        })
        .catch((error) => {
          console.error("Error creating word list", error);
        });
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        {id ? "Edit Word List" : "Create New Word List"}
      </Typography>

      <TextField
        label="Name"
        fullWidth
        value={wordList.name}
        onChange={(e) => setWordList({ ...wordList, name: e.target.value })}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Description"
        fullWidth
        value={wordList.description}
        onChange={(e) =>
          setWordList({ ...wordList, description: e.target.value })
        }
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Words
      </Typography>

      <Box sx={{ display: "flex", marginBottom: 2 }}>
        <TextField
          label="New Word"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" onClick={handleAddWord}>
          Add Word
        </Button>
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        {wordList.words.map((word, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 1,
            }}
          >
            <Typography>{word}</Typography>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleRemoveWord(word)}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ marginTop: 2 }}
      >
        {id ? "Update Word List" : "Create Word List"}
      </Button>
    </Container>
  );
}
