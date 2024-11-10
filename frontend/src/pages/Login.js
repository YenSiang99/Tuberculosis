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
      console.log("Starting login process");
      const response = await axios.post("/auth/login", { email, password });
      const token = response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      console.log("Received tokens:");
      console.log("Access token:", !!token);
      console.log("Refresh token:", !!refreshToken);

      const decoded = jwtDecode(token);
      console.log("Decoded access token:", {
        exp: new Date(decoded.exp * 1000),
        roles: decoded.roles,
      });

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userData", JSON.stringify(decoded));

      // Debug stored tokens
      console.log("Stored tokens:");
      console.log(
        "Access token matches:",
        localStorage.getItem("token") === token
      );
      console.log(
        "Refresh token matches:",
        localStorage.getItem("refreshToken") === refreshToken
      );

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
      console.error("Login error:", error.response?.data);
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
