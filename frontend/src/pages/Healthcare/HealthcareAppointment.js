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
  Alert,
  styled,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, ButtonGroup, 
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import theme from "../../components/reusable/Theme";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import HealthcareSidebar from "../../components/reusable/HealthcareBar";
import DataViewer from "../../components/reusable/DataViewer";
import axios from "../../components/axios";
import '../../css/customCalendarStyles.css';


import { formatDate, formatTimeSlot } from "../../utils/dateUtils";
import { parseISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

const localizer = momentLocalizer(moment);

export default function HealthcareAppointment() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // own appointments
  const [appointments, setAppointments] = useState([]);
  // patient requested
  const [requestedAppointments, setRequestedAppointments] = useState([]);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [actionType, setActionType] = useState("");

  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });

  const openConfirmationDialog = (appointmentId, actionType) => {
    setCurrentAppointment(appointmentId);
    setActionType(actionType);
    setConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    setCurrentAppointment(null);
    setActionType("");
  };

  const handleConfirmAction = async () => {
    if (actionType === "accept") {
      // Perform accept action
      await handleAccept(currentAppointment);
      setAlertInfo({
        show: true,
        type: "success",
        message: "Appointment is accepted.",
      });
    } else if (actionType === "cancel") {
      // Perform cancel action
      await handleCancelByHealthcare(currentAppointment);
      setAlertInfo({
        show: true,
        type: "success",
        message: "Appointment is cancelled.",
      });
      // Ensure the lists are refreshed to reflect the cancellation
      await fetchAppointments();
      await fetchAppointmentRequests();
    }
    handleConfirmationClose();
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  // Functions
  // Api functions
  const fetchAppointmentRequests = async () => {
    try {
      const response = await axios.get(`/appointments/requestedAppointments`);
      setRequestedAppointments(
        response.data.map((appointment) => ({
          ...appointment,
          timeslot: formatTimeSlot(appointment),
          date: formatDate(appointment.startDateTime),
          id: appointment._id,
        }))
      );
    } catch (error) {
      console.error("Error fetching Available Date Time Slots:", error);
      // Handle the error as needed
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`/appointments/healthcareAppointments`);
      const timeZone = "UTC";
      setAppointments(
        response.data.map((appointment) => ({
          ...appointment,
          title: `Appointment with ${appointment.patient}`, // Assuming you have patient names
          start: utcToZonedTime(parseISO(appointment.startDateTime), timeZone),
          end: utcToZonedTime(parseISO(appointment.endDateTime), timeZone),
          timeslot: formatTimeSlot(appointment),
          id: appointment._id,
        }))
      );
    } catch (error) {
      console.error("Error fetching Appointments:", error);
    }
  };
  const handleAccept = async (appointmentId) => {
    const payload = {
      status: "approved",
    };
    try {
      const response = await axios.patch(
        `/appointments/${appointmentId}`,
        payload
      );
      fetchAppointments();
      fetchAppointmentRequests();
    } catch (error) {
      console.error("Error fetching updating appointment:", error);
      // Handle the error as needed
    }
  };

  const handleCancelByHealthcare = async (appointmentId) => {
    try {
      await axios.delete(`/appointments/${appointmentId}`);
      // Update local state as needed to reflect changes
      setAppointments((appointments) =>
        appointments.filter((appointment) => appointment.id !== appointmentId)
      );
      // Optionally, update any other state that might be affected
      setAlertInfo({
        show: true,
        type: "success",
        message: "Appointment deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting the appointment:", error.response.data);
      setAlertInfo({
        show: true,
        type: "error",
        message: "Failed to delete the appointment.",
      });
    }
  };

  const CustomEvent = ({ event }) => (
    <div>
      <strong >{event.fullName}</strong>
      <div style={{ fontSize: '0.8rem' }}>{event.timeslot}</div>
    </div>
  );

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {
      boxShadow: "none",
      overflow: "visible",
    },
  }));

  const handleCloseAlert = () => {
    setAlertInfo({ show: false, type: "", message: "" });
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    // console.log('event',event)

    const eventCountAtThisTime = appointments.filter(
      (e) => e.startDateTime === event.start
    ).length;

    console.log("eventCountAtThisTime", eventCountAtThisTime);

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
    fetchAppointmentRequests();
    fetchAppointments();
  }, []);

  const CustomToolbar = ({ label, onNavigate, onView, view }) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
        {/* Spacer for left side */}
        <div style={{ flex: 1 }}></div>
        
        {/* Navigation and label */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <IconButton onClick={() => onNavigate('PREV')}>
            <ArrowBackIos />
          </IconButton>
          <span style={{ margin: '0 10px' }}>{label}</span>
          <IconButton onClick={() => onNavigate('NEXT')}>
            <ArrowForwardIos />
          </IconButton>
        </div>
        
        {/* View buttons */}
        <ButtonGroup variant="outlined" size="small" style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Button onClick={() => onView('month')} disabled={view === 'month'}>Month</Button>
          <Button onClick={() => onView('week')} disabled={view === 'week'}>Week</Button>
          <Button onClick={() => onView('day')} disabled={view === 'day'}>Day</Button>
          <Button onClick={() => onView('agenda')} disabled={view === 'agenda'}>Agenda</Button>
        </ButtonGroup>
      </div>
    );
  };
  
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
          <Paper
            elevation={3}
            sx={{ p: 3, mb: 4, mt: 5, backgroundColor: "#f7f7f7" }}
          >
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
                    <CardContent
                      sx={{
                        "& b": {
                          display: "inline-block",
                          width: "30%",
                          position: "relative",
                          pr: "10px", // paddingRight in 'sx' prop
                          // For '::after', you might need an alternative approach
                        },
                        "& b::after": {
                          content: '":"',
                          position: "absolute",
                          right: "10px",
                        },
                      }}
                    >
                      <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                        <b>Date</b> {appointment.date}
                      </Typography>

                      <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                        <b>Time Slot</b> {appointment.timeslot}
                      </Typography>

                      <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                        <b>Patient Name</b> {appointment.fullName}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          openConfirmationDialog(appointment._id, "accept")
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          openConfirmationDialog(appointment._id, "cancel")
                        }
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
                messages={{ showMore: total => `+ ${total} more` }}
                localizer={localizer}
                events={appointments}
                startAccessor="start"
                endAccessor="end"
                style={{minHeight : 650 }}
                components={{
                  toolbar: CustomToolbar,
                  event: CustomEvent,
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
            open={confirmationOpen}
            onClose={handleConfirmationClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`${
                actionType.charAt(0).toUpperCase() + actionType.slice(1)
              } Appointment`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to {actionType} this appointment?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConfirmationClose}>No</Button>
              <Button onClick={handleConfirmAction} autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
