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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Alert,
  styled,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import theme from "../../components/reusable/Theme";
import FaceIcon from "@mui/icons-material/Face";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SideEffectIcon from "@mui/icons-material/ReportProblem";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import HealthcareSidebar from "../../components/reusable/HealthcareBar";
import { makeStyles } from "@mui/styles";
import { format, isValid, parseISO } from "date-fns";
import axios from "../../components/axios";

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

export default function HealthcarePatient() {
  const classes = useStyles();
  const [dateState, setDateState] = useState(new Date());
  const [editTreatmentInfo, setEditTreatmentInfo] = useState(false);
  const [tempTreatmentInfo, setTempTreatmentInfo] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [videoStatuses, setVideoStatuses] = useState([]);
  const [inactivePatients, setInactivePatients] = useState([]);
  const [activePatients, setActivePatients] = useState([]);

  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
    nextAlert: null,
  });

  const handleCloseAlert = () => {
    setAlertInfo({ show: false, type: "", message: "" });
  };

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {
      boxShadow: "none",
      overflow: "visible",
    },
  }));

  const fetchAndCategorizePatients = async () => {
    try {
      const response = await axios.get("/users/patients");
      const updatedPatients = response.data.map((patient) => ({
        ...patient,
        // Determine if the patient's treatment is considered ended either by date or by specific care statuses
        isTreatmentEnded: new Date(patient.treatmentEndDate) < new Date() || 
                           ["Switch to DOTS", "Appointment to see doctor"].includes(patient.careStatus),
      }));
  
      // Categorize patients based on the modified isTreatmentEnded flag
      const activePatients = updatedPatients.filter((patient) => !patient.isTreatmentEnded);
      const inactivePatients = updatedPatients.filter((patient) => patient.isTreatmentEnded);
  
      // Update state to reflect categorized patients
      setActivePatients(activePatients);
      setInactivePatients(inactivePatients);
    } catch (error) {
      console.error("Error fetching patients", error);
    }
  };
  
  useEffect(() => {
    fetchAndCategorizePatients();
  }, []);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const openManageDialog = (patient) => {
    console.log("Patient", patient);
    setSelectedPatient(patient);
    setVideoStatuses([]);
    fetchSideEffectsForPatient(patient._id);
    fetchVideoStatusForPatient(patient._id);
  };

  const closeManageDialog = () => {
    setSelectedPatient(null);
  };

  const handleFieldChange = (event, field) => {
    if (selectedPatient) {
      // Guard against null
      setSelectedPatient({ ...selectedPatient, [field]: event.target.value });
    }
  };

  const toggleEditTreatmentInfo = async (shouldSave = true) => {
    if (selectedPatient) {
      if (editTreatmentInfo) {
        if (shouldSave) {
          try {
            await axios.put(`users/patients/treatment/${selectedPatient._id}`, {
              diagnosis: selectedPatient.diagnosis,
              currentTreatment: selectedPatient.currentTreatment,
              numberOfTablets: selectedPatient.numberOfTablets,
              diagnosisDate: selectedPatient.diagnosisDate,
              treatmentStartDate: selectedPatient.treatmentStartDate,
              treatmentDuration: selectedPatient.treatmentDuration,
              careStatus: selectedPatient.careStatus,
            });

            // Optionally refresh patient data here to reflect the changes
            fetchAndCategorizePatients();

            setAlertInfo({
              show: true,
              type: "success",
              message: "Treatment information updated successfully.",
            });
          } catch (error) {
            console.error(
              "Error saving treatment information",
              error.response.data
            );

            setAlertInfo({
              show: true,
              type: "error",
              message:
                "Failed to update treatment information. Please try again.",
            });
          }
        } else {
          // If canceling, revert to the original data
          setSelectedPatient((prevState) => ({
            ...prevState,
            ...tempTreatmentInfo,
          }));
        }
      } else {
        // If starting to edit, store the current data as a backup
        setTempTreatmentInfo({
          diagnosis: selectedPatient.diagnosis,
          currentTreatment: selectedPatient.currentTreatment,
          numberOfTablets: selectedPatient.numberOfTablets,
          diagnosisDate: selectedPatient.diagnosisDate,
          treatmentStartDate: selectedPatient.treatmentStartDate,
          treatmentDuration: selectedPatient.treatmentDuration,
          careStatus: selectedPatient.careStatus,
        });
      }

      setEditTreatmentInfo(!editTreatmentInfo);
    }
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

  const tabletOptions = [2, 3, 4, 5];

  const statusOptions = {
    "Continue VOTS": "Continue VOTS",
    "Switch to DOTS": "Switch to DOTS",
    "Appointment to see doctor": "Appointment to see doctor",
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
        // If the API call succeeds but returns no data, clear the video statuses
        setVideoStatuses([]);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If a 404 error is returned, indicating no videos found, clear the video statuses
        setVideoStatuses([]);
      } else {
        console.error("Error fetching video statuses", error);
      }
    }
  };

  const hasTreatmentEnded = (patient) => {
    if (!patient || !patient.treatmentEndDate) return false;
    const treatmentEndDate = new Date(patient.treatmentEndDate);
    const today = new Date();
    return treatmentEndDate < today;
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
                Patient List
              </Typography>

              <List>
                {activePatients.map((patient) => (
                  <Card
                    key={patient.id}
                    sx={{ mb: 2, bgcolor: "neutral.light" }}
                  >
                    <CardContent>
                      <ListItem>
                        <Avatar
                          src={patient.profilePicture}
                          alt={`${patient.firstName} ${patient.lastName}`}
                          sx={{ mr: 2 }}
                        />
                        <ListItemText
                          primary={`${patient.firstName} ${patient.lastName}`}
                          secondary={
                            <Typography
                              component="span"
                              variant="body2"
                              color="textSecondary"
                            >
                              Status:{" "}
                              {patient.isTreatmentEnded
                                ? "Treatment Ended"
                                : patient.careStatus}
                            </Typography>
                          }
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => openManageDialog(patient)}
                        >
                          Manage
                        </Button>
                      </ListItem>
                    </CardContent>
                  </Card>
                ))}
              </List>
            </Box>
          </Paper>
        </Container>

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
              Inactive Patients
            </Typography>
            <List>
            {inactivePatients.map((patient) => (
  <Card key={patient.id} sx={{ mb: 2, bgcolor: "neutral.light" }}>
    <CardContent>
      <ListItem>
        <Avatar
          src={patient.profilePicture}
          alt={`${patient.firstName} ${patient.lastName}`}
          sx={{ mr: 2 }}
        />
        <ListItemText
          primary={`${patient.firstName} ${patient.lastName}`}
          secondary={
            <Typography
              component="span"
              variant="body2"
              color="textSecondary"
            >
              Status: {
                ["Switch to DOTS", "Appointment to see doctor"].includes(patient.careStatus) 
                ? patient.careStatus 
                : "Treatment Ended"
              }
            </Typography>
          }
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => openManageDialog(patient)}
        >
          View Profile
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
        onClose={closeManageDialog}
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
          Patient Details
          <IconButton
            aria-label="close"
            onClick={closeManageDialog}
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
                      />
                      Treatment Information
                    </Typography>
                    {!editTreatmentInfo &&
                      !hasTreatmentEnded(selectedPatient) && (
                        <IconButton
                          onClick={() => toggleEditTreatmentInfo()}
                          size="small"
                        >
                          <EditIcon color="primary" />
                        </IconButton>
                      )}
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {editTreatmentInfo ? (
                    <>
                      <FormControl
                        fullWidth
                        margin="normal"
                        disabled={hasTreatmentEnded(selectedPatient)}
                      >
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                          labelId="status-label"
                          id="careStatus"
                          value={selectedPatient?.careStatus || ""}
                          label="Status"
                          onChange={(event) =>
                            handleFieldChange(event, "careStatus")
                          }
                          disabled={hasTreatmentEnded(selectedPatient)}
                        >
                          {Object.keys(statusOptions).map((key) => (
                            <MenuItem key={key} value={key}>
                              {statusOptions[key]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth margin="normal">
                        <InputLabel id="diagnosis-label">Diagnosis</InputLabel>
                        <Select
                          labelId="diagnosis-label"
                          id="diagnosis"
                          value={selectedPatient?.diagnosis || ""}
                          label="Diagnosis"
                          onChange={(event) =>
                            handleFieldChange(event, "diagnosis")
                          }
                        >
                          {Object.keys(diagnosisOptions).map((key) => (
                            <MenuItem key={key} value={key}>
                              {diagnosisOptions[key]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
                        <InputLabel id="treatment-label">Treatment</InputLabel>
                        <Select
                          labelId="treatment-label"
                          id="currentTreatment"
                          value={selectedPatient?.currentTreatment}
                          label="Treatment"
                          onChange={(event) =>
                            handleFieldChange(event, "currentTreatment")
                          }
                        >
                          {Object.keys(treatmentOptions).map((key) => (
                            <MenuItem key={key} value={key}>
                              {treatmentOptions[key]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth margin="normal">
                        <InputLabel id="tablets-label">
                          Number of Tablets
                        </InputLabel>
                        <Select
                          labelId="tablets-label"
                          id="numberOfTablets"
                          value={selectedPatient?.numberOfTablets}
                          label="Number of Tablets"
                          onChange={(event) =>
                            handleFieldChange(event, "numberOfTablets")
                          }
                        >
                          {tabletOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        type="date"
                        label="Diagnosis Date"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={selectedPatient?.diagnosisDate}
                        onChange={(event) =>
                          handleFieldChange(event, "diagnosisDate")
                        }
                      />
                      <TextField
                        type="date"
                        label="Treatment Start Date"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={selectedPatient?.treatmentStartDate}
                        onChange={(event) =>
                          handleFieldChange(event, "treatmentStartDate")
                        }
                      />
                      <TextField
                        type="number"
                        label="Treatment Duration (Month)"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={selectedPatient?.treatmentDuration}
                        onChange={(event) =>
                          handleFieldChange(event, "treatmentDuration")
                        }
                      />
                      {editTreatmentInfo &&
                        !hasTreatmentEnded(selectedPatient) && (
                          <Box display="flex" justifyContent="flex-end">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => toggleEditTreatmentInfo()}
                              sx={{ mt: 2, mr: 2 }}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => toggleEditTreatmentInfo(false)}
                              sx={{ mt: 2 }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        )}
                    </>
                  ) : (
                    <>
                      <Typography variant="body1">
                        <b>Status:</b>{" "}
                        {hasTreatmentEnded(selectedPatient)
                          ? "Treatment Ended"
                          : selectedPatient?.careStatus}
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
                        <b>Number Of Tablets:</b>{" "}
                        {selectedPatient?.numberOfTablets}
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
                    </>
                  )}
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
