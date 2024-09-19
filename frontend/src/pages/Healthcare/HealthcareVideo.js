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
  Grid,
  Paper,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../../components/axios";

export default function HealthcareVideo() {
  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("/videos/getUsersTable");
      setPatients(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching patients", error);
      // Handle error (e.g., show an error message)
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const openVideoDialog = async (patient) => {
    try {
      // Use `patient._id` if the ID field is named `_id`
      const response = await axios.get(`/videos/getVideo/${patient._id}`);
      const videoData = response.data;
      console.log("video response:", response.data);
      setSelectedPatient({ ...patient, videoUrl: videoData.videoUrl });
    } catch (error) {
      console.error("Error fetching video for patient", error);
      // Handle error appropriately
    }
  };

  const closeVideoDialog = () => {
    setSelectedPatient(null);
  };

  const getTodaysDateFormatted = () => {
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    return today.toLocaleDateString(undefined, options);
  };

  const updateVideoStatus = async (videoId, newStatus) => {
    try {
      await axios.patch(`/videos/updateVideo/${videoId}`, {
        status: newStatus,
      });
      console.log(`Video status updated to ${newStatus}`);
      // After updating, you might want to refresh the list of patients or videos
      fetchPatients();
    } catch (error) {
      console.error("Error updating video status", error);
    }
  };

  const handleAccept = () => {
    if (selectedPatient && selectedPatient._id) {
      updateVideoStatus(selectedPatient._id, "approved");
      closeVideoDialog();
    }
  };

  const handleReject = () => {
    if (selectedPatient && selectedPatient._id) {
      updateVideoStatus(selectedPatient._id, "rejected");
      closeVideoDialog();
    }
  };

  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Paper
        elevation={3}
        sx={{ p: 3, mb: 4, mt: 5, backgroundColor: "#f7f7f7" }}
      >
        <Typography
          variant="h5"
          gutterBottom
          component="div"
          sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
        >
          Review Video
        </Typography>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          gutterBottom
          component="div"
          sx={{ fontWeight: "normal", fontSize: "1rem", mt: 2 }}
        >
          Videos for {getTodaysDateFormatted()}
        </Typography>
        <List>
          {patients.map((patient) => (
            <Card
              key={patient.id}
              sx={{
                mb: 2,
                bgcolor:
                  patient.status === "approved"
                    ? "#c8e6c9"
                    : patient.status === "rejected"
                    ? "#ffcdd2"
                    : "neutral.light",
              }}
            >
              <CardContent>
                <ListItem>
                  <Avatar
                    src={patient.profilePicture}
                    alt={`${patient.firstName} ${patient.lastName}`}
                    sx={{ mr: 2 }}
                  />
                  <ListItemText primary={`${patient.patientName}`} />
                  {patient.status === "approved" && (
                    <Button
                      variant="contained"
                      disabled
                      sx={{ bgcolor: "#c8e6c9" }}
                    >
                      Approved
                    </Button>
                  )}
                  {patient.status === "rejected" && (
                    <Button
                      variant="contained"
                      disabled
                      sx={{ bgcolor: "#ffcdd2" }}
                    >
                      Rejected
                    </Button>
                  )}
                  {patient.status === "pending approval" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openVideoDialog(patient)}
                    >
                      Review video
                    </Button>
                  )}
                </ListItem>
              </CardContent>
            </Card>
          ))}
        </List>
      </Paper>

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
                  {/* Directly display the video player if a video URL is available for the selected patient */}
                  {selectedPatient?.videoUrl && (
                    <video width="50%" height="70%" controls>
                      <source src={selectedPatient.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box display="flex" justifyContent="space-around" mt={2}>
            <Button variant="contained" color="success" onClick={handleAccept}>
              Approve
            </Button>
            <Button variant="contained" color="error" onClick={handleReject}>
              Reject
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
