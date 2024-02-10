import React, { useState, useEffect } from "react";
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
import { makeStyles } from '@mui/styles';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import theme from "../../components/reusable/Theme";
import PatientSidebar from "../../components/reusable/PatientBar";
import MenuIcon from "@mui/icons-material/Menu";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import { styled } from "@mui/material/styles";
import DataViewer from '../../components/reusable/DataViewer';
import axios from "../../components/axios"; 


import { formatDate, formatTimeSlot } from '../../utils/dateUtils';

const useStyles = makeStyles({
  alignMe: {
    '& b': {
      display: 'inline-block',
      width: '20%',
      position: 'relative',
      paddingRight: '10px',
    },
    '& b::after': {
      content: '":"',
      position: 'absolute',
      right: '10px',
    }
  }
});

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
  const classes = useStyles();
  const localizer = momentLocalizer(moment);

  // Date Time Slot Variables
  const [availableDateTimeSlots, setAvailableDateTimeSlots] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  // Select variables
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  // Appointment
  const [appointmentHistory, setAppointmentHistory] = useState([]);

  // Controllers
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Functions
  // Api fetching
  const fetchAvailableSlots = async (year, month) => {
    try {
      const response = await axios.get(`/appointments/availableSlots/?year=${year}&month=${month}`);
      setAvailableDateTimeSlots(response.data);
      
      // Automatically select the current date's available slots if any, for initial load or when changing months
      const formattedSelectedDateString = `${year}-${('0' + month).slice(-2)}-${('0' + selectedDate.getDate()).slice(-2)}`;
      const dayInfo = response.data.find(d => d.day.startsWith(formattedSelectedDateString));
      if (dayInfo) {
        setAvailableTimeSlots(dayInfo.availableTimeSlotList);
      } else {
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error("Error fetching Available Date Time Slots:", error);
      // Handle the error as needed
    }
  };
  const fetchPatientAppointments = async () => {
    try {
      const response = await axios.get('appointments/patientAppointments');
      // Assuming you set the fetched appointments to a state variable
      setAppointmentHistory(response.data.map(appointment => ({
        ...appointment,
        timeslot: formatTimeSlot(appointment),
        date: formatDate(appointment.startDateTime), 
        healthcare: appointment.healthcare ? appointment.healthcare : "No Healthcare Provider Assigned Yet",
        id: appointment._id,
      })));
    } catch (error) {
      console.error("Error fetching patient appointments:", error);
      // Handle the error as needed, e.g., setting an alert state
    }
  };
  // Controller function
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('appointments/', selectedTime);
      console.log("Appointment booked successfully", response.data);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1; 
      fetchAvailableSlots(year, month); 
      fetchPatientAppointments();
    } catch (error) {
      console.error("Error booking appointment", error);
      // Handle error (e.g., display a notification to the user)
    }
  };
  const handleCancelAppointment = async (appointmentId) => {
    console.log("Canceling appointment ID:", appointmentId);
    try {
      const response = await axios.delete(`appointments/${appointmentId}`);
      // Assuming you set the fetched appointments to a state variable
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1; 
      fetchAvailableSlots(year, month); 
      fetchPatientAppointments()
    } catch (error) {
      console.error("Error deleting appointment", error);
      // Handle the error as needed, e.g., setting an alert state
    }
  };
  // Calendar logic
  const dayPropGetter = (date) => {
    const dateString = [
      date.getFullYear(),
      ('0' + (date.getMonth() + 1)).slice(-2),
      ('0' + date.getDate()).slice(-2),
    ].join('-');
    const dayInfo = availableDateTimeSlots.find(d => d.day.startsWith(dateString));
  
    let style = {};
    if (dayInfo) {
      switch (dayInfo.status) {
        case "Available":
          style.backgroundColor = "#e3f2fd"; // Light blue for available
          break;
        case "Limited Slots":
          style.backgroundColor = "#90caf9"; // Darker blue for limited slots
          break;
        case "Fully Booked":
          style.backgroundColor = "#2196f3"; // Even darker blue for fully booked
          break;
        default:
          style.backgroundColor = "#f5f5f5"; // Gray out the day if not available for booking
      }
    }else{
      style.backgroundColor = "#f5f5f5"; // Gray out the day if not available for booking
    }
  
    // Highlight the selected date
    if (selectedDate && moment(selectedDate).isSame(date, "day")) {
      style.border = "2px solid #FF0000"; // Red border for the selected date
    }
  
    return { style };
  };
  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    const selectedDateString = [
      start.getFullYear(),
      ('0' + (start.getMonth() + 1)).slice(-2),
      ('0' + start.getDate()).slice(-2),
    ].join('-');
    const dayInfo = availableDateTimeSlots.find(d => d.day.startsWith(selectedDateString));

    if (!dayInfo || dayInfo.status === "Fully Booked") {
      setAlertInfo({
        show: true,
        type: "error",
        message: "No slots available for this day.",
      });
      return;
    }
  
    setAlertInfo({ show: false, type: "", message: "" });
    setAvailableTimeSlots(dayInfo.availableTimeSlotList);
  };
  const handleCloseAlert = () => {
    setAlertInfo({ show: false, type: "", message: "" });
  };
  const handleMonthChange = (newDate) => {
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1; // JavaScript months are 0-indexed
    console.log(`year ${year} month ${month}`)
    fetchAvailableSlots(year, month);
  };
  //Additional Components
  const eventStyleGetter = (event) => {
    let backgroundColor = "#fff"; // Default color
    switch (event.status) {
      case "Available":
        backgroundColor = "#e3f2fd";
        break;
      case "Limited Slots":
        backgroundColor = "#90caf9";
        break;
      case "Fully Booked":
        backgroundColor = "#2196f3";
        break;
      default:
        backgroundColor = "#f5f5f5"; // Gray out the day if not available for booking
    }
  
    const style = {
      backgroundColor,
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
  const Legend = () => (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <Chip label="Available" sx={{ bgcolor: "#e3f2fd", mr: 1 }} />
      <Chip label="Limited Slots" sx={{ bgcolor: "#90caf9", mr: 1 }} />
      <Chip label="Fully Booked" sx={{ bgcolor: "#2196f3" }} />
    </Box>
  );
  const CustomToolbar = ({ onNavigate, label, onMonthChange }) => {
    const navigate = (action) => {
      // "action" can be "PREV", "NEXT", or "TODAY"
      // Create a new Date object based on the current label
      const currentDate = new Date(label);
      let newDate = new Date(currentDate);
  
      if (action === "NEXT") {
        newDate.setMonth(currentDate.getMonth() + 1);
      } else if (action === "PREV") {
        newDate.setMonth(currentDate.getMonth() - 1);
      }
  
      // Call the onNavigate function provided by react-big-calendar
      onNavigate(action);
  
      // Call the function passed from the parent component
      onMonthChange(newDate);
    };
  
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton onClick={() => navigate("PREV")}>
          <ArrowBackIos />
        </IconButton>
        <Typography>{label}</Typography>
        <IconButton onClick={() => navigate("NEXT")}>
          <ArrowForwardIos />
        </IconButton>
      </div>
    );
  };
  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {
      boxShadow: "none",
      overflow: "visible",
    },
  }));

  useEffect(() => {
    // Call the getOrCreateVideo API to check or create a video for the day
    console.log('use effect hook called')
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // JavaScript months are 0-indexed
    fetchAvailableSlots(year, month);
    fetchPatientAppointments()
  }, [selectedDate]);

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
          {/* book your appointment */}
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
                  
                  {/* Calender picker */}
                  <Grid item xs={12} md={7}>
                    <TitleWithBackground gutterBottom>
                      Step 1: Select a Date
                    </TitleWithBackground>
                    <Calendar
                      localizer={localizer}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: 400 }}
                      dayPropGetter={dayPropGetter}
                      onSelectSlot={handleSelectSlot}
                      selectable
                      views={{ month: true }}
                      eventPropGetter={eventStyleGetter}
                      components={{
                        toolbar: props => <CustomToolbar {...props} onMonthChange={handleMonthChange} />,
                        event: EventComponent,
                      }}
                    />
                    <Legend />
                  </Grid>
                  
                  {/* Divider */}
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
                  
                  {/* Time slot */}
                  <Grid item xs={12} md={4}>
                    <TitleWithBackground gutterBottom>
                      Step 2: Select a Time Slot
                    </TitleWithBackground>
                    {availableTimeSlots.length > 0 ? 
                      (
                        <List>
                          {availableTimeSlots.map((timeSlot, index) => {
                            const timeSlotString = formatTimeSlot(timeSlot);
                            return (
                              <ListItemButton
                                key={index}
                                selected={selectedTime === timeSlot}
                                onClick={() => setSelectedTime(timeSlot)}
                              >
                                <ListItemText primary={timeSlotString} />
                              </ListItemButton>
                            );
                          })}
                        </List>
                      ) : (
                        <Typography>
                          No time slots available for this date.
                        </Typography>
                      )
                    }
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
          {/* Your appointments */}
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
            className={classes.alignMe}
          >
            {appointmentHistory.map((appointment, index) => (
              <React.Fragment key={index}>
                <ListItem >
                  <b>Status</b> {appointment.status}
                </ListItem>
                <ListItem > 
                  <b>Date</b> {appointment.date}
                </ListItem>
                <ListItem >
                  <b>Time Slot</b> {appointment.timeslot}
                </ListItem>
                <ListItem >
                  <b>Healthcare Assigned</b> {appointment.healthcare}
                </ListItem>
                <ListItem >
                  <Button
                    color="error"
                    size="small"
                    onClick={() => handleCancelAppointment(appointment.id)}
                    sx={{ alignSelf: 'flex-start', marginTop: '8px' }}
                  >
                    Cancel
                  </Button>
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
