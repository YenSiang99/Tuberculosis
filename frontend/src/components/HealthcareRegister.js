import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  ThemeProvider,
  Box,
  Typography,
  TextField,
  Button,
  CssBaseline,
  Avatar,
  Grid,
  Link,
  MenuItem,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import theme from './reusable/Theme';

export default function HealthcareRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState('');

  const handleRegister = (event) => {
    event.preventDefault();
    console.log('Name:', name);
    console.log('Role:', role);
    console.log('Category:', category);
  };

  const SubmitRegister = () => navigate("/healthcarepatient");

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  margin="normal"
                  required
                  fullWidth
                  id="role"
                  label="Role"
                  name="role"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                >
                  <MenuItem value="nurse">Nurse</MenuItem>
                  <MenuItem value="doctor">Doctor</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  margin="normal"
                  required
                  fullWidth
                  id="category"
                  label="Category"
                  name="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <MenuItem value="government">Government</MenuItem>
                  <MenuItem value="private">Private Hospital</MenuItem>
                  <MenuItem value="ngo">NGO</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              onClick={SubmitRegister}
            >
              Next
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
