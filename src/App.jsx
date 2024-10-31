import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import { useAtom } from "jotai";
import { sessionSignAtom } from "./atoms/Atom";


function ProtectedRoute({ children }) {
  const [isSessionSigned] = useAtom(sessionSignAtom);
  return isSessionSigned ? children : <Navigate to={'/signin'}/>;
}

function App() {
  
  return (
    <Router>
      <div className="font-poppins">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Login sign="signup"/>} />
          <Route path="/signin" element={<Login sign="signin"/>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
              <div className="flex w-full">
                <Sidebar />
                <div className="flex-1">
                  <Navbar />
                  <Dashboard />
                </div>
                </div>
                </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
