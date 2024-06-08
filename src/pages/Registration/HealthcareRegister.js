import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ThemeProvider,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  MenuItem,
  InputAdornment,
  IconButton,
  Alert,
  Dialog,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import theme from "../../components/reusable/Theme";
import BgImage from "../../images/cover.jpeg";
import axios from "../../components/axios";

export default function HealthcareRegister() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [group, setGroup] = useState("");
  const [mcpId, setMCPID] = useState("");
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); 
  const [passwordError, setPasswordError] = useState({valid: true, message: "",});
  const [emailError, setEmailError] = useState({ valid: true, message: "" });

  const handleRegister = async (event) => {
    event.preventDefault();
    // Create a FormData object
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('group', group);
    formData.append('mcpId', mcpId);
    formData.append('email', email);
    formData.append('password', password);
    // Append the profile picture file if selected
    if (selectedFile) {
      formData.append('profilePicture', selectedFile);
    }
  
    try {
      // Send a POST request with FormData
      const response = await axios.post("/auth/register", formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Important for processing files
        }
      });
      navigate("/register/success");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Email already registered
        setAlertInfo({
          show: true,
          type: "error",
          message: "Email already registered."
        });
      } else {
        // General error handling
        setAlertInfo({
          show: true,
          type: "error",
          message: "An unexpected error occurred. Please try again."
        });
      }
    }
  };
  

  const handleCloseAlert = () => {
    setAlertInfo({ show: false, type: "", message: "" });
  };

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {
      boxShadow: "none",
      overflow: "visible",
    },
  }));
  
  const handleProfilePictureUpload = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfilePicture(URL.createObjectURL(file)); // Set the profile picture for preview
      setSelectedFile(file); 

    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return {
        valid: false,
        message:
          "Password must be at least 8 characters long and contain at least one letter and one number.",
      };
    }
    return { valid: true, message: "" };
  };

  const handlePasswordChange = () => {
    const validationResult = validatePassword(password);
    setPasswordError(validationResult);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        valid: false,
        message: "Invalid email format.",
      };
    }
    return { valid: true, message: "" };
  };

  const handleEmailChange = () => {
    const validationResult = validateEmail(email);
    setEmailError(validationResult);
  };

  const isFormValid = () => {
    return (
      emailError.valid &&
      passwordError.valid
    );
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
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Healthcare Registration
          </Typography>
          <Box
            component="form"
            onSubmit={handleRegister}
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item sm={12}>
                {/* Profile picture upload section */}
                {profilePicture ? (
                  <>
                    {/* Profile picture display */}
                    <Grid item>
                      <Avatar
                        src={profilePicture}
                        sx={{ width: 90, height: 90 }}
                      />
                    </Grid>
                    {/* Edit photo button */}
                    <Grid item>
                      <input
                        accept="image/*"
                        id="icon-button-file"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleProfilePictureUpload}
                      />
                      <label htmlFor="icon-button-file">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUploadIcon />}
                          style={{
                            marginTop: "8px",
                            padding: "10px 14px",
                            border: "1px solid #ced4da",
                            borderRadius: "4px",
                            backgroundColor: "#fff",
                            textTransform: "none", // Optional: prevents uppercase styling
                          }}
                        >
                          Edit Photo
                        </Button>
                      </label>
                    </Grid>
                  </>
                ) : (
                  // Upload button only shown when no profile picture is uploaded
                  <Grid item>
                    <input
                      accept="image/*"
                      id="icon-button-file"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleProfilePictureUpload}
                    />
                    <label htmlFor="icon-button-file">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        style={{
                          marginTop: "8px",
                          padding: "10px 14px",
                          border: "1px solid #ced4da",
                          borderRadius: "4px",
                          backgroundColor: "#fff",
                          textTransform: "none", // Optional: prevents uppercase styling
                        }}
                      >
                        Upload Profile Picture
                      </Button>
                    </label>
                  </Grid>
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
                  id="group"
                  label="Group"
                  name="group"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                >
                  <MenuItem value="doctor">Doctor</MenuItem>
                  <MenuItem value="nurse">Nurse</MenuItem>
                  <MenuItem value="medical assistant">
                    Medical Assistant
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="mcpId"
                  label="MCP ID"
                  name="mcpId"
                  autoFocus
                  value={mcpId}
                  onChange={(e) => setMCPID(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
              <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailChange}
                    error={!emailError.valid}
                    helperText={emailError.valid ? "" : emailError.message}
                  />
              </Grid>
              <Grid item xs={12}>
              <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={handlePasswordChange}
                    error={!passwordError.valid}
                    helperText={
                      passwordError.valid ? "" : passwordError.message
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              // disabled={!isFormValid()}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Box>

      <CustomDialog
        open={alertInfo.show}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Alert severity={alertInfo.type} onClose={handleCloseAlert}>
          {alertInfo.message}
        </Alert>
      </CustomDialog>
    </ThemeProvider>
  );
}
