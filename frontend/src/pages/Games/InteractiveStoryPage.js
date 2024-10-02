import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "../../components/axios";

const InteractiveStoryPage = () => {
  const [storyData, setStoryData] = useState({
    title: "Journey of a TB Patient",
    steps: [
      {
        content:
          "John, a 30-year-old male, has been coughing for more than 3 weeks. What should John do?",
        options: [
          {
            optionText: "Ignore it and hope it gets better.",
            nextStep: "end2",
          },
          {
            optionText: "Visit a healthcare professional.",
            nextStep: "end1",
          },
        ],
      },
    ],
    ends: [
      {
        content:
          "Ignoring the symptoms, John's condition worsens, demonstrating the danger of neglecting early signs of TB.",
        endType: "positive",
      },
      {
        content:
          "Fear leads to worse health outcomes. John's condition deteriorates because he didn't proceed with the necessary tests.",
        endType: "negative",
      },
    ],
  });
  const [currentStepId, setCurrentStepId] = useState(
    storyData.steps[0].content
  );
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // For error handling

  const [retries, setRetries] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const currentStep =
    storyData.steps.find((step) => step.content === currentStepId) ||
    storyData.ends.find((end) => end.content === currentStepId);
  const isEnd = currentStep && "endType" in currentStep;

  const [gameStart, setGameStart] = useState(false);

  const theme = useTheme();
  const [openInstructionDialog, setOpenInstructionDialog] = useState(true);

  // Function to generate image URLs based on the content
  const generateImageUrl = (content) => {
    const formattedContent = content
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/\s+/g, "-");
    return `https://image.pollinations.ai/prompt/${formattedContent}-kids-animation-16-by-9-image`;
  };

  const handleCloseInstructionDialog = () => {
    setOpenInstructionDialog(false);
    setGameStart(true);
  };

  const handleOpenInstructionDialog = () => {
    setOpenInstructionDialog(true);
  };

  const handleRestartStory = () => {
    setRetries(0);
    setStartTime(Date.now());
    setCurrentStepId(storyData.steps[0].content);
  };

  const handleRetryStory = () => {
    setRetries(retries + 1);
    setCurrentStepId(storyData.steps[0].content);
  };

  const calculateTimeTaken = () => {
    return ((Date.now() - startTime) / 1000).toFixed(2); // returns time in seconds
  };

  const submitStoryScore = async () => {
    const storedUserData = JSON.parse(sessionStorage.getItem("userData"));

    if (!storedUserData) return; // Only submit score if user is logged in

    const payload = {
      numberOfRetries: retries,
      totalTimeTaken: calculateTimeTaken(),
    };

    try {
      const response = await axios.post("/score/stories/submit", payload);
      console.log("Score submitted successfully", response.data);
    } catch (error) {
      console.error("Failed to submit story score", error);
    }
  };

  // Set start time to calculate total time taken
  useEffect(() => {
    if (gameStart) {
      setStartTime(Date.now());
    }
  }, [gameStart]);

  // Fetch story api
  useEffect(() => {
    // Fetch active story from the API
    axios
      .get("/stories/active")
      .then((response) => {
        console.log("reading stories .. response.data", response.data);
        setStoryData(response.data);
        setCurrentStepId(response.data.steps[0].content); // Set initial step to the first step
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((err) => {
        setError("Failed to load the story.");
        setLoading(false);
      });
  }, []);

  // Determine whether the user reaches the correct ending
  useEffect(() => {
    if (isEnd && currentStep.endType === "positive") {
      submitStoryScore(); // Automatically submit the score on positive ending
    }
  }, [isEnd, currentStep]);

  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      {" "}
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
      >
        Interactive Story
      </Typography>
      <Grid container spacing={1}>
        {/* Title */}
        <Grid
          item
          container
          xs={12}
          sx={{ justifyContent: "start", alignItems: "center" }}
        >
          <Button
            variant="contained"
            onClick={() => {
              handleOpenInstructionDialog();
            }}
          >
            View Instruction
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">{storyData.title}</Typography>
        </Grid>
        {/* <Grid item xs={12}>
          <Typography variant="h4">
            Start Time: {new Date(startTime).toLocaleString()}
          </Typography>
        </Grid> */}

        <Grid
          item
          container
          spacing={2}
          direction="row"
          sx={{ alignItems: "center", alignItems: "stretch" }}
        >
          {/* photo */}
          <Grid item xs={12} md={6}>
            <Grid item xs={6}>
              <Typography variant="h6"> Retries: {retries}</Typography>
            </Grid>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={generateImageUrl(currentStep.content)}
                alt="Dynamic story image"
                sx={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </Card>
          </Grid>
          {/* Content and Decisions */}
          <Grid
            item
            container
            direction="column"
            sx={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
            spacing={1}
            xs={12}
            md={6}
          >
            <Grid item>
              <Typography variant="h6">{currentStep.content}</Typography>
            </Grid>
            {!isEnd &&
              currentStep.options.map((option, index) => (
                <Grid item key={index}>
                  <Button
                    variant="outlined"
                    onClick={() => setCurrentStepId(option.nextStep)}
                    sx={{ width: "100%" }}
                  >
                    {option.optionText}
                  </Button>
                </Grid>
              ))}
            {isEnd && (
              <Grid container spacing={1} sx={{ justifyContent: "center" }}>
                {currentStep.endType === "negative" ? (
                  <Grid
                    item
                    container
                    xs={12}
                    md={8}
                    spacing={1}
                    sx={{ justifyContent: "center", alignItems: "center" }}
                  >
                    {/* Negative ending content */}
                    <Grid item>
                      <Typography variant="h6" sx={{ color: "red" }}>
                        Oh no! Wrong Move! Please start the story from the
                        beginning and try again!...
                      </Typography>
                    </Grid>
                    {/* Retry the story */}
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRetryStory}
                      >
                        Retry Story
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid
                    item
                    container
                    xs={12}
                    md={8}
                    spacing={1}
                    sx={{ justifyContent: "center", alignItems: "center" }}
                  >
                    {/* Positive ending content */}
                    <Grid item xs={12}>
                      <Typography variant="h6" color="green">
                        Congratulations! You've reached the end of the story!
                      </Typography>
                    </Grid>
                    {/* Display retries and total time */}
                    <Grid item xs={6}>
                      <Typography variant="h6">Number of retries</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">: {retries}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">Total time taken</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">
                        : {calculateTimeTaken()} seconds
                      </Typography>
                    </Grid>
                    {/* Call the API to submit the score */}
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRestartStory}
                      >
                        Restart Story!
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        // fullScreen={fullScreen}
        open={openInstructionDialog}
        onClose={handleCloseInstructionDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Quiz Game: How To Play?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            1. <strong>Introduction to the Story:</strong> <br />
            Begin by reading the scenario presented on the screen. Each step
            describes a situation that requires a decision.
            <br />
            <br />
            2. <strong>Make Your Choice:</strong> <br />
            Select the option that you think is the best decision. If you choose
            correctly, you will proceed to the next step.
            <br />
            <br />
            3. <strong>Game Over:</strong> <br />
            If you make the wrong choice, the game will end. You can restart the
            story and try again by clicking the "Restart Story" button.
            <br />
            <br />
            4. <strong>Goal:</strong> <br />
            The goal is to make the correct decisions that lead to a successful
            outcome in the story.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInstructionDialog} autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InteractiveStoryPage;
