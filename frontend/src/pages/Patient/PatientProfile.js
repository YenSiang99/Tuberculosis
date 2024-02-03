import React, { useState } from "react";
import {
  ThemeProvider,
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
  FormGroup,
  Paper,
  Container,
  Divider,
  IconButton,
  useMediaQuery,
  Avatar,
  Grid,
  MenuItem,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import MenuIcon from "@mui/icons-material/Menu";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import theme from "../../components/reusable/Theme";
import PatientSidebar from "../../components/reusable/PatientBar";
import { CountryDropdown } from "react-country-region-selector";

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: "#fff",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
  cardActions: {
    justifyContent: "flex-end",
    display: "flex",
  },
  button: {
    color: "#fff",
    "&:hover": {
      backgroundColor: "#6386C3",
    },
  },
  actionButton: {
    flexGrow: 1, // This makes each button take equal space
  },
}));

export default function PatientSetting() {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [profilePicture, setProfilePicture] = useState("defaultProfilePicUrl"); // Default profile picture URL
  const [treatmentStartMonth, setTreatmentStartMonth] = useState("");

  // Function to toggle drawer
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    gender: "Male",
    phoneNumber: "0123456789",
    country: "Malaysia",
    icOrPassportNumber: "010101080909",
    age: "23",
  });

  const [medicalInfo, setMedicalInfo] = useState({
    diagnosis: "Condition X",
    treatment: "Treatment Y",
    numberOfTablets: 3,
    treatmentStartMonth: "January 2023",
  });

  const [personalInfoEditable, setPersonalInfoEditable] = useState(false);
  const [medicalInfoEditable, setMedicalInfoEditable] = useState(false);

  const handleProfileChange = (e, infoType) => {
    const { name, value } = e.target;

    if (infoType === "personal") {
      let updatedInfo = { ...personalInfo, [name]: value };

      // Automatically calculate age if the country is Malaysia and the field is IC number
      if (
        name === "icOrPassportNumber" &&
        personalInfo.country === "Malaysia"
      ) {
        updatedInfo.age = getCurrentAge(value);
      }

      setPersonalInfo(updatedInfo);
    } else if (infoType === "medical") {
      setMedicalInfo({ ...medicalInfo, [name]: value });
    }
  };

  const togglePersonalInfoEdit = () => {
    setPersonalInfoEditable(!personalInfoEditable);
  };

  const toggleMedicalInfoEdit = () => {
    setMedicalInfoEditable(!medicalInfoEditable);
  };

  const ProfileView = ({ label, value }) => {
    // Determine the correct label for IC or Passport number
    if (label === "icOrPassportNumber") {
      label =
        personalInfo.country === "Malaysia" ? "IC Number" : "Passport Number";
    } else {
      label = splitCamelCaseToString(label);
    }

    return (
      <Typography variant="body1" gutterBottom>
        <strong>{label}:</strong> {value}
      </Typography>
    );
  };

  const splitCamelCaseToString = (s) => {
    const knownAcronyms = ["IC"];

    return s
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
      .split(" ")
      .map((word) => {
        if (knownAcronyms.includes(word.toUpperCase())) {
          return word.toUpperCase();
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
      })
      .join(" ");
  };

  const handleCancelEdit = () => {
    setPersonalInfoEditable(false);
    setMedicalInfoEditable(false);
  };

  // Function to handle profile picture change
  const handleProfilePictureChange = (event) => {
    // Implement logic to handle profile picture change
    // e.g., setProfilePicture(event.target.files[0]);
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

  const diagnosisOptions = [
    { value: "SPPTB", label: "Smear positive pulmonary tuberculosis (SPPTB)" },
    { value: "SNTB", label: "Smear negative pulmonary tuberculosis (SNTB)" },
    { value: "EXPTB", label: "Extrapulmonary tuberculosis (EXPTB)" },
    { value: "LTBI", label: "Latent TB infection (LTBI)" },
  ];

  const treatmentOptions = [
    { value: "Akurit-4", label: "Akurit-4 (EHRZ Fixed dose combination)" },
    { value: "Akurit", label: "Akurit (HR Fixed dose combination)" },
    { value: "Pyridoxine10mg", label: "Pyridoxine 10mg" },
  ];

  const numberOfTabletsOptions = [2, 3, 4, 5];

  return (
    <ThemeProvider theme={theme}>
      {matchesSM && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            m: 1,
            display: { sm: "block", md: "none" },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={matchesSM ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <PatientSidebar handleDrawerToggle={handleDrawerToggle} />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: "240px", md: "240px" },
          backgroundColor: "background.default",
        }}
      >
        <Container>
          <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 5 }}>
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                component="div"
                sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
              >
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {!personalInfoEditable ? (
                <Avatar
                  src={profilePicture}
                  alt="Profile Picture"
                  sx={{ width: 100, height: 100, mb: 2, mx: "auto" }}
                />
              ) : (
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Avatar
                    src={profilePicture}
                    alt="Profile Picture"
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: "primary.main",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                    size="small"
                    onClick={() => {
                      /* Implement function to upload new picture */
                    }}
                  >
                    <CameraAltIcon />
                  </IconButton>
                </Box>
              )}

              {personalInfoEditable ? (
                <FormGroup>
                  <Grid container spacing={2}>
                    {/* First Name and Last Name as Text Fields */}
                    <Grid item xs={12}>
                      <TextField
                        label="First Name"
                        name="firstName"
                        value={personalInfo.firstName}
                        onChange={handleProfileChange}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Last Name"
                        name="lastName"
                        value={personalInfo.lastName}
                        onChange={handleProfileChange}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>

                    {/* Gender as Dropdown */}
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Gender"
                        name="gender"
                        value={personalInfo.gender}
                        onChange={handleProfileChange}
                        margin="normal"
                        fullWidth
                      >
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                      </TextField>
                    </Grid>

                    {/* Phone Number */}
                    <Grid item xs={12}>
                      <PhoneInput
                        country={"us"}
                        value={personalInfo.phoneNumber}
                        onChange={(phone) =>
                          setPersonalInfo({
                            ...personalInfo,
                            phoneNumber: phone,
                          })
                        }
                        containerStyle={{ width: "100%" }}
                        inputStyle={{ width: "100%", height: "56px" }}
                      />
                    </Grid>

                    {/* Country as Dropdown */}
                    <Grid item xs={12}>
                      <CountryDropdown
                        value={personalInfo.country}
                        onChange={(val) =>
                          setPersonalInfo({ ...personalInfo, country: val })
                        }
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

                    {/* IC Number for Malaysian users, Passport Number for others */}
                    {personalInfo.country === "Malaysia" ? (
                      <Grid item xs={12}>
                        <TextField
                          label="IC Number"
                          name="icOrPassportNumber"
                          value={personalInfo.icOrPassportNumber}
                          onChange={handleProfileChange}
                          margin="normal"
                          fullWidth
                        />
                      </Grid>
                    ) : (
                      <Grid item xs={12}>
                        <TextField
                          label="Passport Number"
                          name="icOrPassportNumber"
                          value={personalInfo.icOrPassportNumber}
                          onChange={handleProfileChange}
                          margin="normal"
                          fullWidth
                        />
                      </Grid>
                    )}
                  </Grid>

                  {/* Age Field */}
                  {personalInfo.country === "Malaysia" ? (
                    <Grid item xs={12}>
                      <TextField
                        label="Age"
                        name="age"
                        value={personalInfo.age}
                        margin="normal"
                        fullWidth
                        disabled
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <TextField
                        label="Age"
                        name="age"
                        value={personalInfo.age}
                        onChange={(e) => handleProfileChange(e, "personal")}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                  )}
                </FormGroup>
              ) : (
                Object.entries(personalInfo)
                  .slice(0, 7)
                  .map(([key, value]) => (
                    <ProfileView key={key} label={key} value={value} />
                  ))
              )}

              <Button
                className={`${classes.actionButton} ${
                  personalInfoEditable ? classes.saveButton : classes.button
                }`}
                color="primary"
                variant="contained"
                onClick={togglePersonalInfoEdit}
                sx={{ mr: 2 }}
              >
                {personalInfoEditable ? "Save Changes" : "Edit"}
              </Button>
              {personalInfoEditable && (
                <Button
                  className={`${classes.actionButton} ${classes.cancelButton}`}
                  variant="outlined"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Paper>
        </Container>

        <Container>
          <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 5 }}>
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                component="div"
                sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
              >
                Treatment Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {medicalInfoEditable ? (
                <FormGroup>
                  <Grid container spacing={2}>
                    {/* Diagnosis Dropdown */}
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Diagnosis"
                        name="diagnosis"
                        value={medicalInfo.diagnosis}
                        onChange={(e) => handleProfileChange(e, "medical")}
                        margin="normal"
                        fullWidth
                      >
                        {diagnosisOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    {/* Treatment Dropdown */}
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Current Treatment"
                        name="treatment"
                        value={medicalInfo.treatment}
                        onChange={(e) => handleProfileChange(e, "medical")}
                        margin="normal"
                        fullWidth
                      >
                        {treatmentOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    {/* Number of Tablets Dropdown */}
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Number of Tablets"
                        name="numberOfTablets"
                        value={medicalInfo.numberOfTablets}
                        onChange={(e) => handleProfileChange(e, "medical")}
                        margin="normal"
                        fullWidth
                      >
                        {numberOfTabletsOptions.map((num) => (
                          <MenuItem key={num} value={num}>
                            {num}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
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
                    </Grid>
                  </Grid>
                </FormGroup>
              ) : (
                Object.entries(medicalInfo).map(([key, value]) => (
                  <ProfileView key={key} label={key} value={value} />
                ))
              )}
              <Button
                className={`${classes.actionButton} ${
                  medicalInfoEditable ? classes.saveButton : classes.button
                }`}
                color="primary"
                variant="contained"
                onClick={toggleMedicalInfoEdit}
                sx={{ mr: 2 }}
              >
                {medicalInfoEditable ? "Save Changes" : "Edit"}
              </Button>
              {medicalInfoEditable && (
                <Button
                  className={`${classes.actionButton} ${classes.cancelButton}`}
                  variant="outlined"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Paper>
        </Container>
        
      </Box>
    </ThemeProvider>
  );
}
