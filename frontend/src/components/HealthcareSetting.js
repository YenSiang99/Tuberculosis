import React, { useState } from "react";
import {
  ThemeProvider,
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
  FormGroup,
  Divider,
  IconButton,
  useMediaQuery,
  Container,
  Paper,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import MenuIcon from "@mui/icons-material/Menu";

import theme from "./reusable/Theme";
import HealthcareSidebar from "./reusable/HealthcareBar";

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: "#fff",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
  cardActions: {
    justifyContent: "flex-end",
    display: "flex",
  },
  button: {
    color: "#fff",
    "&:hover": {
      backgroundColor: "#6386C3",
    },
  },
  saveButton: {
    color: "#fff",
    backgroundColor: "#4CAF50",
    "&:hover": {
      backgroundColor: "#388E3C",
    },
  },
  cancelButton: {
    color: "#d32f2f",
    borderColor: "#d32f2f",
    "&:hover": {
      backgroundColor: "#F9DDDD",
    },
  },
  actionButton: {
    flexGrow: 1, // This makes each button take equal space
  },
}));

export default function HealthcareSetting() {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  // Function to toggle drawer
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const [profile, setProfile] = useState({
    name: "Jack Doe",
    role: "Doctor",
    category: "Government",
  });

  const [personalInfoEditable, setPersonalInfoEditable] = useState(false);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const togglePersonalInfoEdit = () => {
    setPersonalInfoEditable(!personalInfoEditable);
  };

  const ProfileView = ({ label, value }) => (
    <Typography variant="body1" gutterBottom>
      <strong>{splitCamelCaseToString(label)}:</strong> {value}
    </Typography>
  );

  const splitCamelCaseToString = (s) => {
    const knownAcronyms = ["IC"];

    return s
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
      .split(" ")
      .map((word) => {
        if (knownAcronyms.includes(word.toUpperCase())) {
          return word.toUpperCase();
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
      })
      .join(" ");
  };

  const handleCancelEdit = () => {
    setPersonalInfoEditable(false);
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
        <HealthcareSidebar handleDrawerToggle={handleDrawerToggle} />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: "240px", md: "240px" },
          backgroundColor: "background.default",
        }}
      >
        <Container>
          <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 5 }}>
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                component="div"
                sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
              >
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {personalInfoEditable ? (
                <FormGroup>
                  {Object.entries(profile)
                    .slice(0, 6)
                    .map(([key, value]) => (
                      <TextField
                        key={key}
                        label={splitCamelCaseToString(key)}
                        name={key}
                        value={value}
                        onChange={handleProfileChange}
                        margin="normal"
                        fullWidth
                      />
                    ))}
                </FormGroup>
              ) : (
                Object.entries(profile)
                  .slice(0, 6)
                  .map(([key, value]) => (
                    <ProfileView
                      key={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={value}
                    />
                  ))
              )}
              <Button
                className={`${classes.actionButton} ${
                  personalInfoEditable ? classes.saveButton : classes.button
                }`}
                color="primary"
                variant="contained"
                onClick={togglePersonalInfoEdit}
                sx={{mr:2}}
              >
                {personalInfoEditable ? "Save Changes" : "Edit"}
              </Button>
              {personalInfoEditable && (
                <Button
                  className={`${classes.actionButton} ${classes.cancelButton}`}
                  variant="outlined"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Paper>
        </Container>

        <Container>
          <Button variant="contained">Reset Password</Button>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
