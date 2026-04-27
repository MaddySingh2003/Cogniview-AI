import { BrowserRouter, Routes, Route } from "react-router-dom";

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

          {/* ✅ HOME PAGE WITH ALL SECTIONS */}
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

          {/* OTHER ROUTES */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/result" element={<Result />} />
          <Route path="/history" element={<History />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />

        </Routes>

      </main>

      {/* FOOTER */}
      <Footer />

    </BrowserRouter>
  );
}