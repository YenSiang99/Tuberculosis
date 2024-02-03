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

import axios from "../../components/axios"; // Adjust the import path to your axios instance accordingly


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
  const [videoData, setVideoData] = useState(null);
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

  useEffect(() => {
    // Call the getOrCreateVideo API to check or create a video for the day
    const getOrCreateVideo = async () => {
      try {
        const response = await axios.put("/videos/getOrCreateVideo");
        setVideoData(response.data);
        if (response.data.videoUrl) {
          setVideoURL(response.data.videoUrl);
          setVideoUploaded(response.data.status !== 'pending upload'); // Example condition, adjust based on your API response
        }
      } catch (error) {
        console.error("Error fetching or creating video:", error);
        // Optionally set an alert or handle the error in the UI
        setAlertInfo({
          show: true,
          type: "error",
          message: "Error fetching video information.",
        });
      }
    };

    getOrCreateVideo();
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
  
    // Initialize FormData
    const formData = new FormData();
    formData.append("video", videoFile); // "video" is the key expected by your backend
  
    // Set upload progress to 0
    setUploadProgress(0);
  
    try {
      const response = await axios.post(`/videos/uploadVideo/${videoData._id}`, // Assuming videoData contains the video ID
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      );
  
      // Video uploaded successfully
      console.log('Finished uploading video')
      setVideoData(response.data);
      setVideoURL(response.data.videoUrl)
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
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { sm: "240px", md: "240px" } }}>
        
          <pre style={{ overflowX: "auto", backgroundColor: "#f5f5f5", padding: "1rem" }}>
            {JSON.stringify(videoData, null, 2)}
          </pre>

      </Box>
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
              backgroundColor: videoUploaded ? "#BBDEFB" : "#FFF59D",
              borderRadius: "4px",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                color: videoUploaded
                  ? "rgba(0, 0, 0, 0.87)"
                  : "rgba(0, 0, 0, 0.87)",
              }}
            >
              Status: {videoData ? videoData.status: null}
            </Typography>
          </Box>

         
          <Paper
            elevation={3}
            sx={{ p: 3, mb: 4, mt: 5 }}
          >
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
