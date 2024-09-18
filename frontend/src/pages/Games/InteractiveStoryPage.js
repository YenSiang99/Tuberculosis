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
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const InteractiveStoryPage = () => {
  // Function to generate image URLs based on the content
  const generateImageUrl = (content) => {
    const formattedContent = content
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/\s+/g, "-");
    return `https://image.pollinations.ai/prompt/${formattedContent}-kids-animation-16-by-9-image`;
  };

  // Temporary hardcoded story data with dynamic image generation
  const storyData = {
    title: "Journey of a TB Patient",
    storyId: "story1",
    steps: [
      {
        stepId: "step1",
        content:
          "John, a 30-year-old male, has been coughing for more than 3 weeks. What should John do?",
        options: [
          {
            optionText: "Ignore it and hope it gets better.",
            nextStep: "end1",
          },
          {
            optionText: "Visit a healthcare professional.",
            nextStep: "step2",
          },
        ],
      },
      {
        stepId: "step2",
        content:
          "John decides to visit a healthcare professional. The doctor suggests a TB test. Should John proceed with the test?",
        options: [
          {
            optionText: "Decline the test due to fear of results.",
            nextStep: "end2",
          },
          {
            optionText: "Agree to the test to know for sure.",
            nextStep: "step3",
          },
        ],
      },
      {
        stepId: "step3",
        content:
          "John's test results come back positive for TB. The doctor suggests starting treatment immediately. Does John:",
        options: [
          {
            optionText:
              "Start treatment immediately, understanding the importance of addressing TB early.",
            nextStep: "end3",
          },
          {
            optionText:
              "Decide to seek a second opinion before starting treatment.",
            nextStep: "end4",
          },
        ],
      },
    ],
    ends: [
      {
        endId: "end1",
        content:
          "Ignoring the symptoms, John's condition worsens, demonstrating the danger of neglecting early signs of TB.",
        endType: "negative",
      },
      {
        endId: "end2",
        content:
          "Fear leads to worse health outcomes. John's condition deteriorates because he didn't proceed with the necessary tests.",
        endType: "negative",
      },
      {
        endId: "end3",
        content:
          "By starting treatment early, John manages to recover fully, showing the importance of prompt medical response to TB.",
        endType: "positive",
      },
      {
        endId: "end4",
        content:
          "Seeking a second opinion delays John's treatment, complicating his recovery. Immediate treatment could have prevented complications.",
        endType: "negative",
      },
    ],
  };

  const [currentStepId, setCurrentStepId] = useState(storyData.steps[0].stepId);
  const [retries, setRetries] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const currentStep =
    storyData.steps.find((step) => step.stepId === currentStepId) ||
    storyData.ends.find((end) => end.endId === currentStepId);
  const isEnd = currentStepId.startsWith("end");

  const theme = useTheme();
  const [openInstructionDialog, setOpenInstructionDialog] = useState(true);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCloseInstructionDialog = () => {
    setOpenInstructionDialog(false);
  };

  const handleRestartStory = () => {
    setRetries(0);
    setStartTime(Date.now());
    setCurrentStepId(storyData.steps[0].stepId);
  };

  const handleRetryStory = () => {
    setRetries(retries + 1);
    setCurrentStepId(storyData.steps[0].stepId);
  };

  const calculateTimeTaken = () => {
    return ((Date.now() - startTime) / 1000).toFixed(2); // returns time in seconds
  };

  useEffect(() => {
    if (!openInstructionDialog) {
      setStartTime(Date.now());
    }
  }, [openInstructionDialog]);

  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.primary.light }}
      >
        Interactive Story
      </Typography>
      <Grid container spacing={1}>
        {/* Title */}
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
                    <Grid item>
                      <Typography variant="h6" sx={{ color: "red" }}>
                        Oh no! Wrong Move! Please start the story from the
                        beginning and try again!...
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      container
                      xs={12}
                      sx={{
                        textAlign: "left",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Grid item xs={6}>
                        <Typography variant="h6">Number of retries</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">: {retries}</Typography>
                      </Grid>
                    </Grid>
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
                    <Grid item xs={12}>
                      <Typography variant="h6" color="green">
                        Congratulations! You've reached the end of the story!
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      container
                      xs={12}
                      sx={{
                        textAlign: "left",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
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
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRestartStory}
                      >
                        Restart Story
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
