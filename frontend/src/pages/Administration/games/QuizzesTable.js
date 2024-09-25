import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Active icon
import CancelIcon from "@mui/icons-material/Cancel"; // Inactive icon
import { green, red } from "@mui/material/colors"; // Colors for active/inactive
import { useNavigate } from "react-router-dom";
import axios from "../../../components/axios"; // Adjust with your axios instance

export default function QuizzesTable() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the quizzes
    axios
      .get("/quizzes")
      .then((response) => {
        setQuizzes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quizzes", error);
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`/quizzes/${id}`)
      .then(() => {
        setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting quiz", error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Quiz Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/admin/quiz/create")}
        sx={{ marginBottom: 2 }}
      >
        Create New Quiz
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Active/Inactive</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizzes.map((quiz) => (
              <TableRow key={quiz._id}>
                <TableCell>{quiz.name}</TableCell>
                <TableCell>{quiz.description}</TableCell>
                <TableCell>
                  {quiz.active ? (
                    <CheckCircleIcon sx={{ color: green[500] }} /> // Green tick for active
                  ) : (
                    <CancelIcon sx={{ color: red[500] }} /> // Red cross for inactive
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => navigate(`/admin/quiz/${quiz._id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(quiz._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
