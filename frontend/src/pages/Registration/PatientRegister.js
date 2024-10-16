import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ThemeProvider,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  IconButton,
  InputAdornment,
  Alert,
  Dialog,
  MenuItem,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PhoneInput from "react-phone-input-2";
import { CountryDropdown } from "react-country-region-selector";
import "react-phone-input-2/lib/material.css";
import theme from "../../components/reusable/Theme";
import BgImage from "../../assets/cover.jpeg";
import axios from "../../components/axios";
import { useTranslation } from "react-i18next"; // Import useTranslation

export default function PatientRegister() {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize translation function
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
  const [treatmentStartDate, setTreatmentStartDate] = useState("");
  const [numberOfTablets, setNumberOfTablets] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [passwordError, setPasswordError] = useState({
    valid: true,
    message: "",
  });
  const [emailError, setEmailError] = useState({ valid: true, message: "" });
  const [nricError, setNricError] = useState({ valid: true, message: "" });
  const [diagnosisDate, setDiagnosisDate] = useState("");
  const [diagnosisDateError, setDiagnosisDateError] = useState({
    valid: true,
    message: "",
  });
  const [treatmentDuration, setTreatmentDuration] = useState("");

  const handleCloseAlert = () => {
    setAlertInfo({ show: false, type: "", message: "" });
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return {
        valid: false,
        message: t("patient_registration.password_requirements"),
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
        message: t("patient_registration.invalid_email"),
      };
    }
    return { valid: true, message: "" };
  };

  const handleEmailChange = () => {
    const validationResult = validateEmail(email);
    setEmailError(validationResult);
  };

  const validateNric = (nricNumber) => {
    if (country === "Malaysia" && nricNumber.length !== 12) {
      return {
        valid: false,
        message: t("patient_registration.nric_length_error"),
      };
    }
    return { valid: true, message: "" };
  };

  const handleNricChange = () => {
    const validationResult = validateNric(nricNumber);
    setNricError(validationResult);
    if (validationResult.valid) {
      setAge(getCurrentAge(nricNumber));
    }
  };

  const isFormValid = () => {
    return (
      emailError.valid &&
      passwordError.valid &&
      nricError.valid &&
      diagnosisDateError.valid
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Construct the user data object
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("gender", gender);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);
    formData.append("country", country);
    formData.append("age", age);
    formData.append("diagnosis", diagnosis);
    formData.append("currentTreatment", treatment);
    formData.append("diagnosisDate", diagnosisDate);
    formData.append("treatmentStartDate", treatmentStartDate);
    formData.append("treatmentDuration", treatmentDuration);
    formData.append("numberOfTablets", numberOfTablets);

    // Conditionally add NRIC or Passport Number based on the country
    if (country === "Malaysia") {
      formData.append("nricNumber", nricNumber);
    } else {
      formData.append("passportNumber", passportNumber);
    }

    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }

    try {
      // Send a POST request to the backend registration endpoint
      const response = await axios.post("/auth/registerPatient", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      // Registration was successful
      navigate("/register/success");
    } catch (error) {
      console.error(
        "Registration Error:",
        error.response?.data || error.message
      );
      // Handle registration errors
      setAlertInfo({
        show: true,
        type: "error",
        message:
          t("patient_registration.registration_failed") +
          (error.response?.data || error.message),
      });
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

  const handleProfilePictureUpload = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfilePicture(URL.createObjectURL(file)); // Set the profile picture for preview
      setSelectedFile(file);
    }
  };

  const validateDiagnosisDate = () => {
    if (!diagnosisDate || !treatmentStartDate) {
      setDiagnosisDateError({ valid: true, message: "" });
      return;
    }

    const diagnosisDateObj = new Date(diagnosisDate);
    const treatmentStartDateObj = new Date(treatmentStartDate);

    if (diagnosisDateObj > treatmentStartDateObj) {
      setDiagnosisDateError({
        valid: false,
        message: t("patient_registration.diagnosis_date_error"),
      });
    } else {
      setDiagnosisDateError({ valid: true, message: "" });
    }
  };

  useEffect(() => {
    validateDiagnosisDate();
  }, [diagnosisDate, treatmentStartDate]);

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
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 3,
            borderRadius: "15px",
            backgroundColor: "white",
            width: "100vh",
            maxWidth: "100%",
            marginTop: 8,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("patient_registration.title")}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Box
              sx={{
                width: "100%",
                borderTop: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                {t("patient_registration.personal_details")}
              </Typography>
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
                            {t("patient_registration.edit_photo")}
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
                          {t("patient_registration.upload_profile_picture")}
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
                    label={t("patient_registration.first_name")}
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
                    label={t("patient_registration.last_name")}
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
                    label={t("patient_registration.gender")}
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value=""></option>
                    <option value="male">
                      {t("patient_registration.male")}
                    </option>
                    <option value="female">
                      {t("patient_registration.female")}
                    </option>
                  </TextField>
                </Grid>

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
                    placeholder={t("patient_registration.phone_placeholder")}
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
                        label={t("patient_registration.nric_number")}
                        name="nricNumber"
                        autoComplete="off"
                        value={nricNumber}
                        onChange={(e) => setNRICNumber(e.target.value)} // Set value on change.
                        onBlur={handleNricChange} // Validate on blur.
                        error={!nricError.valid}
                        helperText={nricError.valid ? "" : nricError.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        margin="normal"
                        fullWidth
                        id="calculatedAge"
                        label={t("patient_registration.age")}
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
                        label={t("patient_registration.passport_number")}
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
                        label={t("patient_registration.age")}
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
                    label={t("patient_registration.email")}
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailChange}
                    error={!emailError.valid}
                    helperText={emailError.valid ? "" : emailError.message}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mb: 5 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={t("patient_registration.password")}
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
            </Box>

            <Typography variant="h6" sx={{ mt: 4, fontWeight: "bold" }}>
              {t("patient_registration.treatment_details")}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  margin="normal"
                  required
                  fullWidth
                  id="diagnosis"
                  label={t("patient_registration.diagnosis")}
                  name="diagnosis"
                  autoComplete="off"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  sx={{ mt: 2, width: "100%", minWidth: 400 }}
                >
                  <MenuItem value="SPPTB">
                    {t("patient_registration.spptb")}
                  </MenuItem>
                  <MenuItem value="SNTB">
                    {t("patient_registration.sntb")}
                  </MenuItem>
                  <MenuItem value="EXPTB">
                    {t("patient_registration.exptb")}
                  </MenuItem>
                  <MenuItem value="LTBI">
                    {t("patient_registration.ltbi")}
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  margin="normal"
                  required
                  fullWidth
                  id="treatment"
                  label={t("patient_registration.current_treatment")}
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
                    {t("patient_registration.akurit_4")}
                  </MenuItem>
                  <MenuItem value="Akurit">
                    {t("patient_registration.akurit")}
                  </MenuItem>
                  <MenuItem value="Pyridoxine10mg">
                    {t("patient_registration.pyridoxine")}
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  margin="normal"
                  required
                  fullWidth
                  id="numberOfTablets"
                  label={t("patient_registration.number_of_tablets")}
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
              </Grid>

              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="diagnosisDate"
                  label={t("patient_registration.diagnosis_date")}
                  name="diagnosisDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={diagnosisDate}
                  onChange={(e) => {
                    setDiagnosisDate(e.target.value);
                    validateDiagnosisDate();
                  }}
                  error={!diagnosisDateError.valid}
                  helperText={
                    diagnosisDateError.valid ? "" : diagnosisDateError.message
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="treatmentStartDate"
                  label={t("patient_registration.treatment_start_date")}
                  name="treatmentStartDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={treatmentStartDate}
                  onChange={(e) => {
                    setTreatmentStartDate(e.target.value);
                    validateDiagnosisDate();
                  }}
                  error={!diagnosisDateError.valid}
                  helperText={
                    diagnosisDateError.valid ? "" : diagnosisDateError.message
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="treatmentDuration"
                  label={t("patient_registration.treatment_duration")}
                  name="treatmentDuration"
                  type="number"
                  autoComplete="off"
                  value={treatmentDuration}
                  onChange={(e) => setTreatmentDuration(e.target.value)}
                  InputProps={{ inputProps: { min: 1 } }} // Ensure only positive values
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              // disabled={!isFormValid()}
            >
              {t("patient_registration.register_button")}
            </Button>
          </Box>
        </Paper>
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
