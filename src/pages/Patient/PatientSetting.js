import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  Drawer,
  Box,
  IconButton,
  useMediaQuery,
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Switch,
  Alert,
  styled,
  Dialog,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "../../components/axios";
import theme from "../../components/reusable/Theme";
import PatientSidebar from "../../components/reusable/PatientBar";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import DataViewer from "../../components/reusable/DataViewer";

export default function PatientNotification() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  // Set default reminder time to today at 10:00 PM
  const defaultReminderTime = new Date();
  defaultReminderTime.setHours(22, 0, 0);

  const [videoUploadAlert, setVideoUploadAlert] = useState(true);
  const [reminderTime, setReminderTime] = useState(defaultReminderTime);
  const [reminderFrequency, setReminderFrequency] = useState(60);

  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
    nextAlert: null,
  });

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // const handleToggleVideoUploadAlert = async (event) => {
  //   const newVideoUploadAlertValue = event.target.checked;
  //   console.log("newVideoUploadAlertValue",newVideoUploadAlertValue)
  //   setVideoUploadAlert(newVideoUploadAlertValue);

  //   saveSettings();
  // };

  const handleTimeChange = (newValue) => {
    console.log(newValue);
    setReminderTime(newValue);
    // Save the new setting here directly
    // saveSettings({ reminderTime: newValue.toISOString() });
  };

  const handleFrequencyChange = (event) => {
    const newFrequency = event.target.value;
    console.log(newFrequency);
    setReminderFrequency(newFrequency);
    // Save the new setting here directly
    // saveSettings({ reminderFrequency: newFrequency });
  };

  const handleToggleVideoUploadAlert = async (event) => {
    const newVideoUploadAlertValue = event.target.checked;
    console.log("Toggle Video Upload Alert:", newVideoUploadAlertValue);
    setVideoUploadAlert(newVideoUploadAlertValue);
  
    saveSettings(newVideoUploadAlertValue); 
  };
  
  
  // Modify saveSettings to optionally take parameters
  const saveSettings = async (newVideoUploadAlert = videoUploadAlert) => {
    console.log(`Saving settings with reminderTime: ${reminderTime}, reminderFrequency: ${reminderFrequency}`);
    let settings = {
      videoUploadAlert: typeof newVideoUploadAlert === 'boolean' ? newVideoUploadAlert : videoUploadAlert,
      reminderTime: reminderTime,
      reminderFrequency: reminderFrequency,
    };
    console.log("Settings to save:", settings);
    try {
      await axios.patch("/users/settings", settings);
      setAlertInfo({
        show: true,
        type: "success",
        message: "Settings have been successfully updated.",
      });
    } catch (error) {
      console.error("Error saving settings", error.response?.data || error);
      setAlertInfo({
        show: true,
        type: "error",
        message: "Failed to update settings. Please try again.",
      });
    }
  };
  

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/users/settings"); // Ensure the URL matches your API endpoint
        const { videoUploadAlert, reminderTime, reminderFrequency } =
          response.data;
        console.log('this is user settings data...')
        console.log(videoUploadAlert, reminderTime, reminderFrequency);
        setVideoUploadAlert(videoUploadAlert);
        setReminderTime(
          reminderTime ? new Date(reminderTime) : defaultReminderTime
        );

        setReminderFrequency(reminderFrequency || 60);
      } catch (error) {
        console.error("Error fetching settings:", error);
        // Handle error, possibly by setting default states
        setVideoUploadAlert(true);
        setReminderTime(defaultReminderTime);
        setReminderFrequency(60);
      }
    };

    fetchSettings();
  }, []);

  const handleCloseAlert = () => {
    setAlertInfo({ show: false, type: "", message: "" });
  };

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {
      boxShadow: "none",
      overflow: "visible",
    },
  }));

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
        }}
      >
        <Container>
          <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 5 }}>
            <Typography
              variant="h5"
              gutterBottom
              component="div"
              sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
            >
              Settings
            </Typography>
            <Typography gutterBottom sx={{ mt: 3 }}>
              Medication Reminder
            </Typography>
            <Switch
              checked={videoUploadAlert}
              onChange={handleToggleVideoUploadAlert}
              inputProps={{ "aria-label": "controlled" }}
            />
            {/* <DataViewer data={requestedAppointments} variableName="requestedAppointments"></DataViewer> */}
            {/* <DataViewer data={reminderTime} variableName="reminder time"></DataViewer>
            <DataViewer data={reminderFrequency} variableName="reminder freq"></DataViewer> */}
            {videoUploadAlert && (
              <>
                <Typography gutterBottom sx={{ mt: 3, mb: 1 }}>
                  Start Reminder Time
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    value={reminderTime}
                    onChange={handleTimeChange}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
                <Typography gutterBottom sx={{ mt: 3, mb: 1 }}>
                  Reminder Frequency (minutes)
                </Typography>
                <TextField
                  select
                  value={reminderFrequency}
                  onChange={handleFrequencyChange}
                  fullWidth
                  margin="normal"
                >
                  {[15, 30, 45, 60, 120].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            )}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
      <Button variant="contained" color="primary" onClick={saveSettings}>
        Save
      </Button>
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
