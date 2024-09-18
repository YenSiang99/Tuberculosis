import React, { useState, useEffect } from "react";
import {
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
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SideEffectIcon from "@mui/icons-material/ReportProblem";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import FaceIcon from "@mui/icons-material/Face";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { makeStyles } from "@mui/styles";
import { format, isValid, parseISO } from "date-fns";
import axios from "../../components/axios";

const useStyles = makeStyles((theme) => ({
  boldText: {
    fontWeight: "bold",
  },
  highlightRed: {
    color: "red",
  },
  accepted: {
    backgroundColor: "#c8e6c9",
    color: "black",
  },
  rejected: {
    backgroundColor: "#ffcdd2",
    color: "black",
  },
}));

export default function HealthcareSideEffect() {
  const classes = useStyles();
  const [dateState, setDateState] = useState(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sideEffects, setSideEffects] = useState([]);
  const [patients, setPatients] = useState([]);
  const [videoStatuses, setVideoStatuses] = useState([]);

  const fetchSideEffects = async () => {
    try {
      const response = await axios.get("/sideEffects/getAllSideEffects");
      // Explicitly convert dates to ISO strings before comparing.
      const sortedSideEffects = response.data.sort((a, b) => {
        const dateA = new Date(a.datetime).toISOString();
        const dateB = new Date(b.datetime).toISOString();
        return dateB.localeCompare(dateA);
      });
      setSideEffects(sortedSideEffects);
    } catch (error) {
      console.error("Failed to fetch side effects", error);
    }
  };

  useEffect(() => {
    fetchSideEffects();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("/users/patients");
      setPatients(response.data);
      console.log(patients);
    } catch (error) {
      console.error("Error fetching patients", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const openPatientProfile = (patient) => {
    console.log("Patient", patient);
    setSelectedPatient(patient);
    setVideoStatuses([]);
    const patientId = patient._id;
    if (patientId) {
      fetchSideEffectsForPatient(patientId);
      fetchVideoStatusForPatient(patientId);
    } else {
      console.error("Patient ID is undefined", patient._id);
    }
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
      const dateString = format(date, "yyyy-MM-dd");
      const treatmentStartDateString = selectedPatient?.treatmentStartDate
        ? format(parseISO(selectedPatient.treatmentStartDate), "yyyy-MM-dd")
        : null;

      // Only proceed if we have a treatment start date and it's on or before the current date being rendered by the calendar
      if (treatmentStartDateString && dateString >= treatmentStartDateString) {
        const videoForDay = videoStatuses.find(
          (video) => format(parseISO(video.date), "yyyy-MM-dd") === dateString
        );

        if (videoForDay) {
          return classes.accepted; // Video submitted
        } else {
          const todayString = format(new Date(), "yyyy-MM-dd");

          if (dateString < todayString) {
            return classes.rejected; // Video missed
          }
        }
      }
    }
  };

  const CalendarLegend = () => (
    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
      <Box display="flex" alignItems="center" mr={2}>
        <Box sx={{ width: 16, height: 16, bgcolor: "#c8e6c9", mr: 1 }} />
        <Typography variant="body2">Video Submitted</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Box sx={{ width: 16, height: 16, bgcolor: "#ffcdd2", mr: 1 }} />
        <Typography variant="body2">Video Missed</Typography>
      </Box>
    </Box>
  );

  const diagnosisOptions = {
    SPPTB: "Smear positive pulmonary tuberculosis (SPPTB)",
    SNTB: "Smear negative pulmonary tuberculosis (SNTB)",
    EXPTB: "Extrapulmonary tuberculosis (EXPTB)",
    LTBI: "Latent TB infection (LTBI)",
  };

  const treatmentOptions = {
    "Akurit-4": "Akurit-4 (EHRZ Fixed dose combination)",
    Akurit: "Akurit (HR Fixed dose combination)",
    Pyridoxine: "Pyridoxine 10mg",
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    if (isValid(date)) {
      return format(date, "dd-MM-yyyy");
    }
    return "Invalid date";
  };

  const fetchSideEffectsForPatient = async (patientId) => {
    try {
      const response = await axios.get(`/sideEffects/patient/${patientId}`);
      if (response.data) {
        setSelectedPatient((prevState) => ({
          ...prevState,
          sideEffects: response.data,
        }));
      }
    } catch (error) {
      console.error("Error fetching side effects", error);
    }
  };

  const fetchVideoStatusForPatient = async (patientId) => {
    try {
      const response = await axios.get(`/videos/patientVideos/${patientId}`);
      if (response.data) {
        setVideoStatuses(response.data);
      } else {
        setVideoStatuses([]);
      }
    } catch (error) {
      console.error(
        "Error fetching video statuses for patient ID:",
        patientId,
        error
      );
      setVideoStatuses([]);
    }
  };

  useEffect(() => {
    console.log("Selected Patient updated", selectedPatient);
  }, [selectedPatient]);

  useEffect(() => {
    console.log("Video statuses updated", videoStatuses);
  }, [videoStatuses]);

  return (
    <div>
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
                          alt={sideEffect.patient?.firstName}
                          src={sideEffect.patient?.profilePicture}
                          sx={{ mr: 2 }}
                        />
                        <ListItemText
                          primary={
                            <Typography className={classes.boldText}>
                              {sideEffect.patient?.firstName}{" "}
                              {sideEffect.patient?.lastName}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textPrimary"
                              >
                                {format(
                                  parseISO(sideEffect.datetime),
                                  "d MMMM yyyy, h:mm a"
                                )}
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
                          onClick={() => openPatientProfile(sideEffect.patient)}
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
          Manage Patient
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
                    <b>Gender:</b>{" "}
                    {selectedPatient
                      ? capitalizeFirstLetter(selectedPatient.gender)
                      : "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <b>Age:</b> {selectedPatient?.age}
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
                    {selectedPatient?.country === "Malaysia"
                      ? selectedPatient?.nricNumber
                      : selectedPatient?.passportNumber}
                  </Typography>
                  <Typography variant="body1">
                    <b>Phone Number:</b> {selectedPatient?.phoneNumber}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Treatment Details */}
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
                    <b>Status:</b>{" "}
                    {selectedPatient ? selectedPatient.careStatus : "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <b>Diagnosis:</b>{" "}
                    {selectedPatient?.diagnosis
                      ? diagnosisOptions[selectedPatient.diagnosis]
                      : "N/A"}
                  </Typography>

                  <Typography variant="body1">
                    <b>Current Treatment:</b>{" "}
                    {selectedPatient?.currentTreatment
                      ? treatmentOptions[selectedPatient.currentTreatment]
                      : "N/A"}
                  </Typography>

                  <Typography variant="body1">
                    <b>Number Of Tablets:</b> {selectedPatient?.numberOfTablets}
                  </Typography>
                  <Typography variant="body1">
                    <b>Diagnosis Date:</b>{" "}
                    {formatDate(selectedPatient?.diagnosisDate)}
                  </Typography>
                  <Typography variant="body1">
                    <b>Treatment Start Date:</b>{" "}
                    {formatDate(selectedPatient?.treatmentStartDate)}
                  </Typography>
                  <Typography variant="body1">
                    <b>Treatment Duration:</b>{" "}
                    {selectedPatient?.treatmentDuration}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Side effect history */}
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
                  {selectedPatient?.sideEffects &&
                  selectedPatient.sideEffects.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#0046c0" }}>
                            <TableCell sx={{ color: "white" }}>
                              Date and Time
                            </TableCell>
                            <TableCell sx={{ color: "white" }}>
                              Side Effects
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedPatient.sideEffects.map((effect, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {format(
                                  parseISO(effect.datetime),
                                  "d MMMM yyyy, h:mm a"
                                )}
                              </TableCell>
                              <TableCell>
                                <ul>
                                  {effect.sideEffects.map((e, idx) => (
                                    <li key={idx}>
                                      {e.effect === "Others (Please Describe)"
                                        ? e.description // Display description for "Others (Please Describe)"
                                        : `${e.effect} (Grade ${e.grade})`}
                                    </li>
                                  ))}
                                </ul>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      No side effect reported.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Video status calendar */}
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
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}
