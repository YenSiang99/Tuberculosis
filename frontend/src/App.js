import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Public from "./components/Public";
import PatientRegister from "./components/PatientRegister";
import HealthcareRegister from "./components/HealthcareRegister";
import SuccessfulRegister from "./components/SuccessfulRegister";

import PatientVideo from "./components/PatientVideo";
import PatientSideEffect from "./components/PatientSideEffect";
import PatientCalendar from "./components/PatientCalendar";
import PatientAppointment from "./components/PatientAppointment";
import PatientProfile from "./components/PatientProfile";
import PatientPassword from "./components/PatientPassword";

import HealthcarePatient from "./components/HealthcarePatient";
import HealthcareVideo from "./components/HealthcareVideo";
import HealthcareSideEffect from "./components/HealthcareSideEffect";
import HealthcareAppointment from "./components/HealthcareAppointment";
import HealthcareProfile from "./components/HealthcareProfile";
import HealthcarePassword from "./components/HealthcarePassword";

import AdminFAQ from "./components/AdminFAQ";
import AdminUser from "./components/AdminUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Public />} />
        <Route path="/register/patient" element={<PatientRegister />} />
        <Route path="/register/healthcare" element={<HealthcareRegister />} />
        <Route path="/register/success" element={<SuccessfulRegister />} />

        <Route path="/patientvideo" element={<PatientVideo />} />
        <Route path="/patientsideeffect" element={<PatientSideEffect />} />
        <Route path="/patientcalendar" element={<PatientCalendar />} />
        <Route path="/patientappointment" element={<PatientAppointment />} />
        <Route path="/patientprofile" element={<PatientProfile />} />
        <Route path="/patientpassword" element={<PatientPassword />} />

        <Route path="/healthcarepatient" element={<HealthcarePatient />} />
        <Route path="/healthcarevideo" element={<HealthcareVideo />} />
        <Route path="/healthcaresideeffect" element={<HealthcareSideEffect />} />
        <Route path="/healthcareappointment" element={<HealthcareAppointment />} />
        <Route path="/healthcareprofile" element={<HealthcareProfile />} />
        <Route path="/healthcarepassword" element={<HealthcarePassword />} />

        <Route path="/adminfaq" element={<AdminFAQ />} />
        <Route path="/adminuser" element={<AdminUser />} />
        
      </Routes>
    </Router>
  );
}

export default App;
