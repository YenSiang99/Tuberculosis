import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
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
    // if (newQuestion.textBefore && newQuestion.answer && newQuestion.textAfter) {
    setFillBlank((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    setNewQuestion({
      textBefore: "",
      textAfter: "",
      answer: "",
    });
    // }
  };

  const handleDeleteQuestion = (index) => {
    setFillBlank((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions.splice(index, 1);
      return { ...prev, questions: updatedQuestions };
    });
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

      <FormControlLabel
        control={
          <Switch
            checked={fillBlank.active}
            onChange={(e) =>
              setFillBlank({ ...fillBlank, active: e.target.checked })
            }
            name="active"
            color="primary"
          />
        }
        label="Active"
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Questions
      </Typography>

      <Grid container spacing={2}>
        {fillBlank.questions.map((question, qIdx) => (
          <Grid item container key={qIdx} rowSpacing={{ xs: 1 }}>
            <Grid item container spacing={2}>
              <Grid item>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  {`Question ${qIdx + 1}`}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDeleteQuestion(qIdx)}
                >
                  Delete Question
                </Button>
              </Grid>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Text Before"
                  fullWidth
                  value={question.textBefore}
                  onChange={(e) =>
                    setFillBlank((prev) => {
                      const updatedQuestions = [...prev.questions];
                      updatedQuestions[qIdx] = {
                        ...updatedQuestions[qIdx],
                        textBefore: e.target.value,
                      };
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
                      updatedQuestions[qIdx] = {
                        ...updatedQuestions[qIdx],
                        answer: e.target.value,
                      };
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
                      updatedQuestions[qIdx] = {
                        ...updatedQuestions[qIdx],
                        textAfter: e.target.value,
                      };
                      return { ...prev, questions: updatedQuestions };
                    })
                  }
                  sx={{ marginBottom: 1 }}
                />
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAddQuestion}>
          Add Question
        </Button>
      </Box>

      <Divider sx={{ marginY: 4 }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {id ? "Update Fill in the Blanks" : "Create Fill in the Blanks"}
        </Button>
      </Box>
    </Container>
  );
}
