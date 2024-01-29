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
  InputLabel,
  IconButton,
  InputAdornment,
  Alert,
  Dialog,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PhoneInput from "react-phone-input-2";
import { CountryDropdown } from "react-country-region-selector";
import "react-phone-input-2/lib/material.css";
import theme from "./reusable/Theme";
import BgImage from "./image/cover.jpeg";

export default function PatientRegister() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nricNumber, setNRICNumber] = useState("");
  const [gender, setGender] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [treatmentStartMonth, setTreatmentStartMonth] = useState("");
  const [numberOfTablets, setNumberOfTablets] = useState("");

  const handleCloseAlert = () => {
    setAlertInfo({ show: false, type: "", message: "" });
  };

  const handleFormSubmit = (event) => {
    if (currentStep === 1) {
      event.preventDefault();
      handleRegisterNext();
    } else if (currentStep === 2) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleRegisterNext = () => {
    if (!phoneNumber || !country) {
      setAlertInfo({
        show: true,
        type: "error",
        message: "Phone number and country are required.",
      });
      console.log("Phone number and country are required.");
      return;
    }

    // if (nricNumber.length !== 12) {
    //   setAlertInfo({
    //     show: true,
    //     type: "error",
    //     message: "IC Number must have exactly 12 digits.",
    //   });
    //   return; // Prevent further processing if validation fails
    // }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlertInfo({
        show: true,
        type: "error",
        message: "Invalid email format.",
      });
      return;
    }

    // Simple password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum eight characters, at least one letter and one number
    if (!passwordRegex.test(password)) {
      setAlertInfo({
        show: true,
        type: "error",
        message:
          "Password must be at least 8 characters long and contain at least one letter and one number.",
      });
      return;
    }
  };

  // Function to handle profile picture change
  const handleProfilePictureChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePicture(URL.createObjectURL(event.target.files[0]));
    }
  };

  const getCurrentAge = (nricNumber) => {
    if (nricNumber.length < 6) return ""; // Ensure the IC number is long enough

    const currentYear = new Date().getFullYear();
    let birthYear = parseInt(nricNumber.substring(0, 2), 10);
    const currentYearLastTwoDigits = parseInt(
      currentYear.toString().substring(2, 4),
      10
    );

    birthYear += birthYear > currentYearLastTwoDigits ? 1900 : 2000;
    return currentYear - birthYear; // Return age
  };

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {
      boxShadow: "none",
      overflow: "visible",
    },
  }));

  const handleNext = () => {
    if (currentStep === 1) {
      // validate step 1 data
    }
    // Increment step
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    if (currentStep === 2) {
      // validate step 2 data and submit all data
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
          {currentStep === 1 && (
            <>
              <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                <PersonIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Step 1: Personal Details
              </Typography>
              <Box
                component="form"
                sx={{ mt: 1 }}
               onSubmit={handleFormSubmit}
              >
                <Grid container spacing={2}>
                  {/* Profile Picture Upload */}
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
                      <Avatar
                        src={profilePicture}
                        sx={{ width: 56, height: 56 }}
                      />
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
                      id="gender"
                      label="Gender"
                      name="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value=""></option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <PhoneInput
                      required
                      country={"us"}
                      value={phoneNumber}
                      onChange={(phoneNumber) => setPhoneNumber(phoneNumber)}
                      containerStyle={{ width: "100%" }}
                      inputStyle={{ width: "100%", height: "56px" }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CountryDropdown
                      value={country}
                      onChange={(val) => setCountry(val)}
                      required
                      style={{
                        width: "100%",
                        height: "56px",
                        padding: "18.5px 14px",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        fontSize: "1rem",
                        marginTop: "8px",
                      }}
                    />
                  </Grid>
                  {country === "Malaysia" ? (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="nricNumber"
                          label="NRIC Number"
                          name="nricNumber"
                          autoComplete="off"
                          value={nricNumber}
                          onChange={(e) => {
                            setNRICNumber(e.target.value);
                            setAge(getCurrentAge(e.target.value));
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          margin="normal"
                          fullWidth
                          id="calculatedAge"
                          label="Age"
                          name="calculatedAge"
                          value={age}
                          disabled
                        />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="passportNumber"
                          label="Passport Number"
                          name="passportNumber"
                          autoComplete="off"
                          value={passportNumber}
                          onChange={(e) => setPassportNumber(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="age"
                          label="Age"
                          name="age"
                          type="number"
                          autoComplete="off"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </Grid>
                    </>
                  )}
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
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
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
              </Box>
            </>
          )}
          {currentStep === 2 && (
            <>
              {" "}
              <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                <VaccinesIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Step 2 : Treatment Details
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  select
                  margin="normal"
                  required
                  fullWidth
                  id="diagnosis"
                  label="Diagnosis"
                  name="diagnosis"
                  autoComplete="off"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  sx={{ mt: 2, width: "100%", minWidth: 400 }}
                >
                  <MenuItem value="SPPTB">
                    Smear positive pulmonary tuberculosis (SPPTB)
                  </MenuItem>
                  <MenuItem value="SNTB">
                    Smear negative pulmonary tuberculosis (SNTB)
                  </MenuItem>
                  <MenuItem value="EXPTB">
                    Extrapulmonary tuberculosis (EXPTB)
                  </MenuItem>
                  <MenuItem value="LTBI">Latent TB infection (LTBI)</MenuItem>
                </TextField>
                <TextField
                  select
                  margin="normal"
                  required
                  fullWidth
                  id="treatment"
                  label="Current Treatment"
                  name="treatment"
                  autoComplete="off"
                  value={treatment}
                  onChange={(e) => {
                    setTreatment(e.target.value);
                    setNumberOfTablets("");
                  }}
                  sx={{ mt: 2, width: "100%", minWidth: 400 }}
                >
                  <MenuItem value="Akurit-4">
                    Akurit-4 (EHRZ Fixed dose combination)
                  </MenuItem>
                  <MenuItem value="Akurit">
                    Akurit (HR Fixed dose combination)
                  </MenuItem>
                  <MenuItem value="Pyridoxine10mg">Pyridoxine 10mg</MenuItem>
                </TextField>
                <TextField
                  select
                  margin="normal"
                  required
                  fullWidth
                  id="numberOfTablets"
                  label="Number of Tablets"
                  name="numberOfTablets"
                  autoComplete="off"
                  value={numberOfTablets}
                  onChange={(e) => setNumberOfTablets(e.target.value)}
                  sx={{ mt: 2, width: "100%", minWidth: 400 }}
                >
                  {[2, 3, 4, 5].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="treatmentStartMonth"
                  label="Treatment Start Month"
                  name="treatmentStartMonth"
                  type="month"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  value={treatmentStartMonth}
                  onChange={(e) => setTreatmentStartMonth(e.target.value)}
                  sx={{ mt: 2, width: "100%", minWidth: 400 }}
                />
              </Box>
            </>
          )}
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  onClick={handleBack}
                  variant="contained"
                  disabled={currentStep === 1}
                  fullWidth
                >
                  Back
                </Button>
              </Grid>
              <Grid item xs={6}>
        <Button variant="contained" type="submit" fullWidth>
          {currentStep < 2 ? "Next" : "Submit"}
        </Button>
      </Grid>
            </Grid>
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
