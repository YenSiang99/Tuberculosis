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
import theme from "../../components/reusable/Theme";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import HealthcareSidebar from "../../components/reusable/HealthcareBar";
import DataViewer from '../../components/reusable/DataViewer';
import axios from "../../components/axios"; 

import { formatDate, formatTimeSlot } from '../../utils/dateUtils';
import {  parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';


const localizer = momentLocalizer(moment);

export default function HealthcareAppointment() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // own appointments
  const [appointments, setAppointments] = useState([]);
  // patient requested
  const [requestedAppointments, setRequestedAppointments] = useState([]);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  // Functions
  // Api functions
  const fetchAppointmentRequests = async () => {
    try {
      const response = await axios.get(`/appointments/requestedAppointments`);
      setRequestedAppointments(response.data.map(appointment => ({
        ...appointment,
        timeslot: formatTimeSlot(appointment),
        date: formatDate(appointment.startDateTime), 
        id: appointment._id,
      })));
            
    } catch (error) {
      console.error("Error fetching Available Date Time Slots:", error);
      // Handle the error as needed
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`/appointments/healthcareAppointments`);
      const timeZone = 'UTC'
      setAppointments(response.data.map(appointment => ({
        ...appointment,
        title: `Appointment with ${appointment.patient}`, // Assuming you have patient names
        start:  utcToZonedTime(parseISO(appointment.startDateTime), timeZone),
        end: utcToZonedTime(parseISO(appointment.endDateTime), timeZone),
        timeslot: formatTimeSlot(appointment),
        id: appointment._id,
      })));
            
    } catch (error) {
      console.error("Error fetching Appointments:", error);
    }
  };
  const handleAccept = async (appointmentId) => {
    const payload = {
      "status": "approved"
    }
    try {
      const response = await axios.patch(`/appointments/${appointmentId}`, payload);
      fetchAppointments()
      fetchAppointmentRequests() 
    } catch (error) {
      console.error("Error fetching updating appointment:", error);
      // Handle the error as needed
    }
  };

  // Additional components
  const EventComponent = ({ event }) => {
    // Format the title and time as desired
    const tooltipTitle =`${event.fullName}`;
  
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
          <strong>{event.fullName}</strong>
          <div>{event.timeslot}</div>
        </Box>
      </Tooltip>
    );
  };
  
  const eventStyleGetter = (event, start, end, isSelected) => {
    // Example logic to determine height, you would replace this with your own logic
    // console.log('event',event)
    
    const eventCountAtThisTime = appointments.filter(
      (e) => e.startDateTime === event.start
    ).length;

    console.log('eventCountAtThisTime',eventCountAtThisTime)
    
    // const eventCountAtThisTime = 1
    const height = eventCountAtThisTime > 1 ? 100 / eventCountAtThisTime : 100;

    const style = {
      height: `${height}%`,
      // any other dynamic style adjustments
    };

    return {
      style: style,
    };
  };

  useEffect(() => {
    fetchAppointmentRequests()
    fetchAppointments()
   
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {/* <DataViewer data={requestedAppointments} variableName="requestedAppointments"></DataViewer>
      <DataViewer data={appointments} variableName="appointments"></DataViewer> */}
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
            {/* requested Appointments Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 5, backgroundColor: "#f7f7f7" }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
            >
              Pending Appointments
            </Typography>
            <Grid container spacing={2}>
              {requestedAppointments.map((appointment) => (
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
                    <CardContent sx={{ 
                        '& b': {
                          display: 'inline-block',
                          width: '30%',
                          position: 'relative',
                          pr: '10px', // paddingRight in 'sx' prop
                          // For '::after', you might need an alternative approach
                        },
                        '& b::after': {
                          content: '":"',
                          position: 'absolute',
                          right: '10px',
                        }            
                      }}>
                      <Typography  sx={{ fontWeight: "bold", mb: 1 }}> 
                        <b>Date</b> {appointment.date}
                      </Typography>

                      <Typography  sx={{ fontWeight: "bold", mb: 1 }}> 
                        <b>Time Slot</b> {appointment.timeslot}
                      </Typography>

                      <Typography sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        <b>Patient Name</b> {appointment.fullName}
                      </Typography>
                      
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAccept(appointment._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                      >
                        Cancel
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
                events={appointments}
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
