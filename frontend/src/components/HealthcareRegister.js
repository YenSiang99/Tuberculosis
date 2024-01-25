import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Link,
  MenuItem,
  InputLabel,
  IconButton,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import theme from './reusable/Theme';
import BgImage from "./image/cover.jpeg";

export default function HealthcareRegister() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [role, setRole] = useState('');
  const [mcpid, setMCPID] = useState('');

  const handleRegister = (event) => {
    event.preventDefault();
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log('Role:', role);
    console.log('MCP ID:', mcpid);
  };

  const SubmitNext = () => navigate("/register/healthcare_2");

    // Function to handle profile picture change
    const handleProfilePictureChange = (event) => {
      if (event.target.files && event.target.files[0]) {
        setProfilePicture(URL.createObjectURL(event.target.files[0]));
      }
    };

  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(217, 241, 251, 0.8), rgba(217, 241, 251, 0.8)), url(${BgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 3,
            boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
            borderRadius: "15px",
            backgroundColor: "white",
            width: "100vh",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Step 1: Personal Details
          </Typography>
          <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <InputLabel htmlFor="icon-button-file">
                  Upload Profile Picture
                </InputLabel>
                <input
                  accept="image/*"
                  id="icon-button-file"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleProfilePictureChange}
                />
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  htmlFor="icon-button-file"
                  style={{
                    marginTop: "8px",
                    padding: "18.5px 14px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                    fontSize: "1rem",
                  }}
                >
                  <PhotoCamera />
                </IconButton>

                {profilePicture && (
                  <Avatar src={profilePicture} sx={{ width: 56, height: 56 }} />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  autoFocus
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                  <MenuItem value="doctor">Doctor</MenuItem>
                  <MenuItem value="nurse">Nurse</MenuItem>
                  <MenuItem value="medical-assistant">Medical Assistant</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="mcpid"
                  label="MCP ID"
                  name="mcpid"
                  autoFocus
                  value={firstName}
                  onChange={(e) => setMCPID(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              onClick={SubmitNext}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
