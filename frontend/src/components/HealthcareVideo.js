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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import theme from "./reusable/Theme";
import CloseIcon from "@mui/icons-material/Close";
import HealthcareSidebar from "./reusable/HealthcareBar";

export default function HealthcarePatient() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "John Doe",
      videoUrl: "./image/sample_video.mp4",
      accepted: null,
    },
    {
      id: 2,
      name: "Jane Doe",
      videoUrl: "./image/sample_video.mp4",
      accepted: null,
    },
  ]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const openVideoDialog = (patient) => {
    setSelectedPatient(patient);
  };

  const closeVideoDialog = () => {
    setSelectedPatient(null);
  };

  const handleAccept = () => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === selectedPatient.id
          ? { ...patient, accepted: "accepted" }
          : patient
      )
    );
    closeVideoDialog();
  };

  const handleReject = () => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === selectedPatient.id
          ? { ...patient, accepted: "rejected" }
          : patient
      )
    );
    closeVideoDialog();
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
          <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 5 , backgroundColor: "#f7f7f7"}}>
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                component="div"
                sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
              >
                Review Video
              </Typography>

              <List>
                {patients.map((patient) => (
                  <Card
                    key={patient.id}
                    sx={{
                      mb: 2,
                      bgcolor:
                        patient.accepted === "accepted"
                          ? "#c8e6c9"
                          : patient.accepted === "rejected"
                          ? "#ffcdd2"
                          : "neutral.light",
                    }}
                  >
                    <CardContent>
                      <ListItem>
                        <PersonIcon color="primary" sx={{ mr: 2 }} />
                        <ListItemText primary={patient.name} />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => openVideoDialog(patient)}
                        >
                          Review video
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
        onClose={closeVideoDialog}
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
          Review Video
          <IconButton
            aria-label="close"
            onClick={closeVideoDialog}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  {/* Video Player */}
                  <video width="100%" controls>
                    <source src={selectedPatient?.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Action Buttons */}
                  <Box display="flex" justifyContent="space-around" mt={2}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleAccept}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleReject}
                    >
                      Reject
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
