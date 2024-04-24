import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  Drawer,
  Box,
  Typography,
  IconButton,
  Paper,
  Container,
  Divider,
  Grid,
  TextField,
  Button,
  useMediaQuery,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  styled,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import theme from "../../components/reusable/Theme";
import PatientSidebar from "../../components/reusable/PatientBar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "../../components/axios";
import { format, isValid, parseISO } from "date-fns";
import { CountryDropdown } from "react-country-region-selector";

export default function PatientProfile() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [patientData, setPatientData] = useState({});
  const [sideEffectHistory, setSideEffectHistory] = useState([]);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
    nextAlert: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [errors, setErrors] = useState({
    currentPasswordError: "",
    newPasswordError: "",
    confirmNewPasswordError: "",
    emailError: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };
  const [isMalaysian, setIsMalaysian] = useState(
    patientData.country === "Malaysia"
  );

  const [editMode, setEditMode] = useState({
    personalInfo: false,
    treatmentDetails: false,
  });

  const [editableFields, setEditableFields] = useState({
    email: patientData.email || "",
    firstName: patientData.firstName || "",
    lastName: patientData.lastName || "",
    phoneNumber: patientData.phoneNumber || "",
    country: patientData.country || "",
    passportNumber: patientData.passportNumber || "",
    nricNumber: patientData.nricNumber || "",
    age: patientData.age || "",
    diagnosis: patientData.diagnosis || "",
    currentTreatment: patientData.currentTreatment || "",
    numberOfTablets: patientData.numberOfTablets || "",
    diagnosisDate: patientData.diagnosisDate || "",
    treatmentStartDate: patientData.treatmentStartDate || "",
    treatmentDuration: patientData.treatmentDuration || "",
  });

  const toggleEditMode = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFieldChange = (field, value) => {
    if (field === "email") {
      // Validate the email
      if (!validateEmail(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailError: "Please enter a valid email address.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailError: "",
        }));
      }
      setEditableFields((fields) => ({ ...fields, [field]: value }));
      return;
    }

    if (field === "country") {
      console.log("Updating country to:", value);

      const isMalaysia = value === "Malaysia";
      setIsMalaysian(isMalaysia);
      if (!isMalaysia) {
        setEditableFields((fields) => ({ ...fields, age: "" }));
      } else if (isMalaysia && editableFields.nricNumber) {
        const ageCalculated = calculateAgeFromNric(editableFields.nricNumber);
        setEditableFields((fields) => ({
          ...fields,
          age: ageCalculated.toString(),
        }));
      }
    }

    if (field === "nricNumber" && isMalaysian) {
      const ageCalculated = calculateAgeFromNric(value);
      setEditableFields((fields) => ({
        ...fields,
        [field]: value,
        age: ageCalculated.toString(),
      }));
    } else {
      setEditableFields((fields) => ({ ...fields, [field]: value }));
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

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleClickShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleClickShowConfirmNewPassword = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      const response = await axios.get("/users/profile");
      console.log("Patient data", response.data);
      setPatientData(response.data);
      setIsMalaysian(response.data.country === "Malaysia");

      const formattedDiagnosisDate = response.data.diagnosisDate
        ? format(parseISO(response.data.diagnosisDate), "yyyy-MM-dd")
        : "";
      const formattedTreatmentStartDate = response.data.treatmentStartDate
        ? format(parseISO(response.data.treatmentStartDate), "yyyy-MM-dd")
        : "";

      // Initialize editableFields with fetched patient data
      setEditableFields({
        email: response.data.email || "",
        firstName: response.data.firstName || "",
        lastName: response.data.lastName || "",
        phoneNumber: response.data.phoneNumber || "",
        country: response.data.country || "",
        age: response.data.age || "",
        gender: response.data.gender || "",
        passportNumber: response.data.passportNumber || "",
        nricNumber: response.data.nricNumber || "",
        diagnosis: response.data.diagnosis || "",
        currentTreatment: response.data.currentTreatment || "",
        numberOfTablets: response.data.numberOfTablets || "",
        diagnosisDate: formattedDiagnosisDate,
        treatmentStartDate: formattedTreatmentStartDate,
        treatmentDuration: response.data.treatmentDuration || "",
      });
    } catch (error) {
      console.error("Failed to fetch patient data:", error);
      if (error.response && error.response.data) {
        console.error("Error details:", error.response.data);
      }
    }
  };

  useEffect(() => {
    // Whenever patientData changes, update editableFields with the new data
    setEditableFields({
      email: patientData.email || "",
      firstName: patientData.firstName || "",
      lastName: patientData.lastName || "",
      phoneNumber: patientData.phoneNumber || "",
      country: patientData.country || "",
      gender: patientData.gender || "",
      age: patientData.age || "",
      passportNumber: patientData.passportNumber || "",
      nricNumber: patientData.nricNumber || "",
      diagnosis: patientData.diagnosis || "",
      currentTreatment: patientData.currentTreatment || "",
      numberOfTablets: patientData.numberOfTablets || "",
      diagnosisDate: patientData.diagnosisDate || "",
      treatmentStartDate: patientData.treatmentStartDate || "",
      treatmentDuration: patientData.treatmentDuration || "",
    });
  }, [patientData]);

  const capitalizeFirstLetter = (string) => {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    if (isValid(date)) {
      return format(date, "dd-MM-yyyy");
    }
    return "Invalid date";
  };

  const handleOpenPasswordDialog = () => {
    setPasswordDialogOpen(true);
  };

  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
  };

  const handleChangePassword = async () => {
    setErrors({
      currentPasswordError: "",
      newPasswordError: "",
      confirmNewPasswordError: "",
    });

    if (!validatePassword(newPassword)) {
      setErrors((prev) => ({
        ...prev,
        newPasswordError: "Password is too weak.",
      }));
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmNewPasswordError: "New passwords do not match.",
      }));
      return;
    }

    try {
      const response = await axios.post("/users/changePassword", {
        currentPassword,
        newPassword,
      });
      // Display a success message
      setAlertInfo({
        show: true,
        type: "success",
        message: "Password changed successfully.",
      });
      handleClosePasswordDialog();
      // Reset password input fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      // Display an error message to the user
      setAlertInfo({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Failed to change password.",
      });
    }
  };

  useEffect(() => {
    const fetchSideEffectHistory = async () => {
      try {
        const response = await axios.get(`/sideEffects/patient`);
        setSideEffectHistory(response.data);
      } catch (error) {
        console.error(
          "Error fetching side effect history:",
          error.response?.data || error.message
        );
      }
    };
    fetchSideEffectHistory();
  }, []);

  const updateProfile = async (fieldsToUpdate) => {
    try {
      await axios.put("/users/profile", fieldsToUpdate);
      fetchPatientData();
      const updateEvent = new CustomEvent("profileUpdated");
      window.dispatchEvent(updateEvent);
      setAlertInfo({
        show: true,
        type: "success",
        message: "Profile updated successfully.",
      });
      setEditMode((prev) => ({ ...prev, personalInfo: false })); // Exit edit mode
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlertInfo({
        show: true,
        type: "error",
        message:
          error.response?.data?.message ||
          "An error occurred while updating the profile.",
      });
    }
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log("No file selected.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setShowPreviewDialog(true);
  };

  const handleSaveNewProfilePicture = async () => {
    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);

    try {
      const response = await axios.put(
        `/users/uploadProfilePicture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setAlertInfo({
          show: true,
          type: "success",
          message: "Profile picture updated successfully.",
        });
        fetchPatientData();
        setShowPreviewDialog(false);
        // Dispatch the custom event to notify other components of the update
        window.dispatchEvent(new CustomEvent("profileUpdated"));
      }
    } catch (error) {
      console.error("Failed to update profile picture:", error);
      setAlertInfo({
        show: true,
        type: "error",
        message:
          error.response?.data?.message || "Failed to update profile picture.",
      });
    }
  };

  const handleCancelProfilePictureChange = () => {
    setShowPreviewDialog(false);
    setPreviewUrl("");
    setSelectedFile(null);
  };

  const calculateAgeFromNric = (nric) => {
    if (!nric || nric.length < 6) return "";

    const currentYear = new Date().getFullYear();
    let birthYearPrefix = currentYear >= 2000 ? 19 : 20;
    let birthYear = parseInt(nric.substring(0, 2), 10);
    birthYear += birthYear <= currentYear % 100 ? 2000 : 1900;

    return currentYear - birthYear;
  };

  const diagnosisOptions = {
    SPPTB: "Smear positive pulmonary tuberculosis (SPPTB)",
    SNTB: "Smear negative pulmonary tuberculosis (SNTB)",
    EXPTB: "Extrapulmonary tuberculosis (EXPTB)",
    LTBI: "Latent TB infection (LTBI)",
  };

  const treatmentOptions = {
    "Akurit-4": "Akurit-4 (EHRZ Fixed dose combination)",
    Akurit: "Akurit (HR Fixed dose combination)",
    Pyridoxine: "Pyridoxine 10mg",
  };

  const tabletOptions = [2, 3, 4, 5];

  const hasTreatmentEnded = () => {
    if (!patientData.treatmentEndDate) return false;
    const treatmentEndDate = new Date(patientData.treatmentEndDate);
    const today = new Date();
    return treatmentEndDate < today;
  };

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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Patient Profile Section */}
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{ p: 3, display: "flex", alignItems: "center" }}
              >
                <Box sx={{ position: "relative", marginRight: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 100,
                      height: 100,
                    }}
                  >
                    {patientData.profilePicture ? (
                      <img
                        src={patientData.profilePicture}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <AccountCircleIcon sx={{ fontSize: 100 }} />
                    )}
                  </Avatar>
                  <IconButton
                    color="primary"
                    component="label"
                    sx={{
                      position: "absolute",
                      right: 0,
                      bottom: 0,
                      backgroundColor: "background.paper",
                      "&:hover": {
                        backgroundColor: "background.default",
                      },
                      borderRadius: "50%",
                    }}
                  >
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleProfilePictureChange}
                    />
                    <PhotoCamera />
                  </IconButton>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {patientData.firstName} {patientData.lastName}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", mb: 2, fontSize: "1rem" }}
                  >
                    {" "}
                    Status:{" "}
                    {hasTreatmentEnded()
                      ? "Treatment Ended"
                      : patientData.careStatus || "Not Set"}
                  </Typography>

                  <Divider sx={{ my: 2 }} />
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleOpenPasswordDialog}
                    sx={{ textTransform: "none" }}
                  >
                    Change Password
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, position: "relative" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Personal Information
                </Typography>
                {!editMode.personalInfo && (
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={() =>
                      setEditMode({
                        ...editMode,
                        personalInfo: !editMode.personalInfo,
                      })
                    }
                  >
                    <EditIcon />
                  </IconButton>
                )}
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  {/* First Name */}
                  <ListItem>
                    <ListItemText
                      primary="First Name"
                      secondary={
                        editMode.personalInfo ? (
                          <TextField
                            variant="outlined"
                            size="small"
                            value={editableFields.firstName}
                            onChange={(e) =>
                              handleFieldChange("firstName", e.target.value)
                            }
                            fullWidth
                          />
                        ) : (
                          patientData.firstName || "N/A"
                        )
                      }
                    />
                  </ListItem>

                  {/* Last Name */}
                  <ListItem>
                    <ListItemText
                      primary="Last Name"
                      secondary={
                        editMode.personalInfo ? (
                          <TextField
                            variant="outlined"
                            size="small"
                            value={editableFields.lastName}
                            onChange={(e) =>
                              handleFieldChange("lastName", e.target.value)
                            }
                            fullWidth
                          />
                        ) : (
                          patientData.lastName || "N/A"
                        )
                      }
                    />
                  </ListItem>

                  {/* Email */}
                  <ListItem>
                    <ListItemText
                      primary="Email"
                      secondary={
                        editMode.personalInfo ? (
                          <TextField
                            error={!!errors.emailError}
                            helperText={errors.emailError}
                            variant="outlined"
                            size="small"
                            value={editableFields.email}
                            onChange={(e) =>
                              handleFieldChange("email", e.target.value)
                            }
                            fullWidth
                          />
                        ) : (
                          patientData.email || "N/A"
                        )
                      }
                    />
                  </ListItem>

                  {/* Gender */}
                  <ListItem>
                    <ListItemText
                      primary="Gender"
                      secondary={
                        editMode.personalInfo ? (
                          <TextField
                            select
                            variant="outlined"
                            size="small"
                            value={editableFields.gender}
                            onChange={(e) =>
                              handleFieldChange("gender", e.target.value)
                            }
                            fullWidth
                          >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                          </TextField>
                        ) : (
                          capitalizeFirstLetter(patientData.gender) || "N/A"
                        )
                      }
                    />
                  </ListItem>

                  {/* Phone Number */}
                  <ListItem>
                    <ListItemText
                      primary="Phone Number"
                      secondary={
                        editMode.personalInfo ? (
                          <TextField
                            variant="outlined"
                            size="small"
                            value={editableFields.phoneNumber}
                            onChange={(e) =>
                              handleFieldChange("phoneNumber", e.target.value)
                            }
                            fullWidth
                          />
                        ) : (
                          patientData.phoneNumber || "N/A"
                        )
                      }
                    />
                  </ListItem>

                  {/* Country */}
                  <ListItem>
                    <ListItemText
                      primary="Country"
                      secondary={
                        editMode.personalInfo ? (
                          <CountryDropdown
                            value={editableFields.country}
                            onChange={(val) =>
                              handleFieldChange("country", val)
                            }
                            style={{
                              width: "100%",
                              height: "40px",
                              borderRadius: "4px",
                              backgroundColor: "white",
                              border: "1px solid #ced4da",
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                            }}
                          />
                        ) : (
                          patientData.country || "N/A"
                        )
                      }
                    />
                  </ListItem>

                  {/* Conditional Passport Number or NRIC Number */}
                  <ListItem>
                    <ListItemText
                      primary={isMalaysian ? "NRIC Number" : "Passport Number"}
                      secondary={
                        editMode.personalInfo ? (
                          <TextField
                            variant="outlined"
                            size="small"
                            value={
                              isMalaysian
                                ? editableFields.nricNumber
                                : editableFields.passportNumber
                            }
                            onChange={(e) =>
                              handleFieldChange(
                                isMalaysian ? "nricNumber" : "passportNumber",
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        ) : isMalaysian ? (
                          patientData.nricNumber || "N/A"
                        ) : (
                          patientData.passportNumber || "N/A"
                        )
                      }
                    />
                  </ListItem>

                  {/* Age */}
                  <ListItem>
                    <ListItemText
                      primary="Age"
                      secondary={
                        isMalaysian ? (
                          `${editableFields.age} `
                        ) : editMode.personalInfo ? (
                          <TextField
                            variant="outlined"
                            size="small"
                            value={editableFields.age}
                            onChange={(e) =>
                              handleFieldChange("age", e.target.value)
                            }
                            fullWidth
                          />
                        ) : (
                          `${patientData.age} `
                        )
                      }
                    />
                  </ListItem>
                </List>
                {editMode.personalInfo && (
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                  >
                    <Button
                      sx={{ mr: 1 }}
                      variant="contained"
                      onClick={() => {
                        const fieldsToUpdate = {
                          firstName: editableFields.firstName,
                          lastName: editableFields.lastName,
                          email: editableFields.email,
                          gender: editableFields.gender,
                          age: editableFields.age,
                          phoneNumber: editableFields.phoneNumber,
                          country: editableFields.country,
                          ...(editableFields.passportNumber
                            ? { passportNumber: editableFields.passportNumber }
                            : {}),
                          ...(editableFields.nricNumber
                            ? { nricNumber: editableFields.nricNumber }
                            : {}),
                        };

                        updateProfile(fieldsToUpdate);
                        console.log(
                          "Saving Personal Information...",
                          fieldsToUpdate
                        );
                        setEditMode({ ...editMode, personalInfo: false });
                      }}
                      disabled={!!errors.emailError}
                    >
                      Save
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() =>
                        setEditMode({ ...editMode, personalInfo: false })
                      }
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Treatment Details */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, position: "relative" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Treatment Details
                </Typography>
                {!editMode.treatmentDetails && (
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={() => toggleEditMode("treatmentDetails")}
                  >
                    <EditIcon />
                  </IconButton>
                )}
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  {/* Diagnosis Dropdown */}
                  <ListItem>
                    <ListItemText
                      primary="Diagnosis"
                      secondary={
                        editMode.treatmentDetails ? (
                          <TextField
                            select
                            variant="outlined"
                            size="small"
                            value={editableFields.diagnosis}
                            onChange={(e) =>
                              handleFieldChange("diagnosis", e.target.value)
                            }
                            fullWidth
                          >
                            {Object.entries(diagnosisOptions).map(
                              ([value, label]) => (
                                <MenuItem key={value} value={value}>
                                  {label}
                                </MenuItem>
                              )
                            )}
                          </TextField>
                        ) : (
                          diagnosisOptions[patientData.diagnosis] || "N/A"
                        )
                      }
                    />
                  </ListItem>

                  {/* Current Treatment Dropdown */}
                  <ListItem>
                    <ListItemText
                      primary="Current Treatment"
                      secondary={
                        editMode.treatmentDetails ? (
                          <TextField
                            select
                            variant="outlined"
                            size="small"
                            value={editableFields.currentTreatment}
                            onChange={(e) =>
                              handleFieldChange(
                                "currentTreatment",
                                e.target.value
                              )
                            }
                            fullWidth
                          >
                            {Object.entries(treatmentOptions).map(
                              ([value, label]) => (
                                <MenuItem key={value} value={value}>
                                  {label}
                                </MenuItem>
                              )
                            )}
                          </TextField>
                        ) : (
                          treatmentOptions[patientData.currentTreatment] ||
                          "N/A"
                        )
                      }
                    />
                  </ListItem>

                  {/* Number of Tablets Dropdown */}
                  <ListItem>
                    <ListItemText
                      primary="Number of Tablets"
                      secondary={
                        editMode.treatmentDetails ? (
                          <TextField
                            select
                            variant="outlined"
                            size="small"
                            value={editableFields.numberOfTablets}
                            onChange={(e) =>
                              handleFieldChange(
                                "numberOfTablets",
                                e.target.value
                              )
                            }
                            fullWidth
                          >
                            {tabletOptions.map((value) => (
                              <MenuItem key={value} value={value}>
                                {value}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : (
                          patientData.numberOfTablets || "N/A"
                        )
                      }
                    />
                  </ListItem>

                  {/* Diagnosis Date */}
                  <ListItem>
                    <ListItemText
                      primary="Diagnosis Date"
                      secondary={
                        editMode.treatmentDetails ? (
                          <TextField
                            type="date"
                            variant="outlined"
                            size="small"
                            value={editableFields.diagnosisDate || ""}
                            onChange={(e) =>
                              handleFieldChange("diagnosisDate", e.target.value)
                            }
                            fullWidth
                          />
                        ) : (
                          formatDate(patientData.diagnosisDate) || "N/A"
                        )
                      }
                    />
                  </ListItem>
                  {/* Treatment Start Date */}
                  <ListItem>
                    <ListItemText
                      primary="Treatment Start Date"
                      secondary={
                        editMode.treatmentDetails ? (
                          <TextField
                            type="date"
                            variant="outlined"
                            size="small"
                            value={editableFields.treatmentStartDate || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                "treatmentStartDate",
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        ) : (
                          formatDate(patientData.treatmentStartDate) || "N/A"
                        )
                      }
                    />
                  </ListItem>

                  {/* Treatment Duration Number Input */}
                  <ListItem>
                    <ListItemText
                      primary="Treatment Duration (months)"
                      secondary={
                        editMode.treatmentDetails ? (
                          <TextField
                            type="number"
                            variant="outlined"
                            size="small"
                            value={editableFields.treatmentDuration}
                            onChange={(e) =>
                              handleFieldChange(
                                "treatmentDuration",
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        ) : (
                          patientData.treatmentDuration || "N/A"
                        )
                      }
                    />
                  </ListItem>
                </List>
                {editMode.treatmentDetails && (
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mr: 1 }}
                      onClick={() => {
                        // Function to update the profile with treatment details
                        updateProfile({
                          diagnosis: editableFields.diagnosis,
                          currentTreatment: editableFields.currentTreatment,
                          numberOfTablets: editableFields.numberOfTablets,
                          diagnosisDate: editableFields.diagnosisDate,
                          treatmentStartDate: editableFields.treatmentStartDate,
                          treatmentDuration: editableFields.treatmentDuration,
                        });
                        toggleEditMode("treatmentDetails");
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        toggleEditMode("treatmentDetails");
                        // Optionally reset editable fields to initial values
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* side effect history */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Side Effect History
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#0046c0" }}>
                        <TableCell sx={{ color: "white" }}>
                          Date and Time
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          Side Effects
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sideEffectHistory.map((report, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {format(
                              parseISO(report.datetime),
                              "d MMMM yyyy, h:mm a"
                            )}
                          </TableCell>
                          <TableCell>
                            {report.sideEffects
                              ? report.sideEffects
                                  .map((effect) =>
                                    effect.effect === "Others (Please Describe)"
                                      ? effect.description // Display description for "Others (Please Describe)"
                                      : `${effect.effect} (Grade ${effect.grade})`
                                  )
                                  .join(", ")
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Dialog open={passwordDialogOpen} onClose={handleClosePasswordDialog}>
        <DialogTitle>
          Change Password
          <IconButton
            aria-label="close"
            onClick={handleClosePasswordDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="current-password"
            label="Current Password"
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            variant="outlined"
            error={!!errors.currentPasswordError}
            helperText={errors.currentPasswordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle current password visibility"
                    onClick={handleClickShowCurrentPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            id="new-password"
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            variant="outlined"
            error={!!errors.newPasswordError}
            helperText={errors.newPasswordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle new password visibility"
                    onClick={handleClickShowNewPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            id="confirm-new-password"
            label="Confirm New Password"
            type={showConfirmNewPassword ? "text" : "password"}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            fullWidth
            variant="outlined"
            error={!!errors.confirmNewPasswordError}
            helperText={errors.confirmNewPasswordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm new password visibility"
                    onClick={handleClickShowConfirmNewPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showConfirmNewPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog}>Cancel</Button>
          <Button onClick={handleChangePassword}>Update</Button>
        </DialogActions>
      </Dialog>
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
      <Dialog
        open={showPreviewDialog}
        onClose={handleCancelProfilePictureChange}
      >
        <DialogTitle>Change Profile Picture</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: 400 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelProfilePictureChange}>Cancel</Button>
          <Button onClick={handleSaveNewProfilePicture} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
