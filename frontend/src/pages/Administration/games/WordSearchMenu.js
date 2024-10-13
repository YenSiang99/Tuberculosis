// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   IconButton,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Active icon
// import CancelIcon from "@mui/icons-material/Cancel"; // Inactive icon
// import { green, red } from "@mui/material/colors"; // Colors for active/inactive
// import { useNavigate } from "react-router-dom"; // for navigation
// import axios from "../../../components/axios"; // replace with your axios instance

// export default function WordSearchMenu() {
//   const [wordLists, setWordLists] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch the word lists on mount
//     axios
//       .get("/wordLists")
//       .then((response) => {
//         console.log(response.data);
//         setWordLists(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching word lists", error);
//       });
//   }, []);

//   const handleDelete = (id) => {
//     axios
//       .delete(`/wordLists/${id}`)
//       .then(() => {
//         // Remove deleted word list from state
//         setWordLists(wordLists.filter((wordList) => wordList._id !== id));
//       })
//       .catch((error) => {
//         console.error("Error deleting word list", error);
//       });
//   };

//   return (
//     <Container sx={{ padding: 0, margin: 0 }}>
//       <Typography variant="h4" sx={{ marginBottom: 2 }}>
//         Word Lists Management
//       </Typography>

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={() => navigate("/admin/wordsearchlist")}
//         sx={{ marginBottom: 2 }}
//       >
//         Create New Word List
//       </Button>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Description</TableCell>
//               <TableCell>Active/Inactive</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {wordLists.map((wordList) => (
//               <TableRow key={wordList._id}>
//                 <TableCell>{wordList.name}</TableCell>
//                 <TableCell>{wordList.description}</TableCell>
//                 <TableCell>
//                   {wordList.active ? (
//                     <CheckCircleIcon sx={{ color: green[500] }} /> // Green tick for active
//                   ) : (
//                     <CancelIcon sx={{ color: red[500] }} /> // Red cross for inactive
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   <IconButton
//                     onClick={() =>
//                       navigate(`/admin/wordsearchlist/${wordList._id}`)
//                     }
//                   >
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton onClick={() => handleDelete(wordList._id)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// }

// WordSearchMenu.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Active icon
import CancelIcon from "@mui/icons-material/Cancel"; // Inactive icon
import { green, red } from "@mui/material/colors"; // Colors for active/inactive
import { useNavigate } from "react-router-dom"; // for navigation
import axios from "../../../components/axios"; // replace with your axios instance

export default function WordSearchMenu() {
  const [wordLists, setWordLists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the word lists on mount
    axios
      .get("/wordLists")
      .then((response) => {
        console.log(response.data);
        setWordLists(response.data);
      })
      .catch((error) => {
        console.error("Error fetching word lists", error);
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`/wordLists/${id}`)
      .then(() => {
        // Remove deleted word list from state
        setWordLists(wordLists.filter((wordList) => wordList._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting word list", error);
      });
  };

  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Word Lists Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/admin/wordsearchlist")}
        sx={{ marginBottom: 2 }}
      >
        Create New Word List
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name (EN)</TableCell>
              <TableCell>Name (MS)</TableCell>
              <TableCell>Description (EN)</TableCell>
              <TableCell>Description (MS)</TableCell>
              <TableCell>Active/Inactive</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wordLists.map((wordList) => (
              <TableRow key={wordList._id}>
                <TableCell>{wordList.name.en}</TableCell>
                <TableCell>{wordList.name.ms}</TableCell>
                <TableCell>{wordList.description.en}</TableCell>
                <TableCell>{wordList.description.ms}</TableCell>
                <TableCell>
                  {wordList.active ? (
                    <CheckCircleIcon sx={{ color: green[500] }} />
                  ) : (
                    <CancelIcon sx={{ color: red[500] }} />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() =>
                      navigate(`/admin/wordsearchlist/${wordList._id}`)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(wordList._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
