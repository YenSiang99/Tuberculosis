import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  Drawer,
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  Paper,
  Container,
  Card,
  CardActions,
  Grid,
  CardContent,
  Button,
  Tooltip,
  GlobalStyles,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import theme from "./reusable/Theme";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import HealthcareSidebar from "./reusable/HealthcareBar";

const localizer = momentLocalizer(moment);

export default function HealthcareAppointment() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "John Doe",
      dateTime: "2024-01-10 10:30 AM",
      acceptedBy: null,
    },
    {
      id: 2,
      patientName: "Jane Doe",
      dateTime: "2024-01-12 11:00 AM",
      acceptedBy: null,
    },
    {
      id: 3,
      patientName: "Jane Doe",
      dateTime: "2024-01-12 12:00 PM",
      acceptedBy: true,
    },
    // ... other appointments
  ]);

  const [yourAppointments, setYourAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const doctorName = "Dr. Jack";

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAccept = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, acceptedBy: doctorName }
          : appointment
      )
    );
  };

  function parseAppointmentDate(dateTimeStr) {
    // Convert "YYYY-MM-DD hh:mm AM/PM" to a Date object
    const [datePart, timePart] = dateTimeStr.split(" ");
    const [year, month, day] = datePart.split("-");
    let [hour, minute] = timePart.substring(0, 5).split(":");

    if (timePart.includes("PM") && hour !== "12") {
      hour = parseInt(hour, 10) + 12;
    } else if (timePart.includes("AM") && hour === "12") {
      hour = 0;
    }

    return new Date(year, month - 1, day, hour, minute);
  }

useEffect(() => {
  // Filter out appointments that have been accepted
  setYourAppointments(
    appointments.filter(appointment => appointment.acceptedBy === true)
  );
  // Filter out pending appointments
  setPendingAppointments(
    appointments.filter(appointment => appointment.acceptedBy === null)
  );
}, [appointments]);

// Now, your calendarAppointments will be based on yourAppointments, which includes only accepted appointments.
const calendarAppointments = yourAppointments.map(appointment => ({
  ...appointment,
  title: appointment.patientName,
  start: parseAppointmentDate(appointment.dateTime),
  end: new Date(
    moment(parseAppointmentDate(appointment.dateTime)).add(1, "hours")
  ),
}));

  const EventComponent = ({ event }) => {
    // Format the title and time as desired
    const tooltipTitle = `${event.title} - ${event.start && moment(event.start).format("LT")}`;
  
    return (
      <Tooltip title={tooltipTitle} placement="top">
        <Box
          sx={{
            overflowY: "auto", 
            maxHeight: "100px", 
            "&:hover": {
              overflowY: "scroll", 
            },
          }}
        >
          <strong>{event.title}</strong>
          <div>{moment(event.start).format("LT")}</div>
        </Box>
      </Tooltip>
    );
  };
  

  const eventStyleGetter = (event, start, end, isSelected) => {
    // Example logic to determine height, you would replace this with your own logic
    const eventCountAtThisTime = calendarAppointments.filter(
      (e) => e.start === event.start
    ).length;
    const height = eventCountAtThisTime > 1 ? 100 / eventCountAtThisTime : 100;

    const style = {
      height: `${height}%`,
      // any other dynamic style adjustments
    };

    return {
      style: style,
    };
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          ".rbc-event": {
            overflowY: "auto", // Enable vertical scrolling
            maxHeight: "100px", // Set a maximum height
            "&:hover": {
              overflowY: "scroll", // Show scrollbar on hover
            },
          },
        }}
      />
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
        <HealthcareSidebar handleDrawerToggle={handleDrawerToggle} />
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
            {/* Pending Appointments Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 5, backgroundColor: "#f7f7f7" }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
            >
              Pending Appointments
            </Typography>
            <Grid container spacing={2}>
              {pendingAppointments.map((appointment) => (
                <Grid item xs={12} md={6} key={appointment.id}>
                  <Card
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                      "&:hover": { boxShadow: "0 8px 16px rgba(0,0,0,0.15)" },
                      p: 2,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        {appointment.patientName}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <EventNoteIcon sx={{ mr: 1 }} />
                        {appointment.dateTime}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAccept(appointment.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                      >
                        Reschedule
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Your Appointments Section */}
          <Paper
            elevation={3}
            sx={{ p: 3, mb: 4, mt: 5, backgroundColor: "#FAFAFA" }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
            >
             Appointments
            </Typography>
            <Box>
              <Calendar
                localizer={localizer}
                events={calendarAppointments}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                components={{
                  event: EventComponent,
                }}
                eventPropGetter={eventStyleGetter}
              />
            </Box>
            {/* <Grid container spacing={2}>
              {yourAppointments.map((appointment) => (
                <Grid item xs={12} md={6} key={appointment.id}>
                  <Card
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                      "&:hover": { boxShadow: "0 8px 16px rgba(0,0,0,0.15)" },
                      p: 2,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        {appointment.patientName}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <EventNoteIcon sx={{ mr: 1 }} />
                        {appointment.dateTime}
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "#4caf50",
                        }}
                      >
                        <PersonIcon sx={{ mr: 1 }} />
                        {appointment.acceptedBy}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid> */}
          </Paper>

        
        </Container>
      </Box>
    </ThemeProvider>
  );
}
