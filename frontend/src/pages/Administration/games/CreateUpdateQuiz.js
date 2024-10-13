// CreateUpdateQuiz.js
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
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material"; // Icons for add/delete
import axios from "../../../components/axios"; // Adjust with your axios instance

export default function CreateUpdateQuiz() {
  const { id } = useParams(); // Check if we're editing an existing quiz
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState({
    name: { en: "", ms: "" },
    description: { en: "", ms: "" },
    timeLimitPerQuestion: 30, // Default time limit
    active: false,
    questions: [],
  });

  const [newQuestion, setNewQuestion] = useState({
    questionText: { en: "", ms: "" },
    options: [
      { optionText: { en: "", ms: "" }, isCorrect: false },
      { optionText: { en: "", ms: "" }, isCorrect: false },
    ], // Initial 2 options
  });

  useEffect(() => {
    if (id) {
      // Fetch the quiz for editing if an ID is provided
      axios
        .get(`/quizzes/${id}`)
        .then((response) => {
          const { name, description, timeLimitPerQuestion, active, questions } =
            response.data;
          setQuiz({
            name,
            description,
            timeLimitPerQuestion,
            active,
            questions,
          });
        })
        .catch((error) => {
          console.error("Error fetching quiz", error);
        });
    }
  }, [id]);

  // Handle Add Question to the quiz
  const handleAddQuestion = () => {
    // Validate that question text and options are filled
    if (
      newQuestion.questionText.en &&
      newQuestion.questionText.ms &&
      newQuestion.options.every((opt) => opt.optionText.en && opt.optionText.ms)
    ) {
      setQuiz((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }));

      // Reset newQuestion to its initial state
      setNewQuestion({
        questionText: { en: "", ms: "" },
        options: [
          { optionText: { en: "", ms: "" }, isCorrect: false },
          { optionText: { en: "", ms: "" }, isCorrect: false },
        ],
      });
    } else {
      alert("Please fill out all fields for question and options.");
    }
  };

  // Handle Delete Question
  const handleDeleteQuestion = (questionIndex) => {
    const updatedQuestions = quiz.questions.filter(
      (_, qIdx) => qIdx !== questionIndex
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  // Handle Option Changes
  const handleOptionChange = (questionIndex, optionIndex, language, value) => {
    const updatedQuestions = quiz.questions.map((question, qIdx) => {
      if (qIdx === questionIndex) {
        const updatedOptions = question.options.map((option, oIdx) => {
          if (oIdx === optionIndex) {
            return {
              ...option,
              optionText: {
                ...option.optionText,
                [language]: value,
              },
            };
          }
          return option;
        });
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  // Handle Correct Option Change
  const handleCorrectOptionChange = (questionIndex, optionIndex) => {
    const updatedQuestions = quiz.questions.map((question, qIdx) => {
      if (qIdx === questionIndex) {
        const updatedOptions = question.options.map((option, oIdx) => ({
          ...option,
          isCorrect: oIdx === optionIndex,
        }));
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  // Handle Add Option to a Question
  const handleAddOption = (questionIndex) => {
    const updatedQuestions = quiz.questions.map((question, qIdx) => {
      if (qIdx === questionIndex) {
        return {
          ...question,
          options: [
            ...question.options,
            { optionText: { en: "", ms: "" }, isCorrect: false },
          ],
        };
      }
      return question;
    });
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  // Handle Delete Option from a Question
  const handleDeleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = quiz.questions.map((question, qIdx) => {
      if (qIdx === questionIndex) {
        const updatedOptions = question.options.filter(
          (_, oIdx) => oIdx !== optionIndex
        );
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  // Handle Changes in Question Text
  const handleQuestionTextChange = (questionIndex, language, value) => {
    const updatedQuestions = quiz.questions.map((question, qIdx) => {
      if (qIdx === questionIndex) {
        return {
          ...question,
          questionText: {
            ...question.questionText,
            [language]: value,
          },
        };
      }
      return question;
    });
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  // Handle Submit
  const handleSubmit = () => {
    // Validation can be added here

    if (!quiz.name.en || !quiz.name.ms) {
      alert("Please fill out the quiz name in both languages.");
      return;
    }

    // Prepare data
    const quizData = {
      name: quiz.name,
      description: quiz.description,
      timeLimitPerQuestion: Number(quiz.timeLimitPerQuestion), // Convert to number
      active: quiz.active,
      questions: quiz.questions,
    };

    if (id) {
      // Update quiz
      axios
        .put(`/quizzes/${id}`, quizData)
        .then(() => {
          navigate("/admin/quizzes");
        })
        .catch((error) => {
          console.error("Error updating quiz", error);
        });
    } else {
      // Create new quiz
      axios
        .post("/quizzes", quizData)
        .then(() => {
          navigate("/admin/quizzes");
        })
        .catch((error) => {
          console.error("Error creating quiz", error);
        });
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        {id ? "Edit Quiz" : "Create New Quiz"}
      </Typography>

      {/* Quiz Name Fields */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Quiz Name (EN)"
            fullWidth
            value={quiz.name.en}
            onChange={(e) =>
              setQuiz({
                ...quiz,
                name: { ...quiz.name, en: e.target.value },
              })
            }
            sx={{ marginBottom: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Quiz Name (MS)"
            fullWidth
            value={quiz.name.ms}
            onChange={(e) =>
              setQuiz({
                ...quiz,
                name: { ...quiz.name, ms: e.target.value },
              })
            }
            sx={{ marginBottom: 2 }}
          />
        </Grid>
      </Grid>

      {/* Description Fields */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Description (EN)"
            fullWidth
            value={quiz.description.en}
            onChange={(e) =>
              setQuiz({
                ...quiz,
                description: { ...quiz.description, en: e.target.value },
              })
            }
            sx={{ marginBottom: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Description (MS)"
            fullWidth
            value={quiz.description.ms}
            onChange={(e) =>
              setQuiz({
                ...quiz,
                description: { ...quiz.description, ms: e.target.value },
              })
            }
            sx={{ marginBottom: 2 }}
          />
        </Grid>
      </Grid>

      {/* Time Limit Per Question Field */}
      <TextField
        label="Time Limit Per Question (seconds)"
        fullWidth
        type="number"
        value={quiz.timeLimitPerQuestion}
        onChange={(e) =>
          setQuiz({ ...quiz, timeLimitPerQuestion: e.target.value })
        }
        sx={{ marginBottom: 2 }}
      />

      {/* Active Status Toggle */}
      <FormControlLabel
        control={
          <Switch
            checked={quiz.active}
            onChange={(e) => setQuiz({ ...quiz, active: e.target.checked })}
            color="primary"
          />
        }
        label="Set as Active Quiz"
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Questions
      </Typography>

      {/* Existing Questions */}
      {quiz.questions.map((question, qIdx) => (
        <Box
          key={qIdx}
          sx={{
            marginBottom: 4,
            border: "1px solid #ccc",
            padding: 2,
            borderRadius: 4,
          }}
        >
          {/* Question Header */}
          <Grid
            container
            alignItems="center"
            spacing={1}
            sx={{ marginBottom: 2 }}
          >
            <Grid item xs>
              <Typography variant="h6">Question {qIdx + 1}</Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={() => handleDeleteQuestion(qIdx)}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>

          {/* Question Text Fields */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Question Text (EN)"
                fullWidth
                value={question.questionText.en}
                onChange={(e) =>
                  handleQuestionTextChange(qIdx, "en", e.target.value)
                }
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Question Text (MS)"
                fullWidth
                value={question.questionText.ms}
                onChange={(e) =>
                  handleQuestionTextChange(qIdx, "ms", e.target.value)
                }
                sx={{ marginBottom: 2 }}
              />
            </Grid>
          </Grid>

          {/* Options */}
          {question.options.map((option, oIdx) => (
            <Box key={oIdx} sx={{ marginBottom: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <TextField
                    label={`Option ${oIdx + 1} (EN)`}
                    fullWidth
                    value={option.optionText.en}
                    onChange={(e) =>
                      handleOptionChange(qIdx, oIdx, "en", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    label={`Option ${oIdx + 1} (MS)`}
                    fullWidth
                    value={option.optionText.ms}
                    onChange={(e) =>
                      handleOptionChange(qIdx, oIdx, "ms", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    color={option.isCorrect ? "success" : "primary"}
                    onClick={() => handleCorrectOptionChange(qIdx, oIdx)}
                    fullWidth
                  >
                    {option.isCorrect ? "Correct" : "Set Correct"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ))}

          {/* Add Option Button */}
          <Button
            startIcon={<Add />}
            onClick={() => handleAddOption(qIdx)}
            sx={{ marginBottom: 2 }}
          >
            Add Option
          </Button>
        </Box>
      ))}

      {/* New Question Section */}
      <Box
        sx={{
          marginBottom: 4,
          border: "1px solid #ccc",
          padding: 2,
          borderRadius: 4,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Add New Question
        </Typography>

        {/* New Question Text Fields */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Question Text (EN)"
              fullWidth
              value={newQuestion.questionText.en}
              onChange={(e) =>
                setNewQuestion((prev) => ({
                  ...prev,
                  questionText: { ...prev.questionText, en: e.target.value },
                }))
              }
              sx={{ marginBottom: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Question Text (MS)"
              fullWidth
              value={newQuestion.questionText.ms}
              onChange={(e) =>
                setNewQuestion((prev) => ({
                  ...prev,
                  questionText: { ...prev.questionText, ms: e.target.value },
                }))
              }
              sx={{ marginBottom: 2 }}
            />
          </Grid>
        </Grid>

        {/* New Question Options */}
        {newQuestion.options.map((option, oIdx) => (
          <Box key={oIdx} sx={{ marginBottom: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  label={`Option ${oIdx + 1} (EN)`}
                  fullWidth
                  value={option.optionText.en}
                  onChange={(e) =>
                    setNewQuestion((prev) => {
                      const updatedOptions = [...prev.options];
                      updatedOptions[oIdx].optionText.en = e.target.value;
                      return { ...prev, options: updatedOptions };
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label={`Option ${oIdx + 1} (MS)`}
                  fullWidth
                  value={option.optionText.ms}
                  onChange={(e) =>
                    setNewQuestion((prev) => {
                      const updatedOptions = [...prev.options];
                      updatedOptions[oIdx].optionText.ms = e.target.value;
                      return { ...prev, options: updatedOptions };
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color={option.isCorrect ? "success" : "primary"}
                  onClick={() =>
                    setNewQuestion((prev) => {
                      const updatedOptions = prev.options.map((opt, idx) => ({
                        ...opt,
                        isCorrect: idx === oIdx,
                      }));
                      return { ...prev, options: updatedOptions };
                    })
                  }
                  fullWidth
                >
                  {option.isCorrect ? "Correct" : "Set Correct"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        ))}

        {/* Add Option Button for New Question */}
        <Button
          startIcon={<Add />}
          onClick={() =>
            setNewQuestion((prev) => ({
              ...prev,
              options: [
                ...prev.options,
                { optionText: { en: "", ms: "" }, isCorrect: false },
              ],
            }))
          }
          sx={{ marginBottom: 2 }}
        >
          Add Option
        </Button>

        {/* Add Question Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddQuestion}
          sx={{ marginBottom: 2 }}
        >
          Add Question to Quiz
        </Button>
      </Box>

      {/* Submit Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {id ? "Update Quiz" : "Create Quiz"}
        </Button>
      </Box>
    </Container>
  );
}
