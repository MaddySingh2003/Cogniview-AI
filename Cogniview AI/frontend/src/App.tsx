import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Interview from "./pages/Interview";
import Result from "./pages/Result";
import Auth from "./pages/auth";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import History from "./pages/History";
import LearnMore from "./pages/LearnMore";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

import Vision from "./pages/Vision";
import Features from "./pages/Features";
import Interface from "./pages/Interface";
import CTA from "./pages/CTA";

import Background from "./components/Background";

export default function App() {
  return (
    <BrowserRouter>

      {/* BACKGROUND */}
      <Background />

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN */}
      <main className="flex-1 z-10">

        <Routes>

          {/* ================= HOME ================= */}
          <Route
            path="/"
            element={
              <>
                <Home />
                <Vision />
                <Features />
                <Interface />
                <CTA />
              </>
            }
          />

          {/* ================= AUTH ================= */}
          <Route path="/auth" element={<Auth />} />

          {/* ✅ FIX FOR /login */}
          <Route
            path="/login"
            element={<Navigate to="/auth" replace />}
          />

          {/* ================= INTERVIEW ================= */}
          <Route path="/interview" element={<Interview />} />

          {/* ================= RESULT ================= */}
          <Route path="/result" element={<Result />} />

          {/* ================= HISTORY ================= */}
          <Route path="/history" element={<History />} />

          {/* ================= LEARN MORE ================= */}
          <Route path="/learn-more" element={<LearnMore />} />

          {/* ================= PROFILE ================= */}
          <Route path="/profile" element={<Profile />} />

          {/* ================= DASHBOARD ================= */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ✅ FALLBACK */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </main>

      {/* FOOTER */}
      <Footer />

    </BrowserRouter>
  );
}