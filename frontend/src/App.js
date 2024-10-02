import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import MainLayout from "./layout/MainLayout";
import TBInfoLayout from "./layout/TBInfoLayout";
import AuthLayout from "./layout/AuthLayout";

// Public pages
import Login from "./pages/Login";
import ForgotPassword from "./pages/PasswordRecovery/ForgotPassword";
import ResetPassword from "./pages/PasswordRecovery/ResetPassword";
// Register pages
import PatientRegister from "./pages/Registration/PatientRegister";
import HealthcareRegister from "./pages/Registration/HealthcareRegister";
import SuccessfulRegister from "./pages/Registration/SuccessfulRegister";
import UserRegister from "./pages/Registration/UserRegister";

// TBInfo Pages
import InfographicsPage from "./pages/TBInfo/InfographicsPage";
import VideosPage from "./pages/TBInfo/VideosPage";
import FAQsPage from "./pages/TBInfo/FAQsPage";
import AboutTBCompanionPage from "./pages/TBInfo/AboutTBCompanionPage";

// Games
import WordSearchPage from "./pages/Games/WordSearchPage";
import QuizPage from "./pages/Games/QuizPage";
import InteractiveStoryPage from "./pages/Games/InteractiveStoryPage";
import FillInBlanksPage from "./pages/Games/FillInBlanksPage";
import TrueFalsePage from "./pages/Games/TrueFalsePage";
import ScoreDashboardPage from "./pages/Games/ScoreDashboardPage";

// Admin pages
import AdminScoreDashboardPage from "./pages/Administration/AdminScoreDashboardPage";

import WordSearchMenu from "./pages/Administration/games/WordSearchMenu";
import CreateUpdateWordSearchList from "./pages/Administration/games/CreateUpdateWordSearchList";

import QuizzesTable from "./pages/Administration/games/QuizzesTable";
import CreateUpdateQuiz from "./pages/Administration/games/CreateUpdateQuiz";

import StoryListMenu from "./pages/Administration/games/StoryListMenu";
import StoryCreateUpdate from "./pages/Administration/games/StoryCreateUpdate";

import FillBlanksTable from "./pages/Administration/games/FillBlanksTable";
import BlanksCreateUpdate from "./pages/Administration/games/BlanksCreateUpdate";

import AdminFAQ from "./pages/Administration/AdminFAQ";
import AdminUser from "./pages/Administration/AdminUser";

// Patient pages
import PatientVideo from "./pages/Patient/PatientVideo";
import PatientSideEffect from "./pages/Patient/PatientSideEffect";
import PatientCalendar from "./pages/Patient/PatientCalendar";
import PatientAppointment from "./pages/Patient/PatientAppointment";
import PatientProfile from "./pages/Patient/PatientProfile";
import PatientNotification from "./pages/Patient/PatientNotification";
import PatientSetting from "./pages/Patient/PatientSetting";

// Healthcare pages
import HealthcarePatient from "./pages/Healthcare/HealthcarePatient";
import HealthcareVideo from "./pages/Healthcare/HealthcareVideo";
import HealthcareSideEffect from "./pages/Healthcare/HealthcareSideEffect";
import HealthcareAppointment from "./pages/Healthcare/HealthcareAppointment";
import HealthcareProfile from "./pages/Healthcare/HealthcareProfile";
import HealthcareNotification from "./pages/Healthcare/HealthcareNotification";

import TestPage from "./pages/TestPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/test" element={<TestPage />}></Route>

          {/* Auth paths */}
          <Route path="/" element={<AuthLayout />}>
            {/* Registration paths */}
            <Route path="register/patient" element={<PatientRegister />} />
            <Route
              path="register/healthcare"
              element={<HealthcareRegister />}
            />
            <Route path="register" element={<UserRegister />} />
            <Route path="reset-password" element={<ResetPassword />} />

            <Route path="register/success" element={<SuccessfulRegister />} />

            {/* Login */}
            <Route path="/" element={<Login />} />

            {/* Forgot password */}
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>

          {/* TB Info */}
          <Route path="/tb-info" element={<TBInfoLayout />}>
            <Route path="infographics" element={<InfographicsPage />} />
            <Route path="videos" element={<VideosPage />} />
            <Route path="faqs" element={<FAQsPage />} />
            <Route path="games/word-search" element={<WordSearchPage />} />
            <Route path="games/quiz" element={<QuizPage />} />
            <Route
              path="games/interactive-story"
              element={<InteractiveStoryPage />}
            />
            <Route path="games/fill-in-blanks" element={<FillInBlanksPage />} />
            <Route path="games/true-false" element={<TrueFalsePage />} />
            <Route path="about" element={<AboutTBCompanionPage />} />
          </Route>
          {/* Patient */}
          <Route path="/patient" element={<MainLayout />}>
            <Route
              path="video"
              element={
                <ProtectedRoute>
                  <PatientVideo />
                </ProtectedRoute>
              }
            />
            <Route
              path="sideeffect"
              element={
                <ProtectedRoute>
                  <PatientSideEffect />
                </ProtectedRoute>
              }
            />
            <Route
              path="appointment"
              element={
                <ProtectedRoute>
                  <PatientAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="calendar"
              element={
                <ProtectedRoute>
                  <PatientCalendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <PatientProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="notification"
              element={
                <ProtectedRoute>
                  <PatientNotification />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <PatientSetting />
                </ProtectedRoute>
              }
            />
          </Route>
          {/* Healthcare */}
          <Route path="/healthcare" element={<MainLayout />}>
            <Route
              path="patient"
              element={
                <ProtectedRoute>
                  <HealthcarePatient />
                </ProtectedRoute>
              }
            />
            <Route
              path="video"
              element={
                <ProtectedRoute>
                  <HealthcareVideo />
                </ProtectedRoute>
              }
            />
            <Route
              path="sideeffect"
              element={
                <ProtectedRoute>
                  <HealthcareSideEffect />
                </ProtectedRoute>
              }
            />
            <Route
              path="appointment"
              element={
                <ProtectedRoute>
                  <HealthcareAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <HealthcareProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="notification"
              element={
                <ProtectedRoute>
                  <HealthcareNotification />
                </ProtectedRoute>
              }
            />
          </Route>
          {/* Normal user info layout */}
          <Route path="/" element={<MainLayout />}>
            {" "}
            <Route path="infographics" element={<InfographicsPage />} />
            <Route path="videos" element={<VideosPage />} />
            <Route path="faqs" element={<FAQsPage />} />
            <Route path="about" element={<AboutTBCompanionPage />} />
          </Route>

          {/* Admin  */}
          <Route path="/admin" element={<MainLayout />}>
            <Route
              path="scoredashboard"
              element={<AdminScoreDashboardPage />}
            />
            <Route path="wordsearchmenu" element={<WordSearchMenu />} />
            <Route
              path="wordsearchlist"
              element={<CreateUpdateWordSearchList />}
            />
            <Route
              path="wordsearchlist/:id"
              element={<CreateUpdateWordSearchList />}
            />

            <Route path="quizzes" element={<QuizzesTable />} />
            <Route path="quiz/create" element={<CreateUpdateQuiz />} />
            <Route path="quiz/:id" element={<CreateUpdateQuiz />} />

            <Route path="storymenu" element={<StoryListMenu />} />
            <Route path="story/create" element={<StoryCreateUpdate />} />
            <Route path="story/edit/:id" element={<StoryCreateUpdate />} />

            <Route path="blanks" element={<FillBlanksTable />} />
            <Route path="blanks/create" element={<BlanksCreateUpdate />} />
            <Route path="blanks/:id" element={<BlanksCreateUpdate />} />

            <Route path="adminfaq" element={<AdminFAQ />} />
            <Route path="adminuser" element={<AdminUser />} />
          </Route>
          {/* Games */}
          <Route path="/games" element={<MainLayout />}>
            <Route path="word-search" element={<WordSearchPage />} />
            <Route path="quiz" element={<QuizPage />} />
            <Route
              path="interactive-story"
              element={<InteractiveStoryPage />}
            />
            <Route path="fill-in-blanks" element={<FillInBlanksPage />} />
            <Route path="true-false" element={<TrueFalsePage />} />
            <Route path="score-dashboard" element={<ScoreDashboardPage />} />
            ScoreDashboardPage
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
