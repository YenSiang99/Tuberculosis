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
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import PhoneInput from "react-phone-input-2";
import { CountryDropdown } from "react-country-region-selector";
import "react-phone-input-2/lib/material.css";
import theme from "./reusable/Theme";
import BgImage from "./image/cover.jpeg";

export default function PatientRegister() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [icNumber, setICNumber] = useState("");
  const [gender, setGender] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [age, setAge] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();

    if (icNumber.length !== 12) {
      alert("IC Number must have exactly 12 digits.");
      return; // Prevent further processing if validation fails
    }

    // Collect and log all the values
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("IC Number:", icNumber);
    console.log("Nationality:", country);
    console.log("Gender:", gender);
    console.log("Phone Number:", phone);
  };

  const handleRegisterNext = () => navigate("/register/patient_2");

  // Function to handle profile picture change
  const handleProfilePictureChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePicture(URL.createObjectURL(event.target.files[0]));
    }
  };

  const getCurrentAge = (icNumber) => {
    if (icNumber.length < 6) return ""; // Ensure the IC number is long enough

    const currentYear = new Date().getFullYear();
    let birthYear = parseInt(icNumber.substring(0, 2), 10);
    const currentYearLastTwoDigits = parseInt(
      currentYear.toString().substring(2, 4),
      10
    );

    birthYear += birthYear > currentYearLastTwoDigits ? 1900 : 2000;
    return currentYear - birthYear; // Return age
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
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
          Step 1: Personal Details
          </Typography>
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
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
                  country={"us"}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  containerStyle={{ width: "100%" }}
                  inputStyle={{ width: "100%", height: "56px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <CountryDropdown
                  value={country}
                  onChange={(val) => setCountry(val)}
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
                      id="icNumber"
                      label="IC Number"
                      name="icNumber"
                      autoComplete="off"
                      value={icNumber}
                      onChange={(e) => {
                        setICNumber(e.target.value);
                        setAge(getCurrentAge(e.target.value)); // Calculate and set age
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
            </Grid>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2, marginLeft: "auto" }}
              onClick={handleRegisterNext}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
