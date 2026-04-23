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

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#070B14] text-white relative overflow-hidden">

        {/* GLOBAL BACKGROUND */}
        <div className="absolute w-[500px] h-[500px] bg-purple-600 opacity-20 blur-3xl rounded-full top-[-100px] left-[-100px]" />
        <div className="absolute w-[400px] h-[400px] bg-pink-500 opacity-20 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

        <Navbar />

        {/* 🔥 MAIN CONTENT (THIS FIXES GAP) */}
        <main className="flex-1 z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/result" element={<Result />} />
            <Route path="/history" element={<History />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard/>}/>
          </Routes>
        </main>

        {/* FOOTER ALWAYS AT BOTTOM */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}