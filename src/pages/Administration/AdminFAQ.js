import React, { useState } from "react";
import {
  ThemeProvider,
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Drawer,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AdminSidebar from "../../components/reusable/AdminBar";
import theme from "../../components/reusable/Theme";

const initialFaqForm = {
  category: "",
  question: "",
  answer: "",
};

const initialCategoryForm = {
  originalName: "",
  newName: "",
};

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState({
    "About Tuberculosis": [
      {
        id: 1,
        question: "What is Tuberculosis?",
        answer:
          "Tuberculosis (TB) is an infectious disease usually caused by Mycobacterium tuberculosis bacteria.",
      },
      {
        id: 2,
        question: "How is TB spread?",
        answer:
          "TB is spread through the air when a person with TB of the lungs or throat coughs, speaks, or sings.",
      },
    ],
    "About Website": [{ id: 3, question: "How to register?", answer: "..." }],
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [faqForm, setFaqForm] = useState(initialFaqForm);
  const [newCategory, setNewCategory] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [openEditCategoryDialog, setOpenEditCategoryDialog] = useState(false);
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFaqForm(initialFaqForm);
  };

  const handleFaqChange = (e) => {
    const { name, value } = e.target;
    setFaqForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Logic to add or update FAQ (needs backend integration)
    handleDialogClose();
    setAlertMessage("FAQ updated successfully!");
    setAlertType("success");
  };

  const handleEdit = (faq) => {
    setFaqForm(faq);
    handleDialogOpen();
  };

  const handleDelete = (faqId) => {
    // Logic to delete FAQ (needs backend integration)
    setAlertMessage("FAQ deleted successfully!");
    setAlertType("info");
  };

  const handleCategoryDialogOpen = () => {
    setOpenCategoryDialog(true);
  };

  const handleCategoryDialogClose = () => {
    setOpenCategoryDialog(false);
    setNewCategory("");
  };

  const handleCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleAddCategory = () => {
    // Logic to add a new category (needs backend integration)
    handleCategoryDialogClose();
    setAlertMessage("Category added successfully!");
    setAlertType("success");
  };

  const handleDeleteCategory = (category) => {
    // Logic to delete a category (needs backend integration)
    setAlertMessage("Category deleted successfully!");
    setAlertType("info");
  };

  const handleEditCategoryDialogOpen = (category) => {
    setCategoryForm({ originalName: category, newName: category });
    setOpenEditCategoryDialog(true);
  };

  const handleEditCategoryDialogClose = () => {
    setOpenEditCategoryDialog(false);
    setCategoryForm(initialCategoryForm);
  };

  const handleCategoryFormChange = (e) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  };

  const handleUpdateCategory = () => {
    // Logic to update the category (needs backend integration)
    handleEditCategoryDialogClose();
    setAlertMessage("Category updated successfully!");
    setAlertType("success");
  };

  return (
    <ThemeProvider theme={theme}>
      <Drawer variant="permanent" anchor="left">
        <AdminSidebar />
      </Drawer>

      <Container maxWidth="lg" sx={{ mt: 4, ml: { sm: 30 } }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ mb: 2 }}
          onClick={handleCategoryDialogOpen}
        >
          Add Category
        </Button>

        {/* FAQ Sections */}
        {Object.entries(faqs).map(([category, faqList], index) => (
          <Paper key={category} elevation={2} sx={{ mb: 3, p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                {category}
              </Typography>
              <Box>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEditCategoryDialogOpen(category)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteCategory(category)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
            <List>
              {faqList.map((faq) => (
                <ListItem key={faq.id} divider>
                  <ListItemText primary={faq.question} secondary={faq.answer} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEdit(faq)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(faq.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {/* Button to Add New FAQ for each category */}
              <ListItem>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleDialogOpen()} // Open dialog to add FAQ to this category
                >
                  Add FAQ
                </Button>
              </ListItem>
            </List>
          </Paper>
        ))}

        {/* Alert for Feedback */}
        {alertMessage && (
          <Alert severity={alertType} onClose={() => setAlertMessage("")}>
            {alertMessage}
          </Alert>
        )}

        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {faqForm.id ? "Edit FAQ" : "Add FAQ"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="category"
              name="category"
              label="Category"
              type="text"
              fullWidth
              value={faqForm.category}
              onChange={handleFaqChange}
            />
            <TextField
              margin="dense"
              id="question"
              name="question"
              label="Question"
              type="text"
              fullWidth
              value={faqForm.question}
              onChange={handleFaqChange}
            />
            <TextField
              margin="dense"
              id="answer"
              name="answer"
              label="Answer"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={faqForm.answer}
              onChange={handleFaqChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openCategoryDialog}
          onClose={handleCategoryDialogClose}
          aria-labelledby="category-dialog-title"
        >
          <DialogTitle id="category-dialog-title">Add New Category</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="newCategory"
              label="Category Name"
              type="text"
              fullWidth
              value={newCategory}
              onChange={handleCategoryChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCategoryDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddCategory} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openEditCategoryDialog}
          onClose={handleEditCategoryDialogClose}
          aria-labelledby="edit-category-dialog-title"
        >
          <DialogTitle id="edit-category-dialog-title">
            Edit Category
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="newName"
              name="newName"
              label="Category Name"
              type="text"
              fullWidth
              value={categoryForm.newName}
              onChange={handleCategoryFormChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditCategoryDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}
