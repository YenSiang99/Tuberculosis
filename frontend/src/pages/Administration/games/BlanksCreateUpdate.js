import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import axios from "../../../components/axios"; // Adjust with your axios instance

export default function CreateUpdateFillBlank() {
  const { id } = useParams(); // Check if we're editing an existing fillBlank
  const navigate = useNavigate();

  const [fillBlank, setFillBlank] = useState({
    name: "",
    description: "",
    questions: [],
    active: false,
  });

  const [newQuestion, setNewQuestion] = useState({
    textBefore: "",
    textAfter: "",
    answer: "",
  });

  useEffect(() => {
    if (id) {
      // Fetch the fillBlank set for editing if an ID is provided
      axios
        .get(`/fillBlanks/${id}`)
        .then((response) => {
          setFillBlank(response.data);
        })
        .catch((error) => {
          console.error("Error fetching fillBlank", error);
        });
    }
  }, [id]);

  const handleAddQuestion = () => {
    if (newQuestion.textBefore && newQuestion.answer && newQuestion.textAfter) {
      setFillBlank((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }));
      setNewQuestion({
        textBefore: "",
        textAfter: "",
        answer: "",
      });
    }
  };

  const handleSubmit = () => {
    if (id) {
      // Update fillBlank
      axios
        .put(`/fillBlanks/${id}`, fillBlank)
        .then(() => {
          navigate("/admin/blanks");
        })
        .catch((error) => {
          console.error("Error updating fillBlank", error);
        });
    } else {
      // Create new fillBlank
      axios
        .post("/fillBlanks", fillBlank)
        .then(() => {
          navigate("/admin/blanks");
        })
        .catch((error) => {
          console.error("Error creating fillBlank", error);
        });
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        {id
          ? "Edit Fill in the Blanks Set"
          : "Create New Fill in the Blanks Set"}
      </Typography>

      <TextField
        label="Name"
        fullWidth
        value={fillBlank.name}
        onChange={(e) => setFillBlank({ ...fillBlank, name: e.target.value })}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Description"
        fullWidth
        value={fillBlank.description}
        onChange={(e) =>
          setFillBlank({ ...fillBlank, description: e.target.value })
        }
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Questions
      </Typography>

      {fillBlank.questions.map((question, qIdx) => (
        <Box key={qIdx} sx={{ marginBottom: 4 }}>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            {`Question ${qIdx + 1}`}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Text Before"
                fullWidth
                value={question.textBefore}
                onChange={(e) =>
                  setFillBlank((prev) => {
                    const updatedQuestions = [...prev.questions];
                    updatedQuestions[qIdx].textBefore = e.target.value;
                    return { ...prev, questions: updatedQuestions };
                  })
                }
                sx={{ marginBottom: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Answer"
                fullWidth
                value={question.answer}
                onChange={(e) =>
                  setFillBlank((prev) => {
                    const updatedQuestions = [...prev.questions];
                    updatedQuestions[qIdx].answer = e.target.value;
                    return { ...prev, questions: updatedQuestions };
                  })
                }
                sx={{ marginBottom: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Text After"
                fullWidth
                value={question.textAfter}
                onChange={(e) =>
                  setFillBlank((prev) => {
                    const updatedQuestions = [...prev.questions];
                    updatedQuestions[qIdx].textAfter = e.target.value;
                    return { ...prev, questions: updatedQuestions };
                  })
                }
                sx={{ marginBottom: 1 }}
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Add New Question
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Text Before"
            fullWidth
            value={newQuestion.textBefore}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, textBefore: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Answer"
            fullWidth
            value={newQuestion.answer}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, answer: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Text After"
            fullWidth
            value={newQuestion.textAfter}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, textAfter: e.target.value })
            }
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddQuestion}
        sx={{ marginTop: 2 }}
      >
        Add Question
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ marginTop: 2 }}
      >
        {id ? "Update Fill in the Blanks" : "Create Fill in the Blanks"}
      </Button>
    </Container>
  );
}
