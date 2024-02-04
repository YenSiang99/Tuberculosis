import React, { useState, useEffect } from "react";
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
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import NoteIcon from "@mui/icons-material/Note";
import SideEffectIcon from "@mui/icons-material/ReportProblem";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import theme from "../../components/reusable/Theme";
import CloseIcon from "@mui/icons-material/Close";
import FaceIcon from "@mui/icons-material/Face";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import HealthcareSidebar from "../../components/reusable/HealthcareBar";
import { makeStyles } from "@mui/styles";
import { parseISO, format } from 'date-fns';
import axios from "../../components/axios";

const useStyles = makeStyles((theme) => ({
  boldText: {
    fontWeight: "bold",
  },
  highlightRed: {
    color: "red",
  },
}));

export default function HealthcareSideEffect() {
  const classes = useStyles();
  const [dateState, setDateState] = useState(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const videoStatus = {
    "2024-01-01": "accepted",
    "2024-01-02": "rejected",
    // ... other dates
  };
  const [selectedPatient, setSelectedPatient] = useState(null);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [sideEffects, setSideEffects] = useState([]);

  const getToken = () => {
    // Try to get the token from sessionStorage
    let token = sessionStorage.getItem("token");

    // If not found in sessionStorage, try localStorage
    if (!token) {
      token = localStorage.getItem("token");
    }

    return token;
  };

  useEffect(() => {
    const fetchSideEffects = async () => {
      try {
        const response = await axios.get("/sideEffects/getAllSideEffects");
        // Sort side effects by date in descending order
        const sortedSideEffects = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setSideEffects(sortedSideEffects);
        console.log(sideEffects);
      } catch (error) {
        console.error("Failed to fetch side effects", error);
      }
    };

    fetchSideEffects();
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const openPatientProfile = async (patient) => {
    console.log("Patient :", patient);
    setSelectedPatient(patient);
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
                {sideEffects.map((sideEffect, index) => (
                  <Card key={index} sx={{ mb: 2, bgcolor: "neutral.light" }}>
                    <CardContent>
                      <ListItem alignItems="flex-start">
                        <Avatar
                          alt={sideEffect.patientId?.firstName}
                          src={sideEffect.patientId?.profilePicture}
                          sx={{ mr: 2 }}
                        />
                        <ListItemText
                          primary={
                            <Typography className={classes.boldText}>
                              {sideEffect.patientId?.firstName}{" "}
                              {sideEffect.patientId?.lastName}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textPrimary"
                              >
{format(parseISO(sideEffect.datetime), "d MMMM yyyy, h:mm a")}
                              </Typography>
                              <br />
                              {"Side Effects: "}
                              {sideEffect.sideEffects
                                .map((effect, index) => (
                                  <Typography
                                    key={index}
                                    component="span"
                                    className={
                                      effect.grade >= 2
                                        ? classes.highlightRed
                                        : ""
                                    }
                                    style={{ display: "inline" }}
                                  >
                                    {effect.effect ===
                                    "Others (Please Describe)"
                                      ? effect.description
                                      : `${effect.effect} (Grade ${effect.grade})`}
                                  </Typography>
                                ))
                                .reduce(
                                  (prev, curr, index) => [
                                    ...prev,
                                    index > 0 ? ", " : "",
                                    curr,
                                  ],
                                  []
                                )}
                            </>
                          }
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            openPatientProfile(sideEffect.patientId)
                          }
                          sx={{ mt: 2 }}
                        >
                          View profile
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
                    <b>Number Of Tablets:</b> {selectedPatient?.numberOfTablets}
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
                  {/* <List>
  {selectedPatient?.sideEffectsHistory?.map((effect, index) => (
    <ListItem key={index}>
      <ListItemText
        primary={effect.date}
        secondary={
          effect.detail === "Others (Please Describe)" ? effect.detail : `${effect.detail}, ${gradeOptions.find((g) => g.value === effect.grade)?.label}`
        }
      />
    </ListItem>
  ))}
</List> */}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
