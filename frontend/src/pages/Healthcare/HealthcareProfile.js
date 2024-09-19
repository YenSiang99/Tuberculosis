import React, { useState, useEffect } from "react";
import {
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
  Alert,
  styled,
  InputAdornment,
  MenuItem,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import theme from "../../components/reusable/Theme";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import VideocamIcon from "@mui/icons-material/Videocam";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { green, blue, red, orange } from "@mui/material/colors";
import axios from "../../components/axios";

export default function HealthcareProfile() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [healthcareData, setHealthcareData] = useState({});
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
  const [isMissedVideosDialogOpen, setIsMissedVideosDialogOpen] =
    useState(false);
  const [missedVideosData, setMissedVideosData] = useState({
    totalMissedVideos: 0,
    patientMissedVideosDetails: [],
  });
  const [errors, setErrors] = useState({
    currentPasswordError: "",
    newPasswordError: "",
    confirmNewPasswordError: "",
    emailError: "",
  });

  const [videoStats, setVideoStats] = useState({
    submitted: 0,
    approved: 0,
    rejected: 0,
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const capitalizeFirstLetter = (string) => {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
  };

  const [editMode, setEditMode] = useState({
    personalInfo: false,
  });

  const [editableFields, setEditableFields] = useState({
    email: healthcareData.email || "",
    firstName: healthcareData.firstName || "",
    lastName: healthcareData.lastName || "",
    mcpId: healthcareData.mcpId || "",
    group: healthcareData.group || "",
  });

  const toggleEditMode = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFieldChange = (field, value) => {
    setEditableFields((fields) => ({ ...fields, [field]: value }));

    if (field === "email") {
      // Validate the email
      if (!validateEmail(value)) {
        // If email is not valid, set an error message
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailError: "Please enter a valid email address.",
        }));
      } else {
        // If email is valid, clear any existing error message
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailError: "",
        }));
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
    fetchHealthcareData();
  }, []);

  const fetchHealthcareData = async () => {
    try {
      const response = await axios.get("/users/profile");
      console.log("Healthcare data", response.data);
      setHealthcareData(response.data);

      setEditableFields({
        email: response.data.email || "",
        firstName: response.data.firstName || "",
        lastName: response.data.lastName || "",
        mcpId: response.data.mcpId || "",
        group: response.data.group || "",
      });
    } catch (error) {
      console.error("Failed to fetch healthcare data:", error.response.data);
    }
  };

  useEffect(() => {
    setEditableFields({
      email: healthcareData.email || "",
      firstName: healthcareData.firstName || "",
      lastName: healthcareData.lastName || "",
      mcpId: healthcareData.mcpId || "",
      group: healthcareData.group || "",
    });
  }, [healthcareData]);

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

  const updateProfile = async (fieldsToUpdate) => {
    try {
      await axios.put("/users/profile", fieldsToUpdate);
      fetchHealthcareData();
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
        fetchHealthcareData();
        setShowPreviewDialog(false);
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

  // Enhanced metric card component
  const StatCard = ({ icon, title, value, color, actionIcon }) => {
    return (
      <Card
        elevation={3}
        sx={{
          bgcolor: color,
          color: "#fff",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            {icon}
            <Typography fontSize="1.1rem" sx={{ my: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
        </CardContent>
        {actionIcon && (
          <Box sx={{ position: "absolute", top: 0, right: 0, p: 1 }}>
            {actionIcon}
          </Box>
        )}
      </Card>
    );
  };

  const getCurrentMonthAndYear = () => {
    const date = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentMonth = monthNames[date.getMonth()];
    const currentYear = date.getFullYear();
    return `${currentMonth} ${currentYear}`;
  };

  useEffect(() => {
    const fetchVideoStats = async () => {
      try {
        const { data } = await axios.get("/videos/stats", {
          params: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
          },
        });
        setVideoStats(data);
      } catch (error) {
        console.error("Failed to fetch video statistics:", error.response.data);
      }
    };

    fetchVideoStats();
  }, []);

  useEffect(() => {
    const fetchMissedVideosData = async () => {
      try {
        const response = await axios.get("/videos/totalMissedVideos", {
          params: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1, // Adjust month to 1-indexed
          },
        });
        setMissedVideosData(response.data);
      } catch (error) {
        console.error("Failed to fetch missed videos data:", error);
        // Handle error appropriately
      }
    };

    fetchMissedVideosData();
  }, []);

  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Grid container spacing={3}>
        {/* Healthcare Profile Section */}
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
                {healthcareData.profilePicture ? (
                  <img
                    src={healthcareData.profilePicture}
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
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {healthcareData.firstName} {healthcareData.lastName}
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: "text.secondary", mb: 2, fontSize: "1rem" }}
              >
                {" "}
                Group:{" "}
                {capitalizeFirstLetter(healthcareData.group) || "Not Set"}
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
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, position: "relative" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
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
                      healthcareData.firstName || "N/A"
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
                      healthcareData.lastName || "N/A"
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
                      healthcareData.email || "N/A"
                    )
                  }
                />
              </ListItem>

              {/* MCP ID */}
              <ListItem>
                <ListItemText
                  primary="MCP ID"
                  secondary={
                    editMode.personalInfo ? (
                      <TextField
                        variant="outlined"
                        size="small"
                        value={editableFields.mcpId}
                        onChange={(e) =>
                          handleFieldChange("mcpId", e.target.value)
                        }
                        fullWidth
                      />
                    ) : (
                      healthcareData.mcpId || "N/A"
                    )
                  }
                />
              </ListItem>

              {/* Group */}
              <ListItem>
                <ListItemText
                  primary="Group"
                  secondary={
                    editMode.personalInfo ? (
                      <TextField
                        select
                        variant="outlined"
                        size="small"
                        value={editableFields.group}
                        onChange={(e) =>
                          handleFieldChange("group", e.target.value)
                        }
                        fullWidth
                      >
                        <MenuItem value="doctor">Doctor</MenuItem>
                        <MenuItem value="nurse">Nurse</MenuItem>
                        <MenuItem value="medical assistant">
                          Medical Assistant
                        </MenuItem>
                      </TextField>
                    ) : (
                      capitalizeFirstLetter(healthcareData.group) || "N/A"
                    )
                  }
                />
              </ListItem>
            </List>
            {editMode.personalInfo && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  sx={{ mr: 1 }}
                  variant="contained"
                  onClick={() => {
                    const fieldsToUpdate = {
                      firstName: editableFields.firstName,
                      lastName: editableFields.lastName,
                      email: editableFields.email,
                      mcpId: editableFields.mcpId,
                      group: editableFields.group,
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

        {/* Dashboard */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, position: "relative" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Monthly Video Tracker
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              {` ${getCurrentMonthAndYear()}`}
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {/* Enhanced Stat Cards */}
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={<VideocamIcon fontSize="large" />}
                  title="Total Submitted Videos"
                  value={videoStats.total}
                  color={blue[500]}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={<ThumbUpIcon fontSize="large" />}
                  title="Approved Videos"
                  value={videoStats.approved}
                  color={green[500]}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={<ThumbDownIcon fontSize="large" />}
                  title="Rejected Videos"
                  value={videoStats.rejected}
                  color={red[500]}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={<ReportProblemIcon fontSize="large" />}
                  title="Total Missed Videos"
                  value={missedVideosData.totalMissedVideos}
                  color={orange[800]}
                  actionIcon={
                    <IconButton
                      onClick={() => setIsMissedVideosDialogOpen(true)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
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
      <Dialog
        open={isMissedVideosDialogOpen}
        onClose={() => setIsMissedVideosDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Missed Videos Details
          <IconButton
            aria-label="close"
            onClick={() => setIsMissedVideosDialogOpen(false)}
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
        <DialogContent dividers>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableRow>
                <TableCell sx={{ color: theme.palette.primary.contrastText }}>
                  Patient Name
                </TableCell>
                <TableCell
                  sx={{ color: theme.palette.primary.contrastText }}
                  align="left"
                >
                  Missed Videos
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {missedVideosData.patientMissedVideosDetails.map((detail) => (
                <TableRow key={detail.patientId}>
                  <TableCell component="th" scope="row">
                    {detail.patientName}
                  </TableCell>
                  <TableCell align="left">{detail.missedVideos}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
