// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from "react";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from './pages/LandingPage';
import InstructionsSection from "./pages/InstructionsSection";
import HelpSection from "./pages/HelpSection";
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import HomePage from './pages/HomePage';
import EncryptPage from './pages/EncryptPage';
import DecryptPage from './pages/DecryptPage';
import ActivityPage from './pages/ActivityPage';

function App() {
  
  return (
    <Router>
      <Routes>

        {/* Layout wrapper (Navbar always visible) */}
        <Route element={<Layout />}>

          {/* Public Landing */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/instructions" element={<InstructionsSection />} />
          <Route path="/help" element={<HelpSection />} />
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Protected */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/encrypt"
            element={
              <ProtectedRoute>
                <EncryptPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/decrypt"
            element={
              <ProtectedRoute>
                <DecryptPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <ActivityPage />
              </ProtectedRoute>
            }
          />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;