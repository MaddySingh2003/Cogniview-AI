import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Interview from "./pages/Interview";
import Result from "./pages/Result";
import Auth from "./pages/auth";
import Navbar from "./components/navbar"

// ✅ protect routes
const PrivateRoute = ({ children }: any) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/auth" />;
};

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">

      <BrowserRouter>
      <Navbar/>
        <Routes>

          <Route path="/auth" element={<Auth />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/interview"
            element={
              <PrivateRoute>
                <Interview />
              </PrivateRoute>
            }
          />

          <Route
            path="/result"
            element={
              <PrivateRoute>
                <Result />
              </PrivateRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </div>
  );
}