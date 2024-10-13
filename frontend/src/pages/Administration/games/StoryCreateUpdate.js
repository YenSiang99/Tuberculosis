// StoryCreateUpdate.js
import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../components/axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { Switch, FormControlLabel } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function StoryCreateUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState({
    title: { en: "", ms: "" },
    description: { en: "", ms: "" },
    steps: [],
    ends: [],
    active: false,
  });

  useEffect(() => {
    if (id) {
      axios
        .get(`/stories/${id}`)
        .then((response) => {
          setStory(response.data);
        })
        .catch((error) => {
          console.error("Error fetching story", error);
        });
    } else {
      // Create mode: Initialize empty steps and ends
      setStory({
        title: { en: "", ms: "" },
        description: { en: "", ms: "" },
        steps: [],
        ends: [],
        active: false,
      });
    }
  }, [id]);

  // Handle changes to multilingual fields
  const handleLanguageChange = (field, language, value) => {
    setStory((prevStory) => ({
      ...prevStory,
      [field]: {
        ...prevStory[field],
        [language]: value,
      },
    }));
  };

  // Handle changes in steps
  const handleStepChange = (index, language, value) => {
    const updatedSteps = [...story.steps];
    updatedSteps[index].content[language] = value;
    setStory((prevStory) => ({ ...prevStory, steps: updatedSteps }));
  };

  // Handle option changes
  const handleOptionChange = (
    stepIndex,
    optionIndex,
    field,
    language,
    value
  ) => {
    const updatedSteps = [...story.steps];
    if (field === "optionText") {
      updatedSteps[stepIndex].options[optionIndex][field][language] = value;
    } else {
      updatedSteps[stepIndex].options[optionIndex][field] = value;
    }
    setStory((prevStory) => ({ ...prevStory, steps: updatedSteps }));
  };

  // Handle changes in ends
  const handleEndChange = (index, language, value) => {
    const updatedEnds = [...story.ends];
    updatedEnds[index].content[language] = value;
    setStory((prevStory) => ({ ...prevStory, ends: updatedEnds }));
  };

  const handleEndFieldChange = (index, field, value) => {
    const updatedEnds = [...story.ends];
    updatedEnds[index][field] = value;
    setStory((prevStory) => ({ ...prevStory, ends: updatedEnds }));
  };

  // Add a new step
  const addStep = () => {
    const newStepId = `step${story.steps.length + 1}`;
    setStory((prevStory) => ({
      ...prevStory,
      steps: [
        ...prevStory.steps,
        {
          stepId: newStepId,
          content: { en: "", ms: "" },
          options: [],
        },
      ],
    }));
  };

  // Add a new option to a step
  const addOption = (stepIndex) => {
    const updatedSteps = [...story.steps];
    updatedSteps[stepIndex].options.push({
      optionText: { en: "", ms: "" },
      nextStep: "",
    });
    setStory((prevStory) => ({ ...prevStory, steps: updatedSteps }));
  };

  // Remove an option from a step
  const removeOption = (stepIndex, optionIndex) => {
    const updatedSteps = [...story.steps];
    updatedSteps[stepIndex].options.splice(optionIndex, 1);
    setStory((prevStory) => ({ ...prevStory, steps: updatedSteps }));
  };

  // Add a new end
  const addEnd = () => {
    const newEndId = `end${story.ends.length + 1}`;
    setStory((prevStory) => ({
      ...prevStory,
      ends: [
        ...prevStory.ends,
        {
          endId: newEndId,
          content: { en: "", ms: "" },
          endType: "positive",
        },
      ],
    }));
  };

  // Remove a step
  const removeStep = (index) => {
    const updatedSteps = [...story.steps];
    updatedSteps.splice(index, 1);
    setStory((prevStory) => ({ ...prevStory, steps: updatedSteps }));
  };

  // Remove an end
  const removeEnd = (index) => {
    const updatedEnds = [...story.ends];
    updatedEnds.splice(index, 1);
    setStory((prevStory) => ({ ...prevStory, ends: updatedEnds }));
  };

  // Handle form submission
  const handleSubmit = () => {
    const method = id ? axios.put : axios.post;
    const url = id ? `/stories/${id}` : "/stories";

    method(url, story)
      .then(() => {
        navigate("/admin/storymenu");
      })
      .catch((error) => {
        console.error("Error submitting story", error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        {id ? "Edit Story" : "Create New Story"}
      </Typography>
      <Box>
        {/* Title Fields */}
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Story Title (EN)"
              value={story.title.en}
              onChange={(e) =>
                handleLanguageChange("title", "en", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Story Title (MS)"
              value={story.title.ms}
              onChange={(e) =>
                handleLanguageChange("title", "ms", e.target.value)
              }
            />
          </Grid>
        </Grid>
        {/* Description Fields */}
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Description (EN)"
              value={story.description.en}
              onChange={(e) =>
                handleLanguageChange("description", "en", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Description (MS)"
              value={story.description.ms}
              onChange={(e) =>
                handleLanguageChange("description", "ms", e.target.value)
              }
            />
          </Grid>
        </Grid>

        {/* Active Status */}
        <FormControlLabel
          control={
            <Switch
              checked={story.active}
              onChange={(e) =>
                setStory((prevStory) => ({
                  ...prevStory,
                  active: e.target.checked,
                }))
              }
              name="active"
              color="primary"
            />
          }
          label="Active Status"
        />

        {/* Steps */}
        <Typography variant="h5" sx={{ marginTop: 3 }}>
          Steps
        </Typography>
        <Button onClick={addStep} variant="contained" sx={{ marginBottom: 2 }}>
          Add Step
        </Button>
        {story.steps.map((step, stepIndex) => (
          <Card key={stepIndex} sx={{ marginBottom: 2, padding: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Step {stepIndex + 1} (ID: {step.stepId})
            </Typography>
            <IconButton
              onClick={() => removeStep(stepIndex)}
              sx={{ float: "right" }}
            >
              <DeleteIcon />
            </IconButton>
            <CardContent>
              {/* Step Content Fields */}
              <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Step Content (EN)"
                    value={step.content.en}
                    onChange={(e) =>
                      handleStepChange(stepIndex, "en", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Step Content (MS)"
                    value={step.content.ms}
                    onChange={(e) =>
                      handleStepChange(stepIndex, "ms", e.target.value)
                    }
                  />
                </Grid>
              </Grid>

              {/* Options */}
              {step.options.map((option, optionIndex) => (
                <Box key={optionIndex} sx={{ marginBottom: 2 }}>
                  <Typography variant="subtitle1">
                    Option {optionIndex + 1}
                  </Typography>
                  <Grid container spacing={2} sx={{ marginBottom: 1 }}>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Option Text (EN)"
                        value={option.optionText.en}
                        onChange={(e) =>
                          handleOptionChange(
                            stepIndex,
                            optionIndex,
                            "optionText",
                            "en",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Option Text (MS)"
                        value={option.optionText.ms}
                        onChange={(e) =>
                          handleOptionChange(
                            stepIndex,
                            optionIndex,
                            "optionText",
                            "ms",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <IconButton
                        onClick={() => removeOption(stepIndex, optionIndex)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  {/* Next Step Selection */}
                  <FormControl fullWidth sx={{ marginBottom: 1 }}>
                    <InputLabel>Next Step/End</InputLabel>
                    <Select
                      value={option.nextStep}
                      onChange={(e) =>
                        handleOptionChange(
                          stepIndex,
                          optionIndex,
                          "nextStep",
                          null,
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {story.steps.map((s, idx) => (
                        <MenuItem key={s.stepId} value={s.stepId}>
                          Step {idx + 1} (ID: {s.stepId})
                        </MenuItem>
                      ))}
                      {story.ends.map((end, idx) => (
                        <MenuItem key={end.endId} value={end.endId}>
                          End {idx + 1} (ID: {end.endId})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              ))}
              <Button
                onClick={() => addOption(stepIndex)}
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{ marginBottom: 2 }}
              >
                Add Option
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Ends */}
        <Typography variant="h5" sx={{ marginTop: 3 }}>
          Ends
        </Typography>
        <Button onClick={addEnd} variant="contained" sx={{ marginBottom: 2 }}>
          Add End
        </Button>
        {story.ends.map((end, index) => (
          <Card key={index} sx={{ marginBottom: 2, padding: 2 }}>
            <Typography variant="h6">
              End {index + 1} (ID: {end.endId})
            </Typography>
            <IconButton
              onClick={() => removeEnd(index)}
              sx={{ float: "right" }}
            >
              <DeleteIcon />
            </IconButton>
            <CardContent>
              {/* End Content Fields */}
              <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="End Content (EN)"
                    value={end.content.en}
                    onChange={(e) =>
                      handleEndChange(index, "en", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="End Content (MS)"
                    value={end.content.ms}
                    onChange={(e) =>
                      handleEndChange(index, "ms", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
              {/* End Type Selection */}
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>End Type</InputLabel>
                <Select
                  value={end.endType}
                  onChange={(e) =>
                    handleEndFieldChange(index, "endType", e.target.value)
                  }
                >
                  <MenuItem value="positive">Positive</MenuItem>
                  <MenuItem value="negative">Negative</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        ))}

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ marginTop: 2 }}
        >
          {id ? "Update Story" : "Create Story"}
        </Button>
      </Box>
    </Container>
  );
}
