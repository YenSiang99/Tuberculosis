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
    name: "",
    description: "",
    timeLimitPerQuestion: "", // Field for time limit per question
    active: false, // Field for quiz active status
    questions: [],
  });

  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: [
      { optionText: "", isCorrect: false },
      { optionText: "", isCorrect: false },
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
    if (newQuestion.questionText) {
      setQuiz((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }));
      setNewQuestion({
        questionText: "",
        options: [
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
        ],
      });
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
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = quiz.questions.map((question, qIdx) => {
      if (qIdx === questionIndex) {
        const updatedOptions = question.options.map((option, oIdx) => {
          if (oIdx === optionIndex) {
            return { ...option, optionText: value };
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
          options: [...question.options, { optionText: "", isCorrect: false }],
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

  // Handle Submit
  const handleSubmit = () => {
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

      <TextField
        label="Name"
        fullWidth
        value={quiz.name}
        onChange={(e) => setQuiz({ ...quiz, name: e.target.value })}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Description"
        fullWidth
        value={quiz.description}
        onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
        sx={{ marginBottom: 2 }}
      />

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

      {quiz.questions.map((question, qIdx) => (
        <Box key={qIdx} sx={{ marginBottom: 4 }}>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            {`Question ${qIdx + 1}`}
          </Typography>
          <TextField
            label="Question Text"
            fullWidth
            value={question.questionText}
            onChange={(e) =>
              setQuiz((prev) => {
                const updatedQuestions = [...prev.questions];
                updatedQuestions[qIdx].questionText = e.target.value;
                return { ...prev, questions: updatedQuestions };
              })
            }
            sx={{ marginBottom: 2 }}
          />

          <Grid container spacing={2}>
            {question.options.map((option, oIdx) => (
              <Grid item xs={12} sm={6} key={oIdx}>
                <TextField
                  label={`Option ${oIdx + 1}`}
                  fullWidth
                  value={option.optionText}
                  onChange={(e) =>
                    handleOptionChange(qIdx, oIdx, e.target.value)
                  }
                  sx={{ marginBottom: 1 }}
                />
                <Button
                  variant="contained"
                  color={option.isCorrect ? "success" : "error"}
                  onClick={() => handleCorrectOptionChange(qIdx, oIdx)}
                  fullWidth
                  sx={{ marginBottom: 1 }}
                >
                  {option.isCorrect ? "Correct Answer" : "Set as Correct"}
                </Button>
                <IconButton
                  onClick={() => handleDeleteOption(qIdx, oIdx)}
                  sx={{ marginLeft: 1 }}
                >
                  <Delete />
                </IconButton>
              </Grid>
            ))}
          </Grid>

          <Button
            startIcon={<Add />}
            onClick={() => handleAddOption(qIdx)}
            sx={{ marginTop: 1 }}
          >
            Add Option
          </Button>
          <IconButton
            onClick={() => handleDeleteQuestion(qIdx)}
            sx={{ marginLeft: 1 }}
          >
            <Delete />
          </IconButton>
        </Box>
      ))}

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
        {id ? "Update Quiz" : "Create Quiz"}
      </Button>
    </Container>
  );
}
