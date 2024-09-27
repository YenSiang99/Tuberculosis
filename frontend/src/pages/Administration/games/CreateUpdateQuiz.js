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

export default function CreateUpdateQuiz() {
  const { id } = useParams(); // Check if we're editing an existing quiz
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState({
    name: "",
    description: "",
    questions: [],
  });
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: [
      { optionText: "", isCorrect: false },
      { optionText: "", isCorrect: false },
      { optionText: "", isCorrect: false },
      { optionText: "", isCorrect: false },
    ],
  });

  useEffect(() => {
    if (id) {
      // Fetch the quiz for editing if an ID is provided
      axios
        .get(`/quizzes/${id}`)
        .then((response) => {
          setQuiz(response.data);
        })
        .catch((error) => {
          console.error("Error fetching quiz", error);
        });
    }
  }, [id]);

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
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
        ],
      });
    }
  };

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

  const handleSubmit = () => {
    if (id) {
      // Update quiz
      axios
        .put(`/quizzes/${id}`, quiz)
        .then(() => {
          navigate("/admin/quizzes");
        })
        .catch((error) => {
          console.error("Error updating quiz", error);
        });
    } else {
      // Create new quiz
      axios
        .post("/quizzes", quiz)
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

      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Questions
      </Typography>

      {quiz.questions.map((question, qIdx) => (
        <Box key={qIdx} sx={{ marginBottom: 4 }}>
          {" "}
          {/* Added margin for spacing between questions */}
          {/* Display Question Number */}
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            {`Question ${qIdx + 1}`}
          </Typography>
          {/* Question Text */}
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
                {/* Option Text */}
                <TextField
                  label={`Option ${oIdx + 1}`}
                  fullWidth
                  value={option.optionText}
                  onChange={(e) =>
                    handleOptionChange(qIdx, oIdx, e.target.value)
                  }
                  sx={{ marginBottom: 1 }}
                />

                {/* Set as Correct Button */}
                <Button
                  variant="contained" // Changed to 'contained' for full color button
                  color={option.isCorrect ? "success" : "error"} // Green for correct, red for incorrect
                  onClick={() => handleCorrectOptionChange(qIdx, oIdx)}
                  fullWidth // Make the button full width
                  sx={{ marginBottom: 1 }}
                >
                  {option.isCorrect ? "Correct Answer" : "Set as Correct"}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

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
