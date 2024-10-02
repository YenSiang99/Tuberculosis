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
  InputAdornment,
  IconButton,
  Alert,
  Dialog,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import theme from "../../components/reusable/Theme";
import BgImage from "../../assets/cover.jpeg";
import axios from "../../components/axios";
import PhoneInput from "react-phone-input-2";

export default function UserRegister() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState({
    valid: true,
    message: "",
  });
  const [emailError, setEmailError] = useState({ valid: true, message: "" });

  const [phoneNumber, setPhoneNumber] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    // Create the user data object
    const userData = {
      phoneNumber,
    };
    try {
      // Send a POST request
      const response = await axios.post("/auth/registerUser", userData);
      navigate("/register/success");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Email already registered
        setAlertInfo({
          show: true,
          type: "error",
          message: "Email already registered.",
        });
      } else {
        // General error handling
        setAlertInfo({
          show: true,
          type: "error",
          message: "An unexpected error occurred. Please try again.",
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

  // const validateEmail = (email) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(email)) {
  //     return {
  //       valid: false,
  //       message: "Invalid email format.",
  //     };
  //   }
  //   return { valid: true, message: "" };
  // };

  //  const validatePassword = (password) => {
  //    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  //    if (!passwordRegex.test(password)) {
  //      return {
  //        valid: false,
  //        message:
  //          "Password must be at least 8 characters long and contain at least one letter and one number.",
  //      };
  //    }
  //    return { valid: true, message: "" };
  //  };

  //  const handlePasswordChange = () => {
  //    const validationResult = validatePassword(password);
  //    setPasswordError(validationResult);
  //  };

  // const handleEmailChange = () => {
  //   const validationResult = validateEmail(email);
  //   setEmailError(validationResult);
  // };

  const isFormValid = () => {
    return emailError.valid && passwordError.valid;
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
            User Registration
          </Typography>
          <Box
            component="form"
            onSubmit={handleRegister}
            sx={{ mt: 1, width: "100%" }}
          >
            <Grid container spacing={2}>
              {/* <Grid item xs={12} sm={6}>
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
              </Grid> */}
              {/* <Grid item xs={12}>
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
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordChange}
                  error={!passwordError.valid}
                  helperText={passwordError.valid ? "" : passwordError.message}
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
              </Grid> */}
              {/* <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!passwordError.valid}
                  helperText={passwordError.valid ? "" : passwordError.message}
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
              </Grid> */}
              <Grid item xs={12}>
                <PhoneInput
                  country={"my"}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  onlyCountries={["my"]}
                  disableDropdown={true}
                  countryCodeEditable={false}
                  containerStyle={{ width: "100%" }}
                  inputStyle={{ width: "100%", height: "56px" }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              disabled={!isFormValid()}
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
