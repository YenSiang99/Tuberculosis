import React, { useState, useEffect, useRef } from "react";
import {
  ThemeProvider,
  Box,
  Typography,
  Button,
  Paper,
  Container,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  styled,
  TextField,
  Grid,
  useMediaQuery,
  IconButton,
  Drawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Dialog,
} from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { format } from "date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import theme from "../../components/reusable/Theme";
import PatientSidebar from "../../components/reusable/PatientBar";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "../../components/axios";

const StyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
  flexDirection: "row",
  justifyContent: "space-around",
  background: theme.palette.background.paper,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  margin: theme.spacing(1, 0),
  color: theme.palette.text.primary,
}));

const TitleWithBackground = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  padding: theme.spacing(1),
  paddingRight: theme.spacing(2),
  marginTop: theme.spacing(2),
  backgroundColor: "rgba(210, 240, 250, 1)",
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  display: "inline-block",
}));

const SideEffectHistory = ({ history }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 5 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Side Effect History
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#0046c0" }}>
              <TableCell sx={{ color: "white" }}>Date and Time</TableCell>
              <TableCell sx={{ color: "white" }}>Side Effects</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((report, index) => (
              <TableRow key={index}>
                <TableCell>
                  {/* Format the date string */}
                  {format(new Date(report.date), "d MMMM yyyy, h:mm a")}
                </TableCell>
                <TableCell>
                  {report.sideEffects
                    ? report.sideEffects
                        .map((effect) =>
                          effect.effect === "Others (Please Describe)"
                            ? effect.description // Display description for "Others (Please Describe)"
                            : `${effect.effect} (Grade ${effect.grade})`
                        )
                        .join(", ")
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default function PatientSideEffectReport() {
  const [patientId, setPatientId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedSideEffects, setSelectedSideEffects] = useState([]);
  const [sideEffectDetails, setSideEffectDetails] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [otherDescription, setOtherDescription] = useState("");
  const [showMedicalAssistanceMessage, setShowMedicalAssistanceMessage] =
    useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });
  const historyRef = useRef(null);
  const [sideEffectHistory, setSideEffectHistory] = useState([]);

  useEffect(() => {
    // Attempt to fetch user data from session storage or local storage
    const userData =
      JSON.parse(sessionStorage.getItem("userData")) ||
      JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.userId) {
      setPatientId(userData.userId);
    }
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

  const sideEffectsOptions = [
    "Eyesight Worsening",
    "Yellowing of Eyes",
    "Ringing Sound",
    "Tingling Sensation",
    "Bruises",
    "Bleeding",
    "Joint Pains",
    "Rashes",
    "Mood Worsening/Changes",
    "Weight Loss",
    "Tiredness",
    "Seizures",
    "Itchiness",
    "Dark Urine",
    "Orange Urine",
    "Stomach Pain (Particularly Right Upper Area)",
    "Others (Please Describe)",
  ];

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSideEffects((prev) =>
      checked ? [...prev, name] : prev.filter((effect) => effect !== name)
    );
  };

  const handleRadioChange = (event, sideEffect) => {
    const { value } = event.target;
    if (sideEffect !== "Others (Please Describe)") {
      setSideEffectDetails((prev) => ({
        ...prev,
        [sideEffect]: { ...prev[sideEffect], grade: value },
      }));
    } else {
      setOtherDescription(value);
    }
  };

  const fetchSideEffectHistory = async () => {
    if (patientId) {
      try {
        const response = await axios.get(`/sideEffects/${patientId}`);
        setSideEffectHistory(response.data); // Update the side effect history state
      } catch (error) {
        console.error(
          "Error fetching side effect history:",
          error.response?.data || error.message
        );
      }
    }
  };

  useEffect(() => {
    // Fetch side effect history on component mount
    fetchSideEffectHistory();
  }, [patientId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Convert the side effects to the required format and check for grade 2 or 3
    const formattedSideEffects = selectedSideEffects.map((effect) => ({
      effect,
      grade: parseInt(sideEffectDetails[effect]?.grade || "1", 10),
      description:
        effect === "Others (Please Describe)" ? otherDescription : "",
    }));

    const hasGrade2Or3 = formattedSideEffects.some(
      (effect) => effect.grade === 2 || effect.grade === 3
    );

    // Construct the payload with the formatted side effects
    const payload = {
      patientId,
      date: selectedDate,
      time: selectedTime.toTimeString().substring(0, 5),
      sideEffects: formattedSideEffects,
    };

    try {
      await axios.post("/sideEffects", payload);

      // After successful submission, check for grade 2 or 3 to show appropriate message
      if (hasGrade2Or3) {
        setAlertInfo({
          show: true,
          type: "warning",
          message: [
            "Side effect report submitted successfully.",
            "At least one side effect Grade 2/3, please seek medical assistance at the nearest hospital.",
          ],
        });
      } else {
        setAlertInfo({
          show: true,
          type: "success",
          message: "Side effect report submitted successfully.",
        });
      }

      // Reset the form fields to initial state here
      setSelectedDate(new Date());
      setSelectedTime(new Date());
      setSelectedSideEffects([]);
      setSideEffectDetails({});
      setOtherDescription("");

      fetchSideEffectHistory();

      // Optionally, scroll to history or refresh history here
      if (historyRef.current) {
        historyRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      // Handle submission error
      setAlertInfo({
        show: true,
        type: "error",
        message:
          "An error occurred while submitting the side effect report: " +
          (error.response?.data?.message || error.message),
      });
      console.error(
        "Error submitting side effect report:",
        error.response?.data || error.message
      );
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleOtherDescriptionChange = (event) => {
    setOtherDescription(event.target.value);
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
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 2 }}
            >
              <SectionTitle
                variant="h5"
                component="h2"
                sx={{ fontWeight: "bold" }}
              >
                Report Side Effects
              </SectionTitle>

              <TitleWithBackground variant="subtitle1" sx={{ mt: 2 }}>
                When did these symptoms start?
              </TitleWithBackground>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Date"
                      value={selectedDate}
                      onChange={setSelectedDate}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TimePicker
                      label="Time"
                      value={selectedTime}
                      onChange={setSelectedTime}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>

              <TitleWithBackground variant="subtitle1" sx={{ mt: 4 }}>
                Symptoms (Choose all that apply)
              </TitleWithBackground>

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                {sideEffectsOptions.map((sideEffect) => (
                  <Box key={sideEffect}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedSideEffects.includes(sideEffect)}
                          onChange={handleCheckboxChange}
                          name={sideEffect}
                        />
                      }
                      label={sideEffect}
                    />
                    {selectedSideEffects.includes(sideEffect) &&
                      sideEffect !== "Others (Please Describe)" && (
                        <StyledRadioGroup
                          aria-label={`grade-${sideEffect}`}
                          name={`grade-${sideEffect}`}
                          value={sideEffectDetails[sideEffect]?.grade || ""}
                          onChange={(e) => handleRadioChange(e, sideEffect)}
                        >
                          <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="Grade 1"
                          />
                          <FormControlLabel
                            value="2"
                            control={<Radio />}
                            label="Grade 2"
                          />
                          <FormControlLabel
                            value="3"
                            control={<Radio />}
                            label="Grade 3"
                          />
                        </StyledRadioGroup>
                      )}
                  </Box>
                ))}
                {selectedSideEffects.includes("Others (Please Describe)") && (
                  <TextField
                    label="Please describe"
                    value={otherDescription}
                    onChange={handleOtherDescriptionChange}
                    margin="normal"
                    fullWidth
                  />
                )}
              </Box>

              <Button type="submit" variant="contained" sx={{ mt: 4 }}>
                Submit
              </Button>
            </Box>
          </Paper>
          <div ref={historyRef}>
            <SideEffectHistory history={sideEffectHistory} />
          </div>
        </Container>
      </Box>
      <CustomDialog
        open={alertInfo.show}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Alert severity={alertInfo.type} onClose={handleCloseAlert}>
          {Array.isArray(alertInfo.message)
            ? alertInfo.message.map((msg, index) => (
                <React.Fragment key={index}>
                  {msg}
                  {index < alertInfo.message.length - 1 && <br />}
                </React.Fragment>
              ))
            : alertInfo.message}
        </Alert>
      </CustomDialog>
    </ThemeProvider>
  );
}
