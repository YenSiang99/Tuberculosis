import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Login from "./pages/Login";
import TBInfo from "./pages/TBInfo";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Register pages
import PatientRegister from "./pages/Registration/PatientRegister";
import HealthcareRegister from "./pages/Registration/HealthcareRegister";
import SuccessfulRegister from "./pages/Registration/SuccessfulRegister";

// Patient pages
import PatientVideo from "./pages/Patient/PatientVideo";
import PatientSideEffect from "./pages/Patient/PatientSideEffect";
import PatientCalendar from "./pages/Patient/PatientCalendar";
import PatientAppointment from "./pages/Patient/PatientAppointment";
import PatientProfile from "./pages/Patient/PatientProfile";
import PatientPassword from "./pages/Patient/PatientPassword";
import PatientNotification from "./pages/Patient/PatientNotification";
import PatientSetting from "./pages/Patient/PatientSetting";

// Healthcare pages
import HealthcarePatient from "./pages/Healthcare/HealthcarePatient";
import HealthcareVideo from "./pages/Healthcare/HealthcareVideo";
import HealthcareSideEffect from "./pages/Healthcare/HealthcareSideEffect";
import HealthcareAppointment from "./pages/Healthcare/HealthcareAppointment";
import HealthcareProfile from "./pages/Healthcare/HealthcareProfile";
import HealthcarePassword from "./pages/Healthcare/HealthcarePassword";
import HealthcareNotification from "./pages/Healthcare/HealthcareNotification";

// Admin pages
import AdminFAQ from "./pages/Administration/AdminFAQ";
import AdminUser from "./pages/Administration/AdminUser";

function App() {
  return (
    <Router>
      <AuthProvider> 
        <Routes>
          {/* Public paths */}
          <Route path="/" element={<Login />} />
          <Route path="/tb-info" element={<TBInfo />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Register paths */}
          <Route path="/register/patient" element={<PatientRegister />} />
          <Route path="/register/healthcare" element={<HealthcareRegister />} />
          <Route path="/register/success" element={<SuccessfulRegister />} />

          {/* Patient paths */}
          <Route path="/patientvideo" element={<ProtectedRoute><PatientVideo /></ProtectedRoute>} />
          <Route path="/patientsideeffect" element={<ProtectedRoute><PatientSideEffect /></ProtectedRoute>} />
          <Route path="/patientappointment" element={<ProtectedRoute><PatientAppointment /></ProtectedRoute>}  />
          <Route path="/patientcalendar" element={<ProtectedRoute><PatientCalendar /></ProtectedRoute>}  />
          <Route path="/patientprofile" element= {<ProtectedRoute><PatientProfile /></ProtectedRoute>}/>
          <Route path="/patientpassword" element={<ProtectedRoute><PatientPassword /></ProtectedRoute>} />
          <Route path="/patientnotification" element={<ProtectedRoute><PatientNotification /></ProtectedRoute>} />
          <Route path="/patientsettings" element={<ProtectedRoute><PatientSetting /></ProtectedRoute>} />

          {/* healthcare paths */}
          <Route path="/healthcarepatient" element={<ProtectedRoute><HealthcarePatient /></ProtectedRoute>} />
          <Route path="/healthcarevideo" element={<ProtectedRoute><HealthcareVideo /></ProtectedRoute>} />
          <Route path="/healthcaresideeffect" element={<ProtectedRoute><HealthcareSideEffect /></ProtectedRoute>} />
          <Route path="/healthcareappointment" element={<ProtectedRoute><HealthcareAppointment /></ProtectedRoute>} />
          <Route path="/healthcareprofile" element={<ProtectedRoute><HealthcareProfile /></ProtectedRoute>} />
          <Route path="/healthcarepassword" element={<ProtectedRoute><HealthcarePassword /></ProtectedRoute>} />
          <Route path="/healthcarenotification" element={<ProtectedRoute><HealthcareNotification /></ProtectedRoute>} />

          {/* Admin paths */}
          <Route path="/adminfaq" element={<AdminFAQ />} />
          <Route path="/adminuser" element={<AdminUser />} />
        
      </Routes></AuthProvider>
     
    </Router>
  );
}

export default App;
