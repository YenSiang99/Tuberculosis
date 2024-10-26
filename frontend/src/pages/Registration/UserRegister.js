import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ThemeProvider,
  Box,
  Typography,
  Button,
  Avatar,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import theme from "../../components/reusable/Theme";
import BgImage from "../../assets/cover.jpeg";
import axios from "../../components/axios";
import PhoneInput from "react-phone-input-2";
import { useTranslation } from "react-i18next";

export default function UserRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Function to format phone number for display (remove '6' prefix)
  const getLocalPhoneNumber = (number) => {
    return number.startsWith("6") ? number.slice(1) : number;
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const userData = {
      phoneNumber,
    };

    try {
      await axios.post("/auth/registerUser", userData);
      setShowSuccessDialog(true);
    } catch (error) {
      if (error.response?.status === 409) {
        setAlertInfo({
          show: true,
          type: "error",
          message: "Phone number already registered.",
        });
      } else {
        setAlertInfo({
          show: true,
          type: "error",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  const handleCloseAlert = () => {
    setAlertInfo({ show: false, type: "", message: "" });
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate("/");
  };

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {
      boxShadow: "none",
      overflow: "visible",
    },
  }));

  const isFormValid = () => {
    return phoneNumber.length >= 10;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(217, 241, 251, 0.8), rgba(217, 241, 251, 0.8)), url(${BgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 3,
            boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
            borderRadius: "15px",
            backgroundColor: "white",
            width: "100vh",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" mb={2}>
            {t("user_registration.title")}
          </Typography>

          <Alert severity="info" sx={{ width: "100%", mb: 2 }}>
            After registration, use your phone number (without country code 6)
            as both username and password to login.
          </Alert>

          <Box
            component="form"
            onSubmit={handleRegister}
            sx={{ mt: 1, width: "100%" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <PhoneInput
                  country={"my"}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  onlyCountries={["my"]}
                  disableDropdown={true}
                  countryCodeEditable={false}
                  containerStyle={{ width: "100%" }}
                  inputStyle={{ width: "100%", height: "56px" }}
                  placeholder={t("user_registration.phone_placeholder")}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              disabled={!isFormValid()}
            >
              {t("user_registration.register_button")}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Error Alert Dialog */}
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

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={handleSuccessDialogClose}
        aria-labelledby="success-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="success-dialog-title">
          Registration Successful!
        </DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            Your account has been created successfully.
          </Alert>
          <Typography variant="body1" gutterBottom>
            Please use the following credentials to login:
          </Typography>
          <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 1, mt: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: "medium", mb: 1 }}>
              Username: {getLocalPhoneNumber(phoneNumber)}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              Password: {getLocalPhoneNumber(phoneNumber)}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Please make sure to save these credentials securely.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose} variant="contained">
            Proceed to Login
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
