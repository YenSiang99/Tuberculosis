import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ThemeProvider, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Avatar,
  MenuItem,
} from '@mui/material';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import theme from './reusable/Theme'; 
import BgImage from "./image/cover.jpeg";

export default function PatientRegister2() {
  const navigate = useNavigate(); 
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [treatmentStartMonth, setTreatmentStartMonth] = useState('');
  const [numberOfTablets, setNumberOfTablets] = useState('');

  const handleRegisterNext = () => navigate("/register/patient_3");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Diagnosis:', diagnosis);
    console.log('Treatment:', treatment);
    console.log('Treatment Start Month:', treatmentStartMonth);
    console.log('Number of Tablets:', numberOfTablets);
  };

  return (
    <ThemeProvider theme={theme}>
       <Box
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(217, 241, 251, 0.8), rgba(217, 241, 251, 0.8)), url(${BgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 3,
            boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
            borderRadius: "15px",
            backgroundColor: "white",
            width: "100vh",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <VaccinesIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Step 2 : Treatment Details
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              select
              margin="normal"
              required
              fullWidth
              id="diagnosis"
              label="Diagnosis"
              name="diagnosis"
              autoComplete="off"
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
              sx={{ mt: 2, width: '100%', minWidth: 400 }}
            >
              <MenuItem value="SPPTB">Smear positive pulmonary tuberculosis (SPPTB)</MenuItem>
              <MenuItem value="SNTB">Smear negative pulmonary tuberculosis (SNTB)</MenuItem>
              <MenuItem value="EXPTB">Extrapulmonary tuberculosis (EXPTB)</MenuItem>
              <MenuItem value="LTBI">Latent TB infection (LTBI)</MenuItem>
            </TextField>
            <TextField
              select
              margin="normal"
              required
              fullWidth
              id="treatment"
              label="Current Treatment"
              name="treatment"
              autoComplete="off"
              value={treatment}
              onChange={e => {
                setTreatment(e.target.value);
                setNumberOfTablets('');
              }}
              sx={{ mt: 2, width: '100%', minWidth: 400 }}
            >
              <MenuItem value="Akurit-4">Akurit-4 (EHRZ Fixed dose combination)</MenuItem>
              <MenuItem value="Akurit">Akurit (HR Fixed dose combination)</MenuItem>
              <MenuItem value="Pyridoxine10mg">Pyridoxine 10mg</MenuItem>
            </TextField>
              <TextField
                select
                margin="normal"
                required
                fullWidth
                id="numberOfTablets"
                label="Number of Tablets"
                name="numberOfTablets"
                autoComplete="off"
                value={numberOfTablets}
                onChange={e => setNumberOfTablets(e.target.value)}
                sx={{ mt: 2, width: '100%', minWidth: 400 }}
              >
                {[2, 3, 4, 5].map(num => (
                  <MenuItem key={num} value={num}>{num}</MenuItem>
                ))}
              </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              id="treatmentStartMonth"
              label="Treatment Start Month"
              name="treatmentStartMonth"
              type="month"
              InputLabelProps={{ shrink: true }}
              autoComplete="off"
              value={treatmentStartMonth}
              onChange={e => setTreatmentStartMonth(e.target.value)}
              sx={{ mt: 2, width: '100%', minWidth: 400 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              onClick={handleRegisterNext}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
