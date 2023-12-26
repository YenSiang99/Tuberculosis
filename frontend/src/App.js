import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Public from "./components/Public";
import FAQ from "./components/FAQ";
import Login from "./components/Login";
import Register from "./components/Register";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Public />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
