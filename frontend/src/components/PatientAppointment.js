import React, { useState } from "react";
import {
  ThemeProvider,
  Drawer,
  Box,
  Typography,
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  IconButton,
  useMediaQuery,
  Alert,
  Dialog,
  Chip,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import theme from "./reusable/Theme";
import PatientSidebar from "./reusable/PatientBar";
import MenuIcon from "@mui/icons-material/Menu";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import { styled } from "@mui/material/styles";

const TitleWithBackground = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  padding: theme.spacing(1),
  paddingRight: theme.spacing(2),
  marginTop: theme.spacing(2),
  // backgroundColor:  'rgba(210, 240, 250, 1)',
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  display: "inline-block",
}));

export default function PatientAppointment() {
  const localizer = momentLocalizer(moment);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [timeSlotsForSelectedDate, setTimeSlotsForSelectedDate] = useState([]);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {
      boxShadow: "none",
      overflow: "visible",
    },
  }));

  const appointmentHistory = [
    // Replace with your actual appointment data
    {
      id: 1,
      date: "2023-01-25",
      time: "02:00 PM",
      doctor: "Dr. Johnson",
    },
    {
      id: 3,
      date: "2023-01-3",
      time: "01:00 PM",
    },
    // ... more appointments
  ];

  const availableTimeSlots = [
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    setSelectedTime(null);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement your form submission logic here
    console.log("Appointment booked for", selectedDate, selectedTime);
  };

  const sortAppointmentsDescending = (appointments) => {
    return appointments.sort((a, b) => {
      const datetimeA = new Date(`${a.date} ${a.time}`);
      const datetimeB = new Date(`${b.date} ${b.time}`);
      return datetimeB - datetimeA;
    });
  };

  const sortedAppointmentHistory =
    sortAppointmentsDescending(appointmentHistory);

  const handleCancelAppointment = (appointmentId) => {
    console.log("Canceling appointment ID:", appointmentId);
    // Implement your cancel logic here
  };

  // Fake data with availability statuses for testing
  const myEventsList = [
    {
      id: 1,
      start: new Date(2024, 0, 15, 10, 0), // 16th January 2024, 10:00 AM
      end: new Date(2024, 0, 15, 10, 30), // 16th January 2024, 10:30 AM
      availability: "available", // more than 3 slots
    },
    {
      id: 2,
      start: new Date(2024, 0, 19, 10, 0), // 18th January 2024, 10:00 AM
      end: new Date(2024, 0, 19, 10, 30), // 18th January 2024, 10:30 AM
      availability: "limited", // 3 slots left
    },
    {
      id: 3,
      start: new Date(2024, 0, 22, 10, 0), // 20th January 2024, 10:00 AM
      end: new Date(2024, 0, 22, 10, 0), // 20th January 2024, 10:30 AM
      availability: "booked", // no slots left
    },
    // ... add more events as needed
  ];

  const Legend = () => (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <Chip label="Available" sx={{ bgcolor: "#e3f2fd", mr: 1 }} />
      <Chip label="Limited Slots" sx={{ bgcolor: "#90caf9", mr: 1 }} />
      <Chip label="Fully Booked" sx={{ bgcolor: "#2196f3" }} />
    </Box>
  );

  const dayPropGetter = (date) => {
    const isSelectedDate =
      selectedDate && moment(selectedDate).isSame(date, "day");
    let style = {};

    // Check if the date matches any available or limited slots
    const isAvailable = myEventsList.some(
      (event) =>
        moment(date).isSame(event.start, "day") &&
        event.availability === "available"
    );
    const isLimited = myEventsList.some(
      (event) =>
        moment(date).isSame(event.start, "day") &&
        event.availability === "limited"
    );
    const isFull = myEventsList.some(
      (event) =>
        moment(date).isSame(event.start, "day") &&
        event.availability === "booked"
    );

    // Check if the day is Monday, Wednesday, or Friday
    const dayOfWeek = date.getDay();
    const isAllowedDay = [1, 3, 5].includes(dayOfWeek);

    // Always display a red border on the selected date
    if (isSelectedDate) {
      style.border = "2px solid #FF0000"; // Red border for the selected date
    }

    // Apply background colors as needed
    if (isAvailable) {
      style.backgroundColor = "#e3f2fd";
    } else if (isLimited) {
      style.backgroundColor = "#90caf9";
    } else if (isFull) {
      style.backgroundColor = "#2196f3";
    }

    // If the date is not an allowed day, gray it out and disable it
    if (!isAllowedDay) {
      style.backgroundColor = "#f5f5f5"; // Gray background color
      style.cursor = "not-allowed"; // Change cursor to not-allowed
    }

    return { style };
  };

  const CustomToolbar = ({ onNavigate, label }) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton onClick={() => onNavigate("PREV")}>
          <ArrowBackIos />
        </IconButton>
        <Typography>{label}</Typography>
        <IconButton onClick={() => onNavigate("NEXT")}>
          <ArrowForwardIos />
        </IconButton>
      </div>
    );
  };

  // This function gets called when a date is selected on the calendar
  const handleSelectSlot = ({ start }) => {
    const dayOfWeek = start.getDay();
    if (![1, 3, 5].includes(dayOfWeek)) {
      setAlertInfo({
        show: true,
        type: "error",
        message:
          "Appointments can only be booked on Monday, Wednesday, or Friday.",
      });
      return;
    }
    setSelectedDate(start);
    setAlertInfo({ show: false, type: "", message: "" });

    // Filter the availableTimeSlots based on the selected date.
    // This is a placeholder and should be replaced with actual logic to fetch the available time slots for the selected date.
    const slotsForDate = availableTimeSlots; // Assume all slots are available for the demo.
    setTimeSlotsForSelectedDate(slotsForDate);
  };

  const handleCloseAlert = () => {
    setAlertInfo({ show: false, type: "", message: "" });
  };

  // Function to customize event appearance based on status
  const eventStyleGetter = (event) => {
    let backgroundColor = "#fff"; // Default color
    if (event.availability === "available") {
      backgroundColor = "#e3f2fd";
    } else if (event.availability === "limited") {
      backgroundColor = "#90caf9";
    } else if (event.availability === "booked") {
      backgroundColor = "#2196f3";
    }

    const style = {
      backgroundColor: backgroundColor,
      // Other styles if needed
    };

    return { style };
  };

  const EventComponent = ({ event }) => {
    return (
      <div>
        <div
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "5px",
            opacity: 0.8,
          }}
        />
      </div>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      {useMediaQuery(theme.breakpoints.down("sm")) && (
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
        variant={
          useMediaQuery(theme.breakpoints.down("sm"))
            ? "temporary"
            : "permanent"
        }
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
              sx={{
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              Book Your Appointment
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 2 }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={7}>
                    <TitleWithBackground gutterBottom>
                      Step 1: Select a Date
                    </TitleWithBackground>

                    <Calendar
                      localizer={localizer}
                      events={myEventsList}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: 400 }}
                      dayPropGetter={dayPropGetter}
                      onSelectSlot={handleSelectSlot}
                      selectable
                      views={{ month: true }}
                      eventPropGetter={eventStyleGetter}
                      components={{
                        toolbar: CustomToolbar,
                        event: EventComponent,
                      }}
                    />

                    <Legend />
                  </Grid>

                  <Grid
                    item
                    sm={1}
                    md={1}
                    style={{ display: "flex" }}
                    hidden={{ xsDown: true }}
                  >
                    {/* The Divider will be hidden on extra-small (xs) screens */}
                    <Divider orientation="vertical" flexItem />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TitleWithBackground gutterBottom>
                      Step 2: Select a Time Slot
                    </TitleWithBackground>
                    {timeSlotsForSelectedDate.length > 0 ? (
                      <List>
                        {timeSlotsForSelectedDate.map((timeSlot, index) => (
                          <ListItemButton
                            key={index}
                            selected={selectedTime === timeSlot}
                            onClick={() => setSelectedTime(timeSlot)}
                          >
                            <ListItemText primary={timeSlot} />
                          </ListItemButton>
                        ))}
                      </List>
                    ) : (
                      <Typography>
                        No time slots available for this date.
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </LocalizationProvider>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 4, display: "block", width: "100%" }}
              >
                Book Appointment
              </Button>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 5 }}>
            <Typography
              variant="h5"
              gutterBottom
              component="div"
              sx={{
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
               Your Appointment 
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 2 }}
            >
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              p: 0,
            }}
          >
            {sortedAppointmentHistory.map((appointment, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`Appointment ${
                      appointment.doctor
                        ? `with ${appointment.doctor}`
                        : " - No Doctor Assigned Yet"
                    }`}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Date: {appointment.date}, Time: {appointment.time}
                        </Typography>
                        <Button
                          color="error"
                          size="small"
                          onClick={() =>
                            handleCancelAppointment(appointment.id)
                          }
                          sx={{ ml: 15 }}
                        >
                          Cancel
                        </Button>
                      </>
                    }
                  />
                </ListItem>
                {index < appointmentHistory.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>

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
