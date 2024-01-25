import React, { useState } from "react";
import {
  ThemeProvider,
  Drawer,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  Grid,
  Paper,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import NoteIcon from "@mui/icons-material/Note";
import SideEffectIcon from "@mui/icons-material/ReportProblem";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import theme from "./reusable/Theme";
import CloseIcon from "@mui/icons-material/Close";
import FaceIcon from "@mui/icons-material/Face";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import HealthcareSidebar from "./reusable/HealthcareBar";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  accepted: {
    backgroundColor: "#c8e6c9",
    color: "black",
  },
  rejected: {
    backgroundColor: "#ffcdd2",
    color: "black",
  },
});

export default function HealthcareSideEffect() {
  const classes = useStyles();
  const [dateState, setDateState] = useState(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [patients, setPatients] = useState([
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      icNumber: "012345010123",
      age: 30,
      country: "Malaysia",
      gender: "Male",
      phoneNumber: "0123456789",
      diagnosis: "x",
      treatment: "y",
      numberOfTablets: 2,
      treatmentStartMonth: "January 2024",
      notes: "Regular check-ups needed",
      sideEffectsHistory: [
        { date: "2024-02-01", detail: "Headache", grade: 2 },
        // ... more side effects with grades ...
      ],
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Doe",
      passportNumber: "A12345678",
      age: 35,
      country: "Singapore",
      gender: "Female",
      phoneNumber: "0123456789",
      diagnosis: "x",
      treatment: "y",
      numberOfTablets: 3,
      treatmentStartMonth: "January 2024",
      notes: "Regular check-ups needed",
      sideEffectsHistory: [
        { date: "2024-02-01", detail: "Nausea", grade: 1 },
        // ... more side effects with grades ...
      ],
    },
    // ... other patients ...
  ]);
  const videoStatus = {
    "2024-01-01": "accepted",
    "2024-01-02": "rejected",
    // ... other dates
  };
  const [selectedPatient, setSelectedPatient] = useState(null);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const openPatientProfile = (patientId) => {
    const patientInfoToShow = patients.find((p) => p.id === patientId);
    setSelectedPatient(patientInfoToShow);
  };

  const closePatientProfile = () => {
    setSelectedPatient(null);
  };

  // Add a function to handle date change
  const handleDateChange = (newDate) => {
    setDateState(newDate);
    // Handle the date change according to your application logic
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateString = date.toISOString().split("T")[0]; // format date to YYYY-MM-DD
      return classes[videoStatus[dateString]] || "";
    }
  };

  const CalendarLegend = () => (
    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
      <Box display="flex" alignItems="center" mr={2}>
        <Box sx={{ width: 16, height: 16, bgcolor: "#c8e6c9", mr: 1 }} />
        <Typography variant="body2">Accepted Video</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Box sx={{ width: 16, height: 16, bgcolor: "#ffcdd2", mr: 1 }} />
        <Typography variant="body2">Rejected Video</Typography>
      </Box>
    </Box>
  );

  const gradeOptions = [
    { value: 1, label: "Grade 1" },
    { value: 2, label: "Grade 2" },
    { value: 3, label: "Grade 3" },
  ];

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
          <Paper
            elevation={3}
            sx={{ p: 3, mb: 4, mt: 5, backgroundColor: "#f7f7f7" }}
          >
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                component="div"
                sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
              >
                Review Side Effect
              </Typography>
              <List>
                {patients.map((patient) => (
                  <Card
                    key={patient.id}
                    sx={{ mb: 2, bgcolor: "neutral.light" }}
                  >
                    <CardContent>
                      <ListItem>
                        <PersonIcon color="primary" sx={{ mr: 2 }} />
                        <ListItemText
                          primary={`${patient.firstName} ${patient.lastName}`}
                          secondary={
                            <>
                              {patient.sideEffectsHistory.map(
                                (effect, index) => (
                                  <div key={index}>
                                    <Typography
                                      component="span"
                                      variant="body2"
                                      style={{
                                        color:
                                          effect.grade >= 2 ? "red" : "inherit",
                                      }}
                                    >
                                      {`${effect.date}: ${effect.detail} (Grade: ${effect.grade})`}
                                    </Typography>
                                    <br />
                                  </div>
                                )
                              )}
                            </>
                          }
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => openPatientProfile(patient.id)}
                        >
                          View patient profile
                        </Button>
                      </ListItem>
                    </CardContent>
                  </Card>
                ))}
              </List>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Dialog
        open={Boolean(selectedPatient)}
        onClose={closePatientProfile}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Patient Profile
          <IconButton
            aria-label="close"
            onClick={closePatientProfile}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Personal Details */}
            <Grid item xs={12}>
              <Card sx={{ mb: 2, mt: 2 }}>
                <CardContent>
                  <Box sx={{ bgcolor: "#e1f5fe", p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      <FaceIcon sx={{ verticalAlign: "middle", mr: 1 }} />{" "}
                      Personal Details
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1">
                    <b>First Name:</b> {selectedPatient?.firstName}
                  </Typography>
                  <Typography variant="body1">
                    <b>Last Name:</b> {selectedPatient?.lastName}
                  </Typography>
                  <Typography variant="body1">
                    <b>Gender:</b> {selectedPatient?.gender}
                  </Typography>
                  <Typography variant="body1">
                    <b>Country:</b> {selectedPatient?.country}
                  </Typography>
                  <Typography variant="body1">
                    <b>
                      {selectedPatient?.country === "Malaysia"
                        ? "IC Number:"
                        : "Passport Number:"}
                    </b>{" "}
                    {selectedPatient?.nationality === "Malaysian"
                      ? selectedPatient?.icNumber
                      : selectedPatient?.passportNumber}
                  </Typography>
                  <Typography variant="body1">
                    <b>Age:</b> {selectedPatient?.age}
                  </Typography>
                  <Typography variant="body1">
                    <b>Phone Number:</b> {selectedPatient?.phoneNumber}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Treatment Information */}
            <Grid item xs={12}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    bgcolor="#e1f5fe"
                    sx={{ p: 2 }}
                  >
                    <Typography variant="h6" gutterBottom>
                      <LocalHospitalIcon
                        sx={{ verticalAlign: "middle", mr: 1 }}
                      />{" "}
                      Treatment Information
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1">
                    <b>Diagnosis:</b> {selectedPatient?.diagnosis}
                  </Typography>
                  <Typography variant="body1">
                    <b>Treatment:</b> {selectedPatient?.treatment}
                  </Typography>
                  <Typography variant="body1">
                        <b>Number Of Tablets:</b>{" "}
                        {selectedPatient?.numberOfTablets}
                      </Typography>
                  <Typography variant="body1">
                    <b>Treatment Start Month:</b>{" "}
                    {selectedPatient?.treatmentStartMonth}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    bgcolor="#e1f5fe"
                    sx={{ p: 2 }}
                  >
                    <Typography variant="h6" gutterBottom>
                      <CalendarIcon sx={{ verticalAlign: "middle", mr: 1 }} />{" "}
                      Video Status Calendar
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Calendar
                    onChange={handleDateChange}
                    value={dateState}
                    tileClassName={tileClassName}
                  />
                  <CalendarLegend />
                </CardContent>
              </Card>
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    bgcolor="#e1f5fe"
                    sx={{ p: 2 }}
                  >
                    <Typography variant="h6" gutterBottom>
                      <NoteIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Notes
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1">
                    {selectedPatient?.notes}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Side Effect History */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ bgcolor: "#e1f5fe", p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      <SideEffectIcon sx={{ verticalAlign: "middle", mr: 1 }} />{" "}
                      Side Effect History
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <List>
                    {selectedPatient?.sideEffectsHistory?.map(
                      (effect, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={effect.date}
                            secondary={`${effect.detail}, ${
                              gradeOptions.find((g) => g.value === effect.grade)
                                ?.label
                            }`}
                          />
                        </ListItem>
                      )
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
