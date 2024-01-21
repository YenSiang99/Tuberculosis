import React, { useState } from 'react';
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
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from './reusable/Theme';
import PatientSidebar from './reusable/PatientBar';
import MenuIcon from "@mui/icons-material/Menu";

const StyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-around',
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
  backgroundColor:  'rgba(210, 240, 250, 1)',
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  display: 'inline-block', 
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
            <TableRow sx={{ backgroundColor: '#0046c0' }}>
              <TableCell sx={{color:'white'}}>Date</TableCell>
              <TableCell sx={{color:'white'}}>Side Effects</TableCell>
              <TableCell sx={{color:'white'}}>Grades</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((report, index) => (
              <TableRow key={index}>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.effects.join(', ')}</TableCell>
                <TableCell>{/* Logic to display grades */}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default function PatientSideEffectReport() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedSideEffects, setSelectedSideEffects] = useState([]);
  const [sideEffectDetails, setSideEffectDetails] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [otherDescription, setOtherDescription] = useState("");
  const [showMedicalAssistanceMessage, setShowMedicalAssistanceMessage] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
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
    setSelectedSideEffects(prev =>
      checked ? [...prev, name] : prev.filter(effect => effect !== name)
    );
  };

  const handleRadioChange = (event, sideEffect) => {
    const { value } = event.target;
    setSideEffectDetails(prev => ({
      ...prev,
      [sideEffect]: { ...prev[sideEffect], grade: value },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    let hasGrade2Or3 = false;
    for (const sideEffect of selectedSideEffects) {
      const grade = sideEffectDetails[sideEffect]?.grade;
      if (grade === '2' || grade === '3') {
        hasGrade2Or3 = true;
        break; // Stop the loop as we found at least one side effect with grade 2 or 3
      }
    }
    
    // Set the alert message based on whether there is a grade 2 or 3 side effect
    if (hasGrade2Or3) {
      setAlertInfo({ 
        show: true, 
        type: "warning", 
        message: "At least one side effect Grade 2/3, please seek medical assistance at the nearest hospital." 
      });
    } else {
      setAlertInfo({ 
        show: true, 
        type: "success", 
        message: "Side effect report submitted successfully." 
      });
    }
      };
  

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleOtherDescriptionChange = (event) => {
    setOtherDescription(event.target.value);
  };
  
  const history = [
    {
      date: '2024-01-15',
      effects: ['Tiredness', 'Rashes'],
      grades: { 'Tiredness': '1', 'Rashes': '2' },
    },
    {
      date: '2024-01-05',
      effects: ['Joint Pains', 'Itchiness'],
      grades: { 'Joint Pains': '2', 'Itchiness': '1' },
    },
    {
      date: '2023-12-20',
      effects: ['Seizures'],
      grades: { 'Seizures': '3' },
    },
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
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="Time"
                value={selectedTime}
                onChange={setSelectedTime}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>

        <TitleWithBackground variant="subtitle1" sx={{ mt: 4 }}>
              Symptoms (Choose all that apply)
            </TitleWithBackground>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
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
                  {selectedSideEffects.includes(sideEffect) && sideEffect !== "Others (Please Describe)" && (
                    <StyledRadioGroup
                      aria-label={`grade-${sideEffect}`}
                      name={`grade-${sideEffect}`}
                      value={sideEffectDetails[sideEffect]?.grade || ''}
                      onChange={(e) => handleRadioChange(e, sideEffect)}
                    >
                      <FormControlLabel value="1" control={<Radio />} label="Grade 1" />
                      <FormControlLabel value="2" control={<Radio />} label="Grade 2" />
                      <FormControlLabel value="3" control={<Radio />} label="Grade 3" />
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
            {/* Conditionally render the message if showMedicalAssistanceMessage is true */}
            {showMedicalAssistanceMessage && (
              <Typography color="error" sx={{ mt: 2 }}>
                At least one side effect Grade 2/3, please seek medical assistance at the nearest hospital.
              </Typography>
            )}
          </Box>
        </Paper>
        <SideEffectHistory history={history} />
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