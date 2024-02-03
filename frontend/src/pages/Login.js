import React, { useState } from "react";
import {
  ThemeProvider,
  Typography,
  Box,
  Container,
  Button,
  Dialog,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  TextField,
  Grid,
  IconButton,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import theme from "../components/reusable/Theme";
import BgImage from "../images/cover.jpeg";
import logo from "../images/logo.png";


import axios from "../components/axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [openRoleSelect, setOpenRoleSelect] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { setAuth } = useAuth();
  // Navigate to TB information page
  const handleMoreInfo = () => {
    navigate("/tb-info");
  };

  // Handle registration button click
  const handleRegister = () => {
    toggleRoleSelectDialog();
  };

  // Handle role selection
  const handleRoleChange = (event) => {
    setUserRole(event.target.value);
  };

  // Toggle role selection dialog
  const toggleRoleSelectDialog = () => {
    setOpenRoleSelect(!openRoleSelect);
  };

  // Navigate to registration with the selected role
  const navigateToRegister = (role) => {
    navigate(`/register/${role}`);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  // Custom style for the Dialog Title
  const dialogTitleStyle = {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    textAlign: "center",
    padding: theme.spacing(2),
  };

  // Custom style for List Items
  const listItemStyle = {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    cursor: "pointer",
    padding: theme.spacing(2),
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", { email, password });
      const { token } = response.data;

      // Decode the token to get the roles
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded);

      // Store the token and user data based on the "Remember Me" selection
      if (rememberMe) {
        // Store in local storage if "Remember Me" is checked
        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(decoded));
      } else {
        // Store in session storage if "Remember Me" is not checked
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userData", JSON.stringify(decoded));
      }

      setAuth(true);

      // Check if roles is defined and is an array
      if (decoded.roles) {
        if (decoded.roles.includes("patient")) {
          navigate("/patientvideo");
        } else if (decoded.roles.includes("healthcare")) {
          navigate("/healthcarepatient");
        } else {
          setAuth(false);
          console.log("User role not recognized or unauthorized");
        }
      } else {
        console.log("Roles not defined or not an array");
        // Handle case where roles is not defined or not in the expected format
      }
    } catch (error) {
      setAuth(false);
      console.error(
        "Login error:",
        error.response ? error.response.data : error
      );
      // Handle login errors here
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <img
            src={logo}
            alt="Logo"
            style={{ height: "50px", marginRight: theme.spacing(2) }}
          />
          <Typography variant="h5" color="inherit">
            <span style={{ color: "#0046c0", fontWeight: "bold" }}>My</span>
            <span style={{ color: "#4cbcea", fontWeight: "bold" }}>TB</span>
            <span style={{ color: "#0046c0", fontWeight: "bold" }}>
              Companion
            </span>
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Banner */}
      <Box
        sx={{
          minHeight: "45vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          p: theme.spacing(4),
          backgroundImage: `linear-gradient(to bottom, rgba(217, 241, 251, 0.8), rgba(217, 241, 251, 0.8)), url(${BgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ color: "black", fontWeight: "bold" }}
        >
          Tuberculosis (TB)
        </Typography>
        <Typography variant="h5" sx={{ color: "black", mb: 2 }}>
          A bacterial infection that affects your lungs
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="body1"
            component="span"
            sx={{ color: "black", mr: 2 }}
          >
            Would you like to know more about TB?
          </Typography>
          <Button
            variant="outlined" // Change to outlined
            color="primary" // Set the color to primary
            onClick={handleMoreInfo}
            sx={{
              borderRadius: 25,
              padding: theme.spacing(1, 4),
              borderColor: "primary",
              borderWidth: 2,
              color: "primary",
              backgroundColor: "#fff",
              "&:hover": {
                color: "#fff",
                backgroundColor: "#0046c0",
              },
            }}
          >
            Yes
          </Button>
        </Box>

        {/* Ensuring that the login form does not block the text */}
        <Box sx={{ position: "absolute", top: "50%", width: "100%", p: 4 }}>
          <Container
            maxWidth="sm"
            sx={{
              backgroundColor: "background.paper",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              borderRadius: 4,
              p: 4,
            }}
          >
            <Typography
              variant="h6"
              color="textPrimary"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Login
            </Typography>
            <form onSubmit={handleLogin}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    variant="filled"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword} // Toggle the visibility
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item xs={6} style={{ textAlign: "left" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={handleRememberMeChange}
                        />
                      }
                      label="Remember me"
                    />
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: "right" }}>
                    <Link
                      to="/forgot-password"
                      style={{
                        textDecoration: "none",
                        color: theme.palette.primary.main,
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>
                {/* Login Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Login
                  </Button>
                </Grid>
                {/* Register Link */}
                <Grid item xs={12} style={{ textAlign: "center" }}>
                  <Typography variant="body1" sx={{ color: "black", mt: 2 }}>
                    Not a user yet?{" "}
                    <Link
                      to="#"
                      style={{
                        textDecoration: "none",
                        color: theme.palette.primary.main,
                      }}
                      onClick={handleRegister}
                    >
                      Register
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </Container>
        </Box>
      </Box>
      {/* Role Selection Dialog */}
      <Dialog open={openRoleSelect} onClose={toggleRoleSelectDialog}>
        <DialogTitle style={dialogTitleStyle}>Select Your Role</DialogTitle>
        <List>
          <ListItemButton
            style={listItemStyle}
            onClick={() => navigateToRegister("patient")}
          >
            <ListItemText primary="Patient" />
          </ListItemButton>
          <ListItemButton
            style={listItemStyle}
            onClick={() => navigateToRegister("healthcare")}
          >
            <ListItemText primary="Healthcare Professional" />
          </ListItemButton>
        </List>
      </Dialog>
    </ThemeProvider>
  );
}
