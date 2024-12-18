// StoryListMenu.js
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { green, red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import axios from "../../../components/axios";

export default function StoryListMenu() {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/stories")
      .then((response) => {
        setStories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stories", error);
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`/stories/${id}`)
      .then(() => {
        setStories(stories.filter((story) => story._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting story", error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Interactive Stories Management
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/admin/story/create")}
        sx={{ marginBottom: 2 }}
      >
        Create New Story
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title (EN)</TableCell>
              <TableCell>Title (MS)</TableCell>
              <TableCell>Description (EN)</TableCell>
              <TableCell>Description (MS)</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stories.map((story) => (
              <TableRow key={story._id}>
                <TableCell>{story.title.en}</TableCell>
                <TableCell>{story.title.ms}</TableCell>
                <TableCell>{story.description.en}</TableCell>
                <TableCell>{story.description.ms}</TableCell>
                <TableCell>
                  {story.active ? (
                    <CheckCircleIcon sx={{ color: green[500] }} />
                  ) : (
                    <CancelIcon sx={{ color: red[500] }} />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => navigate(`/admin/story/edit/${story._id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(story._id)}>
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
