import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import theme from "../../components/reusable/Theme";
import PatientSidebar from "../../components/reusable/PatientBar";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "../../components/axios"; 

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

const getStatusColor = (status) => {
  const statusColorMap = {
    "pending upload for today": "#FFF59D", // Light Yellow
    "pending approval": "#BBDEFB", // Light Blue
    "approved": "#C8E6C9", // Light Green
    "rejected": "#FFCDD2", // Light Red
  };

  return statusColorMap[status] || "#e0e0e0"; // Default color if status is not recognized
};

export default function PatientVideo() {
  const [videoData, setVideoData] = useState({
    status: 'pending upload for today',
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

  const getDailyUserVideo = async () => {
    try {
      const response = await axios.get("/videos/getDailyUserVideo");
      console.log(response.data)
      if (response.data){
        setVideoData(response.data)
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
    // Call the getOrCreateVideo API to check or create a video for the day
    console.log('use effect hook called...')
    getDailyUserVideo();
  }, []);

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
    if (!videoFile) {
      setAlertInfo({
        show: true,
        type: "error",
        message: "Please select a video to upload.",
      });
      return;
    }
    const formData = new FormData();
    formData.append("video", videoFile); // "video" is the key expected by your backend
    setUploadProgress(0);
    try {
      const response = await axios.post(
        `/videos/uploadVideo`, // Assuming videoData contains the video ID
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

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
    } catch (error) {
      console.error("Error uploading video:", error);
      setAlertInfo({
        show: true,
        type: "error",
        message: "Failed to upload video.",
      });
      setUploadProgress(0); // Reset upload progress on failure
    }
  };

  const handleDeleteVideo = () => {
    setVideoFile(null);
    setVideoURL("");
    setUploadProgress(0);
    setVideoUploaded(false);
    setAlertInfo({
      show: true,
      type: "success",
      message: "Video has been deleted.",
    });
  };

  const handleCloseAlert = () => {
    setAlertInfo({ show: false, type: "", message: "" });
  };

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
          <Box
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: getStatusColor(videoData?.status), 
              borderRadius: "4px",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{fontWeight: "bold",}}
            >
              Status: {videoData ? capitalizeWords(videoData.status) : null}
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
                    {videoFile ? videoFile.name : "Choose a video to upload"}
                  </InputLabelStyled>
                  <InputStyled
                    accept="video/*"
                    id="video-upload-button"
                    type="file"
                    onChange={handleVideoChange}
                  />
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      component="span"
                      onClick={() =>
                        document.getElementById("video-upload-button").click()
                      }
                      sx={{ width: "auto", mt: 2 }}
                    >
                      Browse
                    </Button>
                  </Box>
                </FormControl>
              )}

              {videoURL && !videoUploaded && (
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
                    onClick={handleDeleteVideo}
                    sx={{ mt: 2 }}
                    disabled={videoData?.status === "approved" || videoData?.status === "rejected"}

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
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
