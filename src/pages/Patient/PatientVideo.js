import React, { useState, useRef, useEffect } from "react";
import {
  ThemeProvider,
  Drawer,
  Box,
  Typography,
  Button,
  Paper,
  FormControl,
  Input,
  LinearProgress,
  Dialog,
  Alert,
  IconButton,
  useMediaQuery,
  Container,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import theme from "../../components/reusable/Theme";
import PatientSidebar from "../../components/reusable/PatientBar";
import MenuIcon from "@mui/icons-material/Menu";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import VideocamIcon from "@mui/icons-material/Videocam";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../../components/axios";
import Webcam from "react-webcam";

const InputLabelStyled = styled("label")(({ theme }) => ({
  display: "block",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  fontSize: "1rem",
  fontWeight: "bold",
}));

const InputStyled = styled(Input)(({ theme }) => ({
  display: "none",
}));

const UploadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    boxShadow: "none",
    overflow: "visible",
  },
}));

export default function PatientVideo() {
  const [userDetails, setUserDetails] = useState({});
  const [videoData, setVideoData] = useState({
    status: "pending upload for today",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [openWebcamDialog, setOpenWebcamDialog] = useState(false);

  // Function to open the dialog
  const handleOpenWebcamDialog = () => {
    setOpenWebcamDialog(true);
  };

  // Function to close the dialog
const handleCloseWebcamDialog = () => {
  setOpenWebcamDialog(false);
  stopWebcam(); // Ensure the webcam is stopped
  setVideoURL(""); // Clear the video URL
  setRecordedChunks([]); // Clear the recorded chunks
};

const handleCloseWebcamDialogAfterUploading = () => {
  setOpenWebcamDialog(false);
};


  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startRecording = () => {
    if (webcamRef.current && webcamRef.current.video) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (webcamRef.current) {
            webcamRef.current.srcObject = stream;
          }
          mediaRecorderRef.current = new MediaRecorder(stream, {
            mimeType: "video/webm",
          });
          mediaRecorderRef.current.ondataavailable = handleDataAvailable;
          mediaRecorderRef.current.start();
          setIsRecording(true);
        })
        .catch((error) => {
          console.error("Error accessing the webcam", error);
          // Handle the error appropriately in your UI
        });
    }
  };

  const stopWebcam = () => {
    if (webcamRef.current && webcamRef.current.srcObject) {
        const tracks = webcamRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
    }
};


  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);

    // Correctly stop the webcam stream to release resources
    if (webcamRef.current && webcamRef.current.srcObject) {
        const tracks = webcamRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
    }

    if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const previewUrl = URL.createObjectURL(blob);
        setVideoURL(previewUrl);
    } else {
        console.error("No recorded chunks available for preview.");
    }
};


  const handleDataAvailable = ({ data }) => {
    console.log("Data available from recording");
    if (data.size > 0) {
      setRecordedChunks((prev) => [...prev, data]);
    }
  };

  const handleUploadRecordedVideo = async () => {
    if (recordedChunks.length === 0) {
      alert("No video recorded.");
      return;
    }

    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const file = new File([blob], "webcamRecording.webm", {
      type: "video/webm",
    });

    // Create FormData and append the file
    const formData = new FormData();
    formData.append("video", file);

    try {
      // Replace '/uploadVideo' with your actual endpoint URL
      const response = await axios.post("/videos/uploadVideo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);

      // Video uploaded successfully
      console.log("Finished uploading video");
      setVideoData(response.data);
      setVideoURL(response.data.videoUrl);
      setVideoUploaded(true);

      // Handle success (e.g., show a message or update state)
      setAlertInfo({
        show: true,
        type: "success",
        message: "Video uploaded successfully!",
      });

      // Close the dialog and reset states
      handleCloseWebcamDialogAfterUploading();
      setRecordedChunks([]);
    } catch (error) {
      console.error("Error uploading video:", error.response.data);
      setAlertInfo({
        show: true,
        type: "error",
        message: "Failed to upload video.",
      });
    }
  };

  useEffect(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const previewUrl = URL.createObjectURL(blob);
      setVideoURL(previewUrl);
    }
  }, [recordedChunks]); // Depend on recordedChunks to trigger

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const handleToggleConfirmDialog = () => {
    setOpenConfirmDialog(!openConfirmDialog);
  };

  const promptDeleteVideo = () => {
    handleToggleConfirmDialog();
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get("/users/profile");
      if (response.data) {
        setUserDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      // Handle error
    }
  };

  const getDailyUserVideo = async () => {
    try {
      const response = await axios.get("/videos/getDailyUserVideo");
      console.log(response.data);
      if (response.data) {
        setVideoData(response.data);
        setVideoURL(response.data.videoUrl);
        setVideoUploaded(true);
      }
    } catch (error) {
      console.error("Error fetching or creating video:", error);
      // Optionally set an alert or handle the error in the UI
      setAlertInfo({
        show: true,
        type: "error",
        message: "Error fetching video daily user video.",
      });
    }
  };

  useEffect(() => {
    console.log("use effect hook called...");
    getDailyUserVideo();
    getUserDetails();
  }, []);

  const hasTreatmentEnded = () => {
    if (!userDetails.treatmentEndDate) return false;
    const treatmentEndDate = new Date(userDetails.treatmentEndDate);
    const today = new Date();
    return treatmentEndDate < today;
  };

  const getStatusColor = (status) => {
    if (
      ["Switch to DOTS", "Appointment to see doctor"].includes(
        userDetails.careStatus
      )
    ) {
      return "#bdbdbd"; // Grey color for specific statuses
    } else if (hasTreatmentEnded()) {
      return "#bdbdbd"; // Grey color if the treatment has ended
    }

    const statusColorMap = {
      "pending upload for today": "#FFF59D", // Light Yellow
      "pending approval": "#BBDEFB", // Light Blue
      approved: "#C8E6C9", // Light Green
      rejected: "#FFCDD2", // Light Red
    };

    return statusColorMap[status] || "#e0e0e0"; // Default color if status is not recognized
  };

  // Function to toggle drawer
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoURL(URL.createObjectURL(file));
      setUploadProgress(0);
      setVideoUploaded(false);
      setAlertInfo({ show: false, type: "", message: "" });
    } else {
      setVideoFile(null);
      setVideoURL("");
      setVideoUploaded(false);
    }
  };

  const handleUpload = async () => {
    let videoBlob;

    // If no videoFile is selected, check if there are recorded chunks (from webcam)
    if (!videoFile && recordedChunks.length > 0) {
      videoBlob = new Blob(recordedChunks, { type: "video/webm" });
    } else if (!videoFile) {
      setAlertInfo({
        show: true,
        type: "error",
        message: "Please select a video to upload or record one.",
      });
      return;
    }

    const formData = new FormData();
    if (videoBlob) {
      // If videoBlob exists, append it as a File object
      formData.append(
        "video",
        new File([videoBlob], "recordedVideo.webm", { type: "video/webm" })
      );
    } else {
      // Else, append the selected file
      formData.append("video", videoFile);
    }

    setUploadProgress(0);
    try {
      const response = await axios.post(`/videos/uploadVideo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      // Video uploaded successfully
      console.log("Finished uploading video");
      setVideoData(response.data);
      setVideoURL(response.data.videoUrl);
      setVideoUploaded(true); // Update state to indicate video has been uploaded
      setAlertInfo({
        show: true,
        type: "success",
        message: "Video uploaded successfully!",
      });
      // Resetting states after upload
      setRecordedChunks([]);
      setVideoFile(null);
    } catch (error) {
      console.error(
        "Error uploading video:",
        error.response?.data || error.message
      );
      setAlertInfo({
        show: true,
        type: "error",
        message: "Failed to upload video.",
      });
      setUploadProgress(0); // Reset upload progress on failure
    }
  };

  const handleDeleteVideo = async () => {
    if (!videoData || !videoData._id) {
      setAlertInfo({
        show: true,
        type: "error",
        message: "No video selected for deletion.",
      });
      return;
    }

    try {
      await axios.delete(`/videos/deleteVideo/${videoData._id}`);
      // Successfully deleted video
      setVideoFile(null);
      setVideoURL("");
      setUploadProgress(0);
      setVideoUploaded(false);
      setVideoData({ status: "pending upload for today" }); // Reset video data
      setAlertInfo({
        show: true,
        type: "success",
        message: "Video deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting video:", error.response.data);
      setAlertInfo({
        show: true,
        type: "error",
        message: "Failed to delete video.",
      });
    }
    setOpenConfirmDialog(false);
  };

  const handleCloseAlert = () => {
    setAlertInfo({ show: false, type: "", message: "" });
  };

  function capitalizeWords(input) {
    if (!input) return "";

    return input
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

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
          <Box
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: getStatusColor(
                videoData?.status || userDetails.careStatus
              ),
              borderRadius: "4px",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {["Switch to DOTS", "Appointment to see doctor"].includes(
                userDetails.careStatus
              ) ? (
                <>
                  Status: {userDetails.careStatus}. You no longer need to upload
                  videos.
                </>
              ) : hasTreatmentEnded() ? (
                "Your treatment has ended. You no longer need to upload videos."
              ) : (
                `Video Status: ${capitalizeWords(videoData.status)}`
              )}
            </Typography>
          </Box>

          <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 5 }}>
            <Box
              sx={{
                p: 3,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                component="div"
                sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
              >
                {videoUploaded ? "Your Video" : "Upload Video"}
              </Typography>
              {!videoUploaded && (
                <FormControl fullWidth margin="normal">
                  <InputLabelStyled
                    htmlFor="video-upload-button"
                    sx={{ fontWeight: "normal", fontSize: "1rem" }}
                  >
                    {videoFile
                      ? videoFile.name
                      : "Choose a video to upload or record one"}
                  </InputLabelStyled>
                  <InputStyled
                    accept="video/*"
                    id="video-upload-button"
                    type="file"
                    onChange={handleVideoChange}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      component="span"
                      onClick={() =>
                        document.getElementById("video-upload-button").click()
                      }
                      sx={{ mt: 2 }}
                      startIcon={<FileUploadIcon />}
                    >
                      Browse File
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleOpenWebcamDialog} // This opens the dialog with the webcam
                      disabled={isRecording}
                      sx={{ mt: 2 }}
                      startIcon={<VideocamIcon />}
                    >
                      Record Video
                    </Button>
                  </Box>
                </FormControl>
              )}

              {videoURL && !videoUploaded && !openWebcamDialog && (
                <Box sx={{ mt: 2, maxWidth: "480px" }}>
                  <Typography variant="h6" gutterBottom>
                    Video Preview
                  </Typography>
                  <video width="100%" controls>
                    <source src={videoURL} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              )}

              {videoUploaded && (
                <Box sx={{ mt: 2, maxWidth: "480px" }}>
                  <video width="100%" controls>
                    <source src={videoURL} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={promptDeleteVideo}
                    sx={{ mt: 2 }}
                    disabled={
                      videoData?.status === "approved" ||
                      videoData?.status === "rejected"
                    }
                  >
                    Delete Video
                  </Button>
                </Box>
              )}

              {!videoUploaded && (
                <>
                  <UploadButton
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={!videoFile || uploadProgress !== 0}
                  >
                    Upload Video
                  </UploadButton>
                  {uploadProgress > 0 && (
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                    />
                  )}
                </>
              )}

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
              <CustomDialog
                open={openConfirmDialog}
                onClose={handleToggleConfirmDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Delete Video"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this video?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleToggleConfirmDialog}>Cancel</Button>
                  <Button onClick={handleDeleteVideo} autoFocus color="error">
                    Delete
                  </Button>
                </DialogActions>
              </CustomDialog>
              <Dialog
                open={openWebcamDialog}
                onClose={handleCloseWebcamDialog}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle>
                  Record Your Video
                  <IconButton
                    aria-label="close"
                    onClick={handleCloseWebcamDialog}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      color: (theme) => theme.palette.grey[500],
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  {videoURL ? (
                    <video controls src={videoURL} style={{ width: "100%" }} />
                  ) : (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      style={{ width: "100%" }}
                    />
                  )}
                </DialogContent>

                <DialogActions>
                  {videoURL ? (
                    <>
                      <Button
                        onClick={() => {
                          setVideoURL("");
                          setRecordedChunks([]);
                        }}
                      >
                        Record Again
                      </Button>
                      <Button onClick={handleUploadRecordedVideo}>
                        Upload Video
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={startRecording} disabled={isRecording}>
                        Start Recording
                      </Button>
                      <Button onClick={stopRecording} disabled={!isRecording}>
                        Stop Recording
                      </Button>
                    </>
                  )}
                </DialogActions>
              </Dialog>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
