import React, { useState } from 'react';
import { Container, Typography, Button, Grid, Card, CardMedia } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const InteractiveStoryPage = () => {
  // Function to generate image URLs based on the content
  const generateImageUrl = (content) => {
    const formattedContent = content.replace(/[^a-zA-Z ]/g, "").replace(/\s+/g, "-");
    console.log(formattedContent)
    return `https://image.pollinations.ai/prompt/${formattedContent}-kids-animation-16-by-9-image`;
  };

  // Temporary hardcoded story data with dynamic image generation
  const storyData = {
    title: "Journey of a TB Patient",
    storyId: "story1",
    steps: [
      {
        stepId: "step1",
        content: "John, a 30-year-old male, has been coughing for more than 3 weeks. What should John do?",
        options: [
          {
            optionText: "Ignore it and hope it gets better.",
            nextStep: "end1"
          },
          {
            optionText: "Visit a healthcare professional.",
            nextStep: "step2"
          }
        ]
      },
      {
        stepId: "step2",
        content: "John decides to visit a healthcare professional. The doctor suggests a TB test. Should John proceed with the test?",
        options: [
          {
            optionText: "Decline the test due to fear of results.",
            nextStep: "end2"
          },
          {
            optionText: "Agree to the test to know for sure.",
            nextStep: "step3"
          }
        ]
      },
      {
        stepId: "step3",
        content: "John's test results come back positive for TB. The doctor suggests starting treatment immediately. Does John:",
        options: [
          {
            optionText: "Start treatment immediately, understanding the importance of addressing TB early.",
            nextStep: "end3"
          },
          {
            optionText: "Decide to seek a second opinion before starting treatment.",
            nextStep: "end4"
          }
        ]
      }
    ],
    ends: [
      {
        endId: "end1",
        content: "Ignoring the symptoms, John's condition worsens, demonstrating the danger of neglecting early signs of TB."
      },
      {
        endId: "end2",
        content: "Fear leads to worse health outcomes. John's condition deteriorates because he didn't proceed with the necessary tests."
      },
      {
        endId: "end3",
        content: "By starting treatment early, John manages to recover fully, showing the importance of prompt medical response to TB."
      },
      {
        endId: "end4",
        content: "Seeking a second opinion delays John's treatment, complicating his recovery. Immediate treatment could have prevented complications."
      }
    ]
  };

  const [currentStepId, setCurrentStepId] = useState(storyData.steps[0].stepId);
  const currentStep = storyData.steps.find(step => step.stepId === currentStepId) || storyData.ends.find(end => end.endId === currentStepId);
  const isEnd = currentStepId.startsWith('end');
  const theme = useTheme();

  return (
    <Container sx={{padding: 0 , margin: 0 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold",  color: theme.palette.primary.light }}
      >
        Interactive Story
      </Typography>
      <Grid 
        container
        spacing={1} 
        sx={{
          justifyContent: "center",
          alignItems: "center",

        }} 
      >
        {/* Tutle and photo */}
        <Grid item  container direction='column' xs={12} sm={12} md={6} lg={6}> 
          <Grid item>
            <Typography variant="h4" >{storyData.title}</Typography>
          </Grid>
          <Grid item>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={generateImageUrl(currentStep.content)}
                alt="Dynamic story image"
                sx={{
                  width:'100%',
                  height:'auto'
                }}
              />
            </Card>
          </Grid>
        </Grid>
        {/* Question and answer */}
        <Grid item container direction='column' 
          sx={{
            justifyContent: "center",
            alignItems:'center',
          }}  
          xs={12} sm={12} md={6} lg={6}
          spacing={2}
        > 
          {/* Question */}
          <Grid item>
              <Typography variant="h6"  >
                {currentStep.content}
              </Typography>
          </Grid>
          {/* Answers */}
          {!isEnd && currentStep.options.map((option, index) => (
            <Grid item>
              <Button
                key={index}
                variant="outlined"
                onClick={() => setCurrentStepId(option.nextStep)}
              >
                {option.optionText}
              </Button>
            </Grid>
          ))}
          {isEnd && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setCurrentStepId(storyData.steps[0].stepId)}
                sx={{ mt: 2 }}
              >
                Restart Story
              </Button>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default InteractiveStoryPage;
