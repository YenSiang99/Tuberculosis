import React, { useState } from 'react';
import {
  ThemeProvider,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Drawer,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AdminSidebar from './reusable/AdminBar';
import theme from './reusable/Theme';

const initialUserForm = {
  id: null,
  name: '',
  email: '',
  role: 'patient', // Default role
};

export default function ManageUsers() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'patient' },
    { id: 3, name: 'William Johnson', email: 'william@example.com', role: 'healthcare' },
    // ... more users
  ]);
  const [selectedRole, setSelectedRole] = useState('All');
  const [openDialog, setOpenDialog] = useState(false);
  const [userForm, setUserForm] = useState(initialUserForm);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setUserForm(initialUserForm);
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Logic to add or update user (needs backend integration)
    handleDialogClose();
    // Add or update user in the 'users' state
  };

  const handleEdit = (user) => {
    setUserForm(user);
    handleDialogOpen();
  };

  const handleDelete = (userId) => {
    // Logic to delete user (needs backend integration)
    // Delete user from the 'users' state
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const filteredUsers = selectedRole === 'All' ? users : users.filter(user => user.role === selectedRole.toLowerCase());

  return (
    <ThemeProvider theme={theme}>
      <Drawer variant="permanent" anchor="left">
        <AdminSidebar />
      </Drawer>

      <Container maxWidth="lg" sx={{ mt: 4, ml: { sm: 30 } }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <FormControl sx={{ width: 200 }}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={selectedRole}
              label="Role"
              onChange={handleRoleChange}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Patient">Patient</MenuItem>
              <MenuItem value="Healthcare">Healthcare</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleDialogOpen}
          >
            Add User
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</TableCell>
                  <TableCell>
                    <IconButton aria-label="edit" onClick={() => handleEdit(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDelete(user.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add/Edit User</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Name"
              type="text"
              fullWidth
              value={userForm.name}
              onChange={handleUserFormChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              id="email"
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={userForm.email}
              onChange={handleUserFormChange}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={userForm.role}
                label="Role"
                onChange={handleUserFormChange}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="patient">Patient</MenuItem>
                <MenuItem value="healthcare">Healthcare</MenuItem>
              </Select>
            </FormControl>
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
      </Container>
    </ThemeProvider>
  );
}
