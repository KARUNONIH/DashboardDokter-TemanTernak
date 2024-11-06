import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import { useAtom } from "jotai";
import { sessionSignAtom, sidebarAtom } from "./atoms/Atom";
import Layanan from "./pages/Layanan";
import Konsultasi from "./pages/Konsultasi";
import Riwayat from "./pages/Riwayat";
import Keuangan from "./pages/Keuangan";
import Pengaturan from "./pages/Pengaturan";

function ProtectedRoute({ children }) {
  const isSessionSigned = localStorage.getItem("token");

  return isSessionSigned ? children : <Navigate to={"/signin"} />;
}

function App() {
  const [sessionSign, setsessionSign] = useAtom(sessionSignAtom);
  const [isSidebarVisible] = useAtom(sidebarAtom);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setsessionSign(true);
    }
  }, [setsessionSign]);
  return (
    <Router>
      <div className="font-poppins">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Login sign="signup" />} />
          <Route path="/signin" element={<Login sign="signin" />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="flex w-full">
                  <Sidebar />
                  <div className={`${isSidebarVisible ? "md:ml-48 ml-44" : "ml-0"} flex-1 transition-all duration-300 ease-in-out`}>
                    <Navbar />
                    <Dashboard />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/layanan"
            element={
              <ProtectedRoute>
                <div className="flex w-full">
                  <Sidebar />
                  <div className={`${isSidebarVisible ? "md:ml-48 ml-44" : "ml-0"} flex-1 transition-all duration-300 ease-in-out`}>
                    <Navbar />
                    <Layanan />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/konsultasi"
            element={
              <ProtectedRoute>
                <div className="flex w-full">
                  <Sidebar />
                  <div className={`${isSidebarVisible ? "md:ml-48 ml-44" : "ml-0"} flex-1 transition-all duration-300 ease-in-out`}>
                    <Navbar />
                    <Konsultasi />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/riwayat"
            element={
              <ProtectedRoute>
                <div className="flex w-full">
                  <Sidebar />
                  <div className={`${isSidebarVisible ? "md:ml-48 ml-44" : "ml-0"} flex-1 transition-all duration-300 ease-in-out`}>
                    <Navbar />
                    <Riwayat />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/keuangan"
            element={
              <ProtectedRoute>
                <div className="flex w-full">
                  <Sidebar />
                  <div className={`${isSidebarVisible ? "md:ml-48 ml-44" : "ml-0"} flex-1 transition-all duration-300 ease-in-out`}>
                    <Navbar />
                    <Keuangan />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pengaturan"
            element={
              <ProtectedRoute>
                <div className="flex w-full">
                  <Sidebar />
                  <div className={`${isSidebarVisible ? "md:ml-48 ml-44" : "ml-0"} flex-1 transition-all duration-300 ease-in-out`}>
                    <Navbar />
                    <Pengaturan />
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
