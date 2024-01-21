import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Public from "./components/Public";
import Login from "./components/Login";
import PatientRegister from "./components/PatientRegister";
import PatientRegister2 from "./components/PatientRegister2";
import PatientRegister3 from "./components/PatientRegister3";
import HealthcareRegister from "./components/HealthcareRegister";

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
import HealthcareSetting from "./components/HealthcareSetting";

import AdminFAQ from "./components/AdminFAQ";
import AdminUser from "./components/AdminUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Public />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/patient" element={<PatientRegister />} />
        <Route path="/register/patient_2" element={<PatientRegister2 />} />
        <Route path="/register/patient_3" element={<PatientRegister3 />} />
        <Route path="/register/healthcare" element={<HealthcareRegister />} />

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
        <Route path="/healthcaresetting" element={<HealthcareSetting />} />

        <Route path="/adminfaq" element={<AdminFAQ />} />
        <Route path="/adminuser" element={<AdminUser />} />
        
      </Routes>
    </Router>
  );
}

export default App;
