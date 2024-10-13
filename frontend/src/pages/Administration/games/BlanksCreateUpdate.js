// BlanksCreateUpdate.js
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
    name: { en: "", ms: "" },
    description: { en: "", ms: "" },
    questions: [],
    active: false,
  });

  const [newQuestion, setNewQuestion] = useState({
    textBefore: { en: "", ms: "" },
    textAfter: { en: "", ms: "" },
    answer: { en: "", ms: "" },
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
    if (
      newQuestion.textBefore.en &&
      newQuestion.textBefore.ms &&
      newQuestion.textAfter.en &&
      newQuestion.textAfter.ms &&
      newQuestion.answer.en &&
      newQuestion.answer.ms
    ) {
      setFillBlank((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }));
      setNewQuestion({
        textBefore: { en: "", ms: "" },
        textAfter: { en: "", ms: "" },
        answer: { en: "", ms: "" },
      });
    } else {
      alert("Please fill out all fields for both languages.");
    }
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

      {/* Name Fields */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name (EN)"
            fullWidth
            value={fillBlank.name.en}
            onChange={(e) =>
              setFillBlank({
                ...fillBlank,
                name: { ...fillBlank.name, en: e.target.value },
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name (MS)"
            fullWidth
            value={fillBlank.name.ms}
            onChange={(e) =>
              setFillBlank({
                ...fillBlank,
                name: { ...fillBlank.name, ms: e.target.value },
              })
            }
          />
        </Grid>
      </Grid>

      {/* Description Fields */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Description (EN)"
            fullWidth
            value={fillBlank.description.en}
            onChange={(e) =>
              setFillBlank({
                ...fillBlank,
                description: { ...fillBlank.description, en: e.target.value },
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Description (MS)"
            fullWidth
            value={fillBlank.description.ms}
            onChange={(e) =>
              setFillBlank({
                ...fillBlank,
                description: { ...fillBlank.description, ms: e.target.value },
              })
            }
          />
        </Grid>
      </Grid>

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

      {/* Existing Questions */}
      {fillBlank.questions.map((question, qIdx) => (
        <Box
          key={qIdx}
          sx={{
            marginBottom: 3,
            border: "1px solid #ccc",
            padding: 2,
            borderRadius: 4,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">{`Question ${qIdx + 1}`}</Typography>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleDeleteQuestion(qIdx)}
              >
                Delete Question
              </Button>
            </Grid>

            {/* Text Before Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Text Before (EN)"
                fullWidth
                value={question.textBefore.en}
                onChange={(e) =>
                  setFillBlank((prev) => {
                    const updatedQuestions = [...prev.questions];
                    updatedQuestions[qIdx].textBefore.en = e.target.value;
                    return { ...prev, questions: updatedQuestions };
                  })
                }
                sx={{ marginBottom: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Text Before (MS)"
                fullWidth
                value={question.textBefore.ms}
                onChange={(e) =>
                  setFillBlank((prev) => {
                    const updatedQuestions = [...prev.questions];
                    updatedQuestions[qIdx].textBefore.ms = e.target.value;
                    return { ...prev, questions: updatedQuestions };
                  })
                }
                sx={{ marginBottom: 1 }}
              />
            </Grid>

            {/* Answer Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Answer (EN)"
                fullWidth
                value={question.answer.en}
                onChange={(e) =>
                  setFillBlank((prev) => {
                    const updatedQuestions = [...prev.questions];
                    updatedQuestions[qIdx].answer.en = e.target.value;
                    return { ...prev, questions: updatedQuestions };
                  })
                }
                sx={{ marginBottom: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Answer (MS)"
                fullWidth
                value={question.answer.ms}
                onChange={(e) =>
                  setFillBlank((prev) => {
                    const updatedQuestions = [...prev.questions];
                    updatedQuestions[qIdx].answer.ms = e.target.value;
                    return { ...prev, questions: updatedQuestions };
                  })
                }
                sx={{ marginBottom: 1 }}
              />
            </Grid>

            {/* Text After Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Text After (EN)"
                fullWidth
                value={question.textAfter.en}
                onChange={(e) =>
                  setFillBlank((prev) => {
                    const updatedQuestions = [...prev.questions];
                    updatedQuestions[qIdx].textAfter.en = e.target.value;
                    return { ...prev, questions: updatedQuestions };
                  })
                }
                sx={{ marginBottom: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Text After (MS)"
                fullWidth
                value={question.textAfter.ms}
                onChange={(e) =>
                  setFillBlank((prev) => {
                    const updatedQuestions = [...prev.questions];
                    updatedQuestions[qIdx].textAfter.ms = e.target.value;
                    return { ...prev, questions: updatedQuestions };
                  })
                }
                sx={{ marginBottom: 1 }}
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      {/* New Question Fields */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Add New Question
      </Typography>
      <Box
        sx={{
          marginBottom: 3,
          border: "1px solid #ccc",
          padding: 2,
          borderRadius: 4,
        }}
      >
        <Grid container spacing={2}>
          {/* Text Before Fields */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Text Before (EN)"
              fullWidth
              value={newQuestion.textBefore.en}
              onChange={(e) =>
                setNewQuestion((prev) => ({
                  ...prev,
                  textBefore: { ...prev.textBefore, en: e.target.value },
                }))
              }
              sx={{ marginBottom: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Text Before (MS)"
              fullWidth
              value={newQuestion.textBefore.ms}
              onChange={(e) =>
                setNewQuestion((prev) => ({
                  ...prev,
                  textBefore: { ...prev.textBefore, ms: e.target.value },
                }))
              }
              sx={{ marginBottom: 1 }}
            />
          </Grid>

          {/* Answer Fields */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Answer (EN)"
              fullWidth
              value={newQuestion.answer.en}
              onChange={(e) =>
                setNewQuestion((prev) => ({
                  ...prev,
                  answer: { ...prev.answer, en: e.target.value },
                }))
              }
              sx={{ marginBottom: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Answer (MS)"
              fullWidth
              value={newQuestion.answer.ms}
              onChange={(e) =>
                setNewQuestion((prev) => ({
                  ...prev,
                  answer: { ...prev.answer, ms: e.target.value },
                }))
              }
              sx={{ marginBottom: 1 }}
            />
          </Grid>

          {/* Text After Fields */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Text After (EN)"
              fullWidth
              value={newQuestion.textAfter.en}
              onChange={(e) =>
                setNewQuestion((prev) => ({
                  ...prev,
                  textAfter: { ...prev.textAfter, en: e.target.value },
                }))
              }
              sx={{ marginBottom: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Text After (MS)"
              fullWidth
              value={newQuestion.textAfter.ms}
              onChange={(e) =>
                setNewQuestion((prev) => ({
                  ...prev,
                  textAfter: { ...prev.textAfter, ms: e.target.value },
                }))
              }
              sx={{ marginBottom: 1 }}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddQuestion}
          >
            Add Question
          </Button>
        </Box>
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
