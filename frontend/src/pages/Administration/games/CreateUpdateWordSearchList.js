// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Switch,
//   FormControlLabel,
// } from "@mui/material";
// import axios from "../../../components/axios"; // replace with your axios instance

// export default function CreateUpdateWordSearchList() {
//   const { id } = useParams(); // Check if we're editing an existing list
//   const navigate = useNavigate();

//   const [wordList, setWordList] = useState({
//     name: "",
//     description: "",
//     words: [],
//     active: false,
//     totalGameTime: 0, // Initialize with default total game time
//   });
//   const [newWord, setNewWord] = useState(""); // For adding new words

//   useEffect(() => {
//     if (id) {
//       // Fetch the word list for editing if an ID is provided
//       axios
//         .get(`/wordLists/${id}`)
//         .then((response) => {
//           setWordList(response.data);
//         })
//         .catch((error) => {
//           console.error("Error fetching word list", error);
//         });
//     }
//   }, [id]);

//   const handleAddWord = () => {
//     if (newWord) {
//       setWordList((prev) => ({
//         ...prev,
//         words: [...prev.words, newWord.toUpperCase()],
//       }));
//       setNewWord(""); // Clear input after adding
//     }
//   };

//   const handleRemoveWord = (wordToRemove) => {
//     setWordList((prev) => ({
//       ...prev,
//       words: prev.words.filter((word) => word !== wordToRemove),
//     }));
//   };

//   const handleSubmit = () => {
//     const { name, description, words, active, totalGameTime } = wordList; // Destructure only the fields you want to send
//     const updatePayload = { name, description, words, active, totalGameTime };
//     if (id) {
//       // Update word list
//       axios
//         .put(`/wordLists/${id}`, updatePayload)
//         .then(() => {
//           navigate("/admin/wordsearchmenu");
//         })
//         .catch((error) => {
//           console.error("Error updating word list", error);
//         });
//     } else {
//       // Create new word list
//       axios
//         .post("/wordLists", updatePayload)
//         .then(() => {
//           navigate("/admin/wordsearchmenu");
//         })
//         .catch((error) => {
//           console.error("Error creating word list", error);
//         });
//     }
//   };

//   return (
//     <Container>
//       <Typography variant="h4" sx={{ marginBottom: 2 }}>
//         {id ? "Edit Word List" : "Create New Word List"}
//       </Typography>

//       <TextField
//         label="Name"
//         fullWidth
//         value={wordList.name}
//         onChange={(e) => setWordList({ ...wordList, name: e.target.value })}
//         sx={{ marginBottom: 2 }}
//       />
//       <TextField
//         label="Description"
//         fullWidth
//         value={wordList.description}
//         onChange={(e) =>
//           setWordList({ ...wordList, description: e.target.value })
//         }
//         sx={{ marginBottom: 2 }}
//       />
//       <TextField
//         label="Total Game Time (in seconds)"
//         type="number"
//         fullWidth
//         value={wordList.totalGameTime}
//         onChange={(e) =>
//           setWordList({
//             ...wordList,
//             totalGameTime: parseInt(e.target.value, 10),
//           })
//         }
//         sx={{ marginBottom: 2 }}
//       />
//       <FormControlLabel
//         control={
//           <Switch
//             checked={wordList.active}
//             onChange={(e) =>
//               setWordList({ ...wordList, active: e.target.checked })
//             }
//           />
//         }
//         label="Active"
//         sx={{ marginBottom: 2 }}
//       />

//       <Typography variant="h6" sx={{ marginBottom: 2 }}>
//         Words
//       </Typography>

//       <Box sx={{ display: "flex", marginBottom: 2 }}>
//         <TextField
//           label="New Word"
//           value={newWord}
//           onChange={(e) => setNewWord(e.target.value)}
//           sx={{ marginRight: 2 }}
//         />
//         <Button variant="contained" onClick={handleAddWord}>
//           Add Word
//         </Button>
//       </Box>

//       <Box sx={{ marginBottom: 2 }}>
//         {wordList.words.map((word, index) => (
//           <Box
//             key={index}
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginBottom: 1,
//             }}
//           >
//             <Typography>{word}</Typography>
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={() => handleRemoveWord(word)}
//             >
//               Remove
//             </Button>
//           </Box>
//         ))}
//       </Box>

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleSubmit}
//         sx={{ marginTop: 2 }}
//       >
//         {id ? "Update Word List" : "Create Word List"}
//       </Button>
//     </Container>
//   );
// }

// CreateUpdateWordSearchList.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Grid,
} from "@mui/material";
import axios from "../../../components/axios"; // replace with your axios instance

export default function CreateUpdateWordSearchList() {
  const { id } = useParams(); // Check if we're editing an existing list
  const navigate = useNavigate();

  const [wordList, setWordList] = useState({
    name: { en: "", ms: "" },
    description: { en: "", ms: "" },
    words: [], // array of { en: '', ms: '' }
    active: false,
    totalGameTime: 90, // Default total game time
  });

  const [newWord, setNewWord] = useState({ en: "", ms: "" }); // For adding new words

  useEffect(() => {
    if (id) {
      // Fetch the word list for editing if an ID is provided
      axios
        .get(`/wordLists/${id}`)
        .then((response) => {
          setWordList(response.data);
        })
        .catch((error) => {
          console.error("Error fetching word list", error);
        });
    }
  }, [id]);

  const handleAddWord = () => {
    if (newWord.en && newWord.ms) {
      setWordList((prev) => ({
        ...prev,
        words: [...prev.words, { en: newWord.en, ms: newWord.ms }],
      }));
      setNewWord({ en: "", ms: "" }); // Clear inputs after adding
    }
  };

  const handleRemoveWord = (indexToRemove) => {
    setWordList((prev) => ({
      ...prev,
      words: prev.words.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = () => {
    const { name, description, words, active, totalGameTime } = wordList; // Destructure only the fields you want to send
    const updatePayload = { name, description, words, active, totalGameTime };
    if (id) {
      // Update word list
      axios
        .put(`/wordLists/${id}`, updatePayload)
        .then(() => {
          navigate("/admin/wordsearchmenu");
        })
        .catch((error) => {
          console.error("Error updating word list", error);
        });
    } else {
      // Create new word list
      axios
        .post("/wordLists", updatePayload)
        .then(() => {
          navigate("/admin/wordsearchmenu");
        })
        .catch((error) => {
          console.error("Error creating word list", error);
        });
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        {id ? "Edit Word List" : "Create New Word List"}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name (EN)"
            fullWidth
            value={wordList.name.en}
            onChange={(e) =>
              setWordList({
                ...wordList,
                name: { ...wordList.name, en: e.target.value },
              })
            }
            sx={{ marginBottom: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name (MS)"
            fullWidth
            value={wordList.name.ms}
            onChange={(e) =>
              setWordList({
                ...wordList,
                name: { ...wordList.name, ms: e.target.value },
              })
            }
            sx={{ marginBottom: 2 }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Description (EN)"
            fullWidth
            value={wordList.description.en}
            onChange={(e) =>
              setWordList({
                ...wordList,
                description: { ...wordList.description, en: e.target.value },
              })
            }
            sx={{ marginBottom: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Description (MS)"
            fullWidth
            value={wordList.description.ms}
            onChange={(e) =>
              setWordList({
                ...wordList,
                description: { ...wordList.description, ms: e.target.value },
              })
            }
            sx={{ marginBottom: 2 }}
          />
        </Grid>
      </Grid>

      <TextField
        label="Total Game Time (in seconds)"
        type="number"
        fullWidth
        value={wordList.totalGameTime}
        onChange={(e) =>
          setWordList({
            ...wordList,
            totalGameTime: parseInt(e.target.value, 10),
          })
        }
        sx={{ marginBottom: 2 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={wordList.active}
            onChange={(e) =>
              setWordList({ ...wordList, active: e.target.checked })
            }
          />
        }
        label="Active"
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Words
      </Typography>

      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} sm={5}>
          <TextField
            label="New Word (EN)"
            value={newWord.en}
            onChange={(e) => setNewWord({ ...newWord, en: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            label="New Word (MS)"
            value={newWord.ms}
            onChange={(e) => setNewWord({ ...newWord, ms: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            onClick={handleAddWord}
            sx={{ height: "100%" }}
            fullWidth
          >
            Add Word
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ marginBottom: 2 }}>
        {wordList.words.map((word, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 1,
              border: "1px solid #ccc",
              padding: 1,
              borderRadius: 4,
            }}
          >
            <Typography>
              {index + 1}. EN: {word.en} | MS: {word.ms}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleRemoveWord(index)}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ marginTop: 2 }}
      >
        {id ? "Update Word List" : "Create Word List"}
      </Button>
    </Container>
  );
}
