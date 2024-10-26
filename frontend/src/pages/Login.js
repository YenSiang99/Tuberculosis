// import React, { useState } from "react";
// import {
//   Typography,
//   Box,
//   Container,
//   Button,
//   Dialog,
//   DialogTitle,
//   List,
//   ListItemButton,
//   ListItemText,
//   TextField,
//   Grid,
//   IconButton,
//   InputAdornment,
//   Alert,
//   styled,
// } from "@mui/material";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import theme from "../components/reusable/Theme";
// import BgImage from "../assets/cover.jpeg";

// import axios from "../components/axios";
// import { useNavigate, Link } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import { useAuth } from "../context/AuthContext";

// import { useTranslation } from "react-i18next";

// export default function Login() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [openRoleSelect, setOpenRoleSelect] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [alertInfo, setAlertInfo] = useState({
//     show: false,
//     type: "",
//     message: "",
//   });

//   const { setAuth } = useAuth();
//   // Navigate to TB information page
//   const handleMoreInfo = () => {
//     navigate("/tb-info/infographics");
//   };

//   // Handle registration button click
//   const handleRegister = () => {
//     toggleRoleSelectDialog();
//   };

//   // Toggle role selection dialog
//   const toggleRoleSelectDialog = () => {
//     setOpenRoleSelect(!openRoleSelect);
//   };

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   const handleRememberMeChange = (event) => {
//     setRememberMe(event.target.checked);
//   };

//   // Custom style for the Dialog Title
//   const dialogTitleStyle = {
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.primary.contrastText,
//     textAlign: "center",
//     padding: theme.spacing(2),
//   };

//   // Custom style for List Items
//   const listItemStyle = {
//     "&:hover": {
//       backgroundColor: theme.palette.action.hover,
//     },
//     cursor: "pointer",
//     padding: theme.spacing(2),
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("/auth/login", { email, password });
//       const { token } = response.data;

//       // Decode the token to get the roles
//       const decoded = jwtDecode(token);
//       console.log("Decoded JWT:", decoded);

//       // Store the token and user data based on the "Remember Me" selection
//       if (rememberMe) {
//         localStorage.setItem("token", token);
//         localStorage.setItem("userData", JSON.stringify(decoded));
//       } else {
//         sessionStorage.setItem("token", token);
//         sessionStorage.setItem("userData", JSON.stringify(decoded));
//       }

//       setAuth(true);

//       // Navigate based on user roles
//       if (decoded.roles) {
//         if (decoded.roles.includes("patient")) {
//           navigate("/patient/video");
//         } else if (decoded.roles.includes("healthcare")) {
//           navigate("/healthcare/patient");
//         } else if (decoded.roles.includes("user")) {
//           navigate("/games/score-dashboard");
//         } else {
//           setAuth(false);
//           console.log("User role not recognized or unauthorized");
//         }
//       } else {
//         console.log("Roles not defined or not an array");
//       }
//     } catch (error) {
//       setAuth(false);
//       console.error(
//         "Login error:",
//         error.response ? error.response.data : error
//       );

//       if (error.response && error.response.status === 401) {
//         setAlertInfo({
//           show: true,
//           type: "error",
//           message: "Invalid email, phone number, or password",
//         });
//       } else {
//         setAlertInfo({
//           show: true,
//           type: "error",
//           message: "An error occurred. Please try again later.",
//         });
//       }
//     }
//   };

//   const handleCloseAlert = () => {
//     setAlertInfo({ show: false, type: "", message: "" });
//   };

//   const CustomDialog = styled(Dialog)(({ theme }) => ({
//     "& .MuiPaper-root": {
//       boxShadow: "none",
//       overflow: "visible",
//     },
//   }));

//   return (
//     <Box
//       sx={{
//         minHeight: "45vh",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         textAlign: "center",
//         p: theme.spacing(4),
//         backgroundImage: `linear-gradient(to bottom, rgba(217, 241, 251, 0.8), rgba(217, 241, 251, 0.8)), url(${BgImage})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <Grid
//         container
//         direction="column"
//         rowSpacing={{ xs: 1, sm: 2, md: 3, lg: 3 }}
//         alignItems="flex-center"
//       >
//         {/* Title */}
//         <Grid item>
//           <Typography
//             variant="h2"
//             component="h1"
//             sx={{ color: "black", fontWeight: "bold" }}
//           >
//             Tuberculosis (TB)
//           </Typography>
//         </Grid>

//         {/* Subtitle */}
//         <Grid item>
//           <Typography variant="h5" sx={{ color: "black" }}>
//             A bacterial infection that affects your lungs
//           </Typography>
//         </Grid>

//         {/* More info button with text */}
//         <Grid
//           item
//           container
//           justifyContent="center"
//           alignItems="center"
//           direction="row"
//           spacing={1}
//         >
//           <Grid item>
//             {" "}
//             <Typography
//               variant="body1"
//               component="span"
//               sx={{ color: "black" }}
//             >
//               Would you like to know more about TB?
//             </Typography>
//           </Grid>
//           <Grid item>
//             {" "}
//             <Button
//               variant="outlined" // Change to outlined
//               color="primary" // Set the color to primary
//               onClick={handleMoreInfo}
//               sx={{
//                 borderRadius: 25,
//                 padding: theme.spacing(1, 4),
//                 borderColor: "primary",
//                 borderWidth: 2,
//                 color: "primary",
//                 backgroundColor: "#fff",
//                 "&:hover": {
//                   color: "#fff",
//                   backgroundColor: "#0046c0",
//                 },
//               }}
//             >
//               Yes
//             </Button>
//           </Grid>
//         </Grid>
//       </Grid>

//       {/* Ensuring that the login form does not block the text */}
//       <Container
//         maxWidth="md"
//         sx={{
//           backgroundColor: "background.paper",
//           boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//           borderRadius: 4,
//           p: 4,
//           mt: 4, // Add margin-top to separate the form from the banner content
//         }}
//       >
//         <Typography
//           variant="h6"
//           color="textPrimary"
//           gutterBottom
//           sx={{ fontWeight: "bold" }}
//         >
//           Login
//         </Typography>
//         <form onSubmit={handleLogin}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 label="Email / Phone Number (eg 0123456789)"
//                 type="text"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 fullWidth
//                 variant="filled"
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 label="Password"
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 fullWidth
//                 variant="filled"
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         aria-label="toggle password visibility"
//                         onClick={handleClickShowPassword} // Toggle the visibility
//                         onMouseDown={handleMouseDownPassword}
//                         edge="end"
//                       >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Grid>
//             {/* <Grid
//               container
//               item
//               xs={12}
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Grid item xs={6} style={{ textAlign: "left" }}>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={rememberMe}
//                       onChange={handleRememberMeChange}
//                     />
//                   }
//                   label="Remember me"
//                 />
//               </Grid>
//               <Grid item xs={6} style={{ textAlign: "right" }}>
//                 <Link
//                   to="/forgot-password"
//                   style={{
//                     textDecoration: "none",
//                     color: theme.palette.primary.main,
//                   }}
//                 >
//                   Forgot password?
//                 </Link>
//               </Grid>
//             </Grid> */}
//             {/* Login Button */}
//             <Grid item xs={12}>
//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 color="primary"
//               >
//                 Login
//               </Button>
//             </Grid>
//             {/* Register Link */}
//             <Grid item xs={12} style={{ textAlign: "center" }}>
//               <Typography variant="body1" sx={{ color: "black", mt: 2 }}>
//                 Not a user yet?{" "}
//                 <Link
//                   to="#"
//                   style={{
//                     textDecoration: "none",
//                     color: theme.palette.primary.main,
//                     fontWeight: "bold",
//                   }}
//                   onClick={handleRegister}
//                 >
//                   Register
//                 </Link>
//               </Typography>
//             </Grid>
//           </Grid>
//         </form>
//       </Container>

//       {/* Role Selection Dialog */}
//       <Dialog open={openRoleSelect} onClose={toggleRoleSelectDialog}>
//         <DialogTitle style={dialogTitleStyle}>Select Your Role</DialogTitle>
//         <List>
//           <ListItemButton
//             style={listItemStyle}
//             onClick={() => navigate("/register/patient")}
//           >
//             <ListItemText primary="Patient" />
//           </ListItemButton>
//           <ListItemButton
//             style={listItemStyle}
//             onClick={() => navigate("/register/healthcare")}
//           >
//             <ListItemText primary="Healthcare Professional" />
//           </ListItemButton>
//           <ListItemButton
//             style={listItemStyle}
//             onClick={() => navigate("/register")}
//           >
//             <ListItemText primary="Normal User" />
//           </ListItemButton>
//         </List>
//       </Dialog>
//       <CustomDialog
//         open={alertInfo.show}
//         onClose={handleCloseAlert}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <Alert severity={alertInfo.type} onClose={handleCloseAlert}>
//           {alertInfo.message}
//         </Alert>
//       </CustomDialog>
//     </Box>
//   );
// }

import React, { useState } from "react";
import {
  Typography,
  Box,
  Container,
  Button,
  Dialog,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  Alert,
  styled,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import theme from "../components/reusable/Theme";
import BgImage from "../assets/cover.jpeg";

import axios from "../components/axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";

import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openRoleSelect, setOpenRoleSelect] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });

  const { setAuth } = useAuth();

  const handleMoreInfo = () => {
    navigate("/tb-info/infographics");
  };

  const handleRegister = () => {
    toggleRoleSelectDialog();
  };

  const toggleRoleSelectDialog = () => {
    setOpenRoleSelect(!openRoleSelect);
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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/auth/login", { email, password });
      const { token } = response.data;

      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded);

      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(decoded));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userData", JSON.stringify(decoded));
      }

      setAuth(true);

      if (decoded.roles) {
        if (decoded.roles.includes("patient")) {
          navigate("/patient/video");
        } else if (decoded.roles.includes("healthcare")) {
          navigate("/healthcare/patient");
        } else if (decoded.roles.includes("user")) {
          navigate("/infographics");
        } else {
          setAuth(false);
          console.log("User role not recognized or unauthorized");
        }
      } else {
        console.log("Roles not defined or not an array");
      }
    } catch (error) {
      setAuth(false);
      console.error(
        "Login error:",
        error.response ? error.response.data : error
      );

      if (error.response && error.response.status === 401) {
        setAlertInfo({
          show: true,
          type: "error",
          message: t("login.invalid_credentials"),
        });
      } else {
        setAlertInfo({
          show: true,
          type: "error",
          message: t("login.generic_error"),
        });
      }
    }
  };

  const handleCloseAlert = () => {
    setAlertInfo({ show: false, type: "", message: "" });
  };

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {
      boxShadow: "none",
      overflow: "visible",
    },
  }));

  const dialogTitleStyle = {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    textAlign: "center",
    padding: theme.spacing(2),
  };

  const listItemStyle = {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    cursor: "pointer",
    padding: theme.spacing(2),
  };

  return (
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
      <Grid
        container
        direction="column"
        rowSpacing={{ xs: 1, sm: 2, md: 3, lg: 3 }}
        alignItems="flex-center"
      >
        {/* Title */}
        <Grid item>
          <Typography
            variant="h2"
            component="h1"
            sx={{ color: "black", fontWeight: "bold" }}
          >
            {t("login.tb_title")}
          </Typography>
        </Grid>

        {/* Subtitle */}
        <Grid item>
          <Typography variant="h5" sx={{ color: "black" }}>
            {t("login.tb_subtitle")}
          </Typography>
        </Grid>

        {/* More info button with text */}
        <Grid
          item
          container
          justifyContent="center"
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <Grid item>
            <Typography
              variant="body1"
              component="span"
              sx={{ color: "black" }}
            >
              {t("login.more_info")}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
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
              {t("login.more_info_yes")}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* Login Form */}
      <Container
        maxWidth="md"
        sx={{
          backgroundColor: "background.paper",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderRadius: 4,
          p: 4,
          mt: 4,
        }}
      >
        <Typography
          variant="h6"
          color="textPrimary"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          {t("login.title")}
        </Typography>
        <form onSubmit={handleLogin}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label={t("login.email_placeholder")}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                variant="filled"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t("login.password_placeholder")}
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
                        onClick={handleClickShowPassword}
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

            {/* Login Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                {t("login.login_button")}
              </Button>
            </Grid>
            {/* Register Link */}
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Typography variant="body1" sx={{ color: "black", mt: 2 }}>
                {t("login.not_a_user")}{" "}
                <Link
                  to="#"
                  style={{
                    textDecoration: "none",
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                  }}
                  onClick={handleRegister}
                >
                  {t("login.register")}
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Container>

      {/* Role Selection Dialog */}
      <Dialog open={openRoleSelect} onClose={toggleRoleSelectDialog}>
        <DialogTitle style={dialogTitleStyle}>
          {t("login.select_role")}
        </DialogTitle>
        <List>
          <ListItemButton
            style={listItemStyle}
            onClick={() => navigate("/register/patient")}
          >
            <ListItemText primary={t("login.role_patient")} />
          </ListItemButton>
          <ListItemButton
            style={listItemStyle}
            onClick={() => navigate("/register/healthcare")}
          >
            <ListItemText primary={t("login.role_healthcare")} />
          </ListItemButton>
          <ListItemButton
            style={listItemStyle}
            onClick={() => navigate("/register")}
          >
            <ListItemText primary={t("login.role_user")} />
          </ListItemButton>
        </List>
      </Dialog>
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
  );
}
