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
  InputAdornment,
  useMediaQuery,
  Alert,
  Dialog,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import theme from "./reusable/Theme";
import PatientSidebar from "./reusable/PatientBar";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { styled } from "@mui/material/styles";


export default function PatientSetting() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleResetPassword = () => {
    if (currentPassword !== "user's actual current password") { // Replace with actual validation
      setAlertInfo({
        show: true,
        type: "error",
        message: "Current password is incorrect."
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setAlertInfo({
        show: true,
        type: "error",
        message: "Passwords do not match."
      });
      return;
    }

    // Implement the logic to handle the password reset
    console.log("Password reset to:", newPassword);

    // Clear the form fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordError('');

    // Set success alert
    setAlertInfo({
      show: true,
      type: "success",
      message: "Password successfully reset."
    });
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

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {
      boxShadow: "none",
      overflow: "visible",
    },
  }));

  const handleCloseAlert = () => {
    setAlertInfo({ show: false, type: "", message: "" });
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
        <Container>
          <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 5 }}>
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                component="div"
                sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
              >
                Reset Password
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <FormGroup>
        <TextField
          label="Current Password"
          type={showCurrentPassword ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          margin="normal"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowCurrentPassword}
                  edge="end"
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="New Password"
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowNewPassword}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Confirm New Password"
          type={showConfirmNewPassword ? "text" : "password"}
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          margin="normal"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowConfirmNewPassword}
                  edge="end"
                >
                  {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {passwordError && <Typography color="error">{passwordError}</Typography>}
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleResetPassword}
        >
          Reset Password
        </Button>
      </FormGroup>
            </Box>
          </Paper>
        </Container>
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
