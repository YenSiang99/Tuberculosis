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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../components/axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { Switch, FormControlLabel } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DataViewer from "../../../components/reusable/DataViewer";

export default function StoryCreateUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState({
    title: "",
    description: "",
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
      // Create mode: Add a default step and two ends
      setStory({
        title: "",
        description: "",
        steps: [
          {
            content: "",
            options: [
              { optionText: "", nextStep: "" },
              { optionText: "", nextStep: "" },
            ],
          },
        ],
        ends: [
          { content: "Example Positive Ending", endType: "positive" },
          { content: "Example Negative Ending", endType: "negative" },
        ],
        active: false,
      });
    }
  }, [id]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setStory((prevStory) => ({
  //     ...prevStory,
  //     [name]: value,
  //   }));
  // };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStory((prevStory) => ({
      ...prevStory,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...story.steps];
    updatedSteps[index][field] = value;
    setStory((prevStory) => ({ ...prevStory, steps: updatedSteps }));
  };

  const handleEndChange = (index, field, value) => {
    const updatedEnds = [...story.ends];
    updatedEnds[index][field] = value;
    setStory((prevStory) => ({ ...prevStory, ends: updatedEnds }));
  };

  const handleOptionChange = (stepIndex, optionIndex, field, value) => {
    const updatedSteps = [...story.steps];
    updatedSteps[stepIndex].options = updatedSteps[stepIndex].options.map(
      (option, idx) => {
        if (idx === optionIndex) {
          return { ...option, [field]: value };
        }
        return option;
      }
    );
    setStory((prevStory) => ({
      ...prevStory,
      steps: updatedSteps,
    }));
  };

  const addStep = () => {
    setStory((prevStory) => ({
      ...prevStory,
      steps: [
        ...prevStory.steps,
        {
          content: "",
          options: [
            { optionText: "", nextStep: "" },
            { optionText: "", nextStep: "" },
          ],
        },
      ],
    }));
  };

  const addEnd = () => {
    setStory((prevStory) => ({
      ...prevStory,
      ends: [...prevStory.ends, { content: "", endType: "positive" }],
    }));
  };

  const removeStep = (index) => {
    const updatedSteps = [...story.steps];
    updatedSteps.splice(index, 1);
    setStory((prevStory) => ({ ...prevStory, steps: updatedSteps }));
  };

  const removeEnd = (index) => {
    const updatedEnds = [...story.ends];
    updatedEnds.splice(index, 1);
    setStory((prevStory) => ({ ...prevStory, ends: updatedEnds }));
  };

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

  // Helper function to calculate available options for the select
  const availableOptions = (stepIndex, optionIndex) => {
    // Gather all selected next steps (across all steps)
    const selectedNextSteps = story.steps.flatMap((step) =>
      step.options
        .filter(
          (opt, oIndex) =>
            oIndex !== optionIndex || stepIndex !== story.steps.indexOf(step)
        ) // Ensure not to include the current option being edited
        .map((opt) => opt.nextStep)
    );

    // Available steps - exclude the current step and previous steps, and exclude selected options
    const availableSteps = story.steps
      .filter(
        (s, index) =>
          index !== stepIndex &&
          index > stepIndex && // only future steps can be selected
          !selectedNextSteps.includes(s.content) // Exclude already selected steps
      )
      .map((s) => s.content);

    // Available ends - exclude selected next steps that have already been chosen
    const availableEnds = story.ends
      .filter((end) => !selectedNextSteps.includes(end.content)) // Exclude already selected ends across all steps
      .map((end) => end.content);

    return [...availableSteps, ...availableEnds];
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        {id ? "Edit Story" : "Create New Story"}
      </Typography>
      {/* <DataViewer data={story} variableName="story"></DataViewer> */}
      <Box>
        <TextField
          fullWidth
          label="Story Title"
          name="title"
          value={story.title}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={story.description}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
        />
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
        <Button onClick={addStep} variant="contained" sx={{ marginBottom: 2 }}>
          Add Step
        </Button>
        {story.steps.map((step, stepIndex) => (
          <Card key={stepIndex} sx={{ marginBottom: 2 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              Page {stepIndex + 1}
            </Typography>
            <CardContent>
              <TextField
                fullWidth
                label={`Story Title`}
                value={step.content}
                onChange={(e) =>
                  handleStepChange(stepIndex, "content", e.target.value)
                }
                sx={{ marginBottom: 2 }}
              />
              {step.options.map((option, optionIndex) => (
                <Box key={optionIndex} sx={{ marginBottom: 2 }}>
                  <TextField
                    fullWidth
                    label={`Decision ${optionIndex + 1}`}
                    value={option.optionText}
                    onChange={(e) =>
                      handleOptionChange(
                        stepIndex,
                        optionIndex,
                        "optionText",
                        e.target.value
                      )
                    }
                    sx={{ marginBottom: 1 }}
                  />
                  <FormControl fullWidth sx={{ marginBottom: 1 }}>
                    <InputLabel>Go to Page/Ending</InputLabel>
                    <Select
                      value={option.nextStep}
                      onChange={(e) =>
                        handleOptionChange(
                          stepIndex,
                          optionIndex,
                          "nextStep",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {availableOptions(stepIndex, optionIndex).map(
                        (content, idx) => (
                          <MenuItem key={idx} value={content}>
                            {content}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Box>
              ))}
              <Button
                onClick={() => removeStep(stepIndex)}
                variant="contained"
                startIcon={<DeleteIcon />}
              >
                Remove step
              </Button>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addEnd} variant="contained" sx={{ marginBottom: 2 }}>
          Add End
        </Button>
        {story.ends.map((end, index) => (
          <Card key={index} sx={{ marginBottom: 2 }}>
            <CardContent>
              <TextField
                fullWidth
                label={`Ending ${index + 1} `}
                value={end.content}
                onChange={(e) =>
                  handleEndChange(index, "content", e.target.value)
                }
                sx={{ marginBottom: 2 }}
              />
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>End Type</InputLabel>
                <Select
                  value={end.endType}
                  onChange={(e) =>
                    handleEndChange(index, "endType", e.target.value)
                  }
                >
                  <MenuItem value="positive">Positive</MenuItem>
                  <MenuItem value="negative">Negative</MenuItem>
                </Select>
              </FormControl>
              <IconButton onClick={() => removeEnd(index)}>
                <DeleteIcon />
              </IconButton>
            </CardContent>
          </Card>
        ))}

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

// import React, { useState, useEffect, useCallback } from "react";
// import ReactFlow, {
//   ReactFlowProvider,
//   addEdge,
//   removeElements,
//   MiniMap,
//   Controls,
//   Background,
//   Handle,
//   Position,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import axios from "../../../components/axios";
// import { useParams } from "react-router-dom";

// const nodeTypes = {
//   stepNode: StepNode,
//   endNode: EndNode,
// };

// // Custom node for steps
// function StepNode({ data }) {
//   return (
//     <div
//       style={{
//         padding: 10,
//         border: "1px solid #777",
//         borderRadius: 5,
//         background: "#fff",
//       }}
//     >
//       <strong>{data.label}</strong>
//       <div style={{ marginTop: 10 }}>
//         {data.options.map((option, index) => (
//           <div key={index}>
//             Option {index + 1}: {option.optionText}
//           </div>
//         ))}
//       </div>
//       <Handle
//         type="source"
//         position={Position.Bottom}
//         id="a"
//         style={{ background: "#555" }}
//       />
//       <Handle
//         type="target"
//         position={Position.Top}
//         id="b"
//         style={{ background: "#555" }}
//       />
//     </div>
//   );
// }

// // Custom node for ends
// function EndNode({ data }) {
//   return (
//     <div
//       style={{
//         padding: 10,
//         border: "1px solid #777",
//         borderRadius: 5,
//         background: "#fdd",
//       }}
//     >
//       <strong>{data.label}</strong>
//       <div style={{ marginTop: 10 }}>Type: {data.endType}</div>
//       <Handle
//         type="target"
//         position={Position.Top}
//         id="b"
//         style={{ background: "#555" }}
//       />
//     </div>
//   );
// }

// function StoryCreateUpdate() {
//   const { id } = useParams();
//   const [story, setStory] = useState(null);
//   const [elements, setElements] = useState([]);

//   useEffect(() => {
//     // Fetch the story data
//     if (id) {
//       axios
//         .get(`/stories/${id}`)
//         .then((response) => {
//           setStory(response.data);
//         })
//         .catch((error) => {
//           console.error("Error fetching story", error);
//         });
//     }
//   }, [id]);

//   useEffect(() => {
//     if (story) {
//       const els = generateElements(story);
//       setElements(els);
//     }
//   }, [story]);

//   // Function to generate nodes and edges from story data
//   const generateElements = (storyData) => {
//     const nodes = [];
//     const edges = [];

//     // Create step nodes
//     storyData.steps.forEach((step, stepIndex) => {
//       nodes.push({
//         id: `step-${stepIndex}`,
//         type: "stepNode",
//         position: { x: 250 * stepIndex, y: 100 },
//         data: {
//           label: step.content,
//           options: step.options,
//         },
//       });
//     });

//     // Create end nodes
//     storyData.ends.forEach((end, endIndex) => {
//       nodes.push({
//         id: `end-${endIndex}`,
//         type: "endNode",
//         position: { x: 250 * endIndex, y: 400 },
//         data: {
//           label: end.content,
//           endType: end.endType,
//         },
//       });
//     });

//     // Create edges based on options
//     storyData.steps.forEach((step, stepIndex) => {
//       step.options.forEach((option, optionIndex) => {
//         // Find the target node (could be a step or an end)
//         const targetStepIndex = storyData.steps.findIndex(
//           (s) => s.content === option.nextStep
//         );
//         const targetEndIndex = storyData.ends.findIndex(
//           (e) => e.content === option.nextStep
//         );

//         if (targetStepIndex !== -1) {
//           edges.push({
//             id: `e${stepIndex}-${targetStepIndex}-${optionIndex}`,
//             source: `step-${stepIndex}`,
//             target: `step-${targetStepIndex}`,
//             label: option.optionText,
//             arrowHeadType: "arrowclosed",
//           });
//         } else if (targetEndIndex !== -1) {
//           edges.push({
//             id: `e${stepIndex}-end-${targetEndIndex}-${optionIndex}`,
//             source: `step-${stepIndex}`,
//             target: `end-${targetEndIndex}`,
//             label: option.optionText,
//             arrowHeadType: "arrowclosed",
//           });
//         }
//       });
//     });

//     return [...nodes, ...edges];
//   };

//   // Handlers for React Flow events
//   const onConnect = useCallback(
//     (params) => setElements((els) => addEdge(params, els)),
//     []
//   );
//   const onElementsRemove = useCallback(
//     (elementsToRemove) =>
//       setElements((els) => removeElements(elementsToRemove, els)),
//     []
//   );
//   const onLoad = useCallback((reactFlowInstance) => {
//     reactFlowInstance.fitView();
//   }, []);

//   return (
//     <div style={{ height: "80vh", width: "100%" }}>
//       {story ? (
//         <ReactFlowProvider>
//           <ReactFlow
//             elements={elements}
//             nodeTypes={nodeTypes}
//             onConnect={onConnect}
//             onElementsRemove={onElementsRemove}
//             onLoad={onLoad}
//             snapToGrid={true}
//             snapGrid={[15, 15]}
//           >
//             <MiniMap
//               nodeStrokeColor={(n) => {
//                 if (n.type === "endNode") return "#f00";
//                 return "#00f";
//               }}
//               nodeColor={(n) => {
//                 if (n.type === "endNode") return "#fdd";
//                 return "#ddf";
//               }}
//             />
//             <Controls />
//             <Background color="#aaa" gap={16} />
//           </ReactFlow>
//         </ReactFlowProvider>
//       ) : (
//         <div>Loading story...</div>
//       )}
//     </div>
//   );
// }

// export default StoryCreateUpdate;
