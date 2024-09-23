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

export default function FillBlanksTable() {
  const [fillBlanks, setFillBlanks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the fill-in-the-blanks sets
    axios
      .get("/fillBlanks")
      .then((response) => {
        setFillBlanks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching fill-in-the-blanks sets", error);
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`/fillBlanks/${id}`)
      .then(() => {
        setFillBlanks(fillBlanks.filter((fillBlank) => fillBlank._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting fill-in-the-blanks set", error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Fill in the Blanks Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/blanks/create")}
        sx={{ marginBottom: 2 }}
      >
        Create New Fill in the Blanks Set
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
            {fillBlanks.map((fillBlank) => (
              <TableRow key={fillBlank._id}>
                <TableCell>{fillBlank.name}</TableCell>
                <TableCell>{fillBlank.description}</TableCell>
                <TableCell>
                  {fillBlank.active ? (
                    <CheckCircleIcon sx={{ color: green[500] }} /> // Green tick for active
                  ) : (
                    <CancelIcon sx={{ color: red[500] }} /> // Red cross for inactive
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => navigate(`/blanks/${fillBlank._id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(fillBlank._id)}>
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
