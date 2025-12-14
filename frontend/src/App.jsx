import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Singup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Contact from "./pages/Contact.jsx";

// Components
import PublicNavbar from "./Components/PublicNavbar.jsx";
import Donors from "./Components/Donors.jsx";
import Users from "./Components/User.jsx";
import Profile from "./Components/profile.jsx";
import DashboardHome from "./Components/DashboardHome.jsx";
import Analysis from "./Components/Analysis.jsx";
import Reports from "./Components/Reports.jsx";
import ActivityLog from "./Components/ActivityLog.jsx";
import RegisterUser from "./Components/RegisterUser.jsx";
import DonorLocationPicker from "./Components/DonorLocationPicker.jsx";
import NearestDonors from "./Components/NearestDonors.jsx";
import HealthInstitutionAnalytics from "./Components/HealthInstitutionAnalytics.jsx";
import HospitalRequests from "./Components/HospitalRequests.jsx";
import DonorRequests from "./Components/DonorRequests.jsx";
import HospitalDonors from "./Components/HospitalDonors.jsx";

function App() {
  const [user, setUser] = useState(null);

  // Check login state when app loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  // Auth guard
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) return <Navigate to="/" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role))
      return <Navigate to="/dashboard/profile" replace />;
    return children;
  };

  return (
    <Routes>
      {/* Public Routes with Navbar */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" />
          ) : (
            <>
              <PublicNavbar />
              <Home />
            </>
          )
        }
      />
      <Route
        path="/about"
        element={
          <>
            <PublicNavbar />
            <About />
          </>
        }
      />
      <Route
        path="/contact"
        element={
          <>
            <PublicNavbar />
            <Contact />
          </>
        }
      />
      <Route
        path="/signin"
        element={
          user ? (
            <Navigate to="/dashboard" />
          ) : (
            <>
              <PublicNavbar />
              <Signin setUser={setUser} />
            </>
          )
        }
      />
      <Route
        path="/signup"
        element={
          user ? (
            <Navigate to="/dashboard" />
          ) : (
            <>
              <PublicNavbar />
              <Signup />
            </>
          )
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "donor", "hospital", "health_institution"]}>
            <Dashboard setUser={setUser} />
          </ProtectedRoute>
        }
      >
        {/* Nested Routes */}
        <Route
          index
          element={
            <ProtectedRoute allowedRoles={["admin", "donor", "hospital", "health_institution"]}>
              <DashboardHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="donors"
          element={
            <ProtectedRoute allowedRoles={["admin", "hospital", "health_institution"]}>
              <Donors />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="register-user"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RegisterUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={["donor", "hospital", "admin", "health_institution"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="analysis"
          element={
            <ProtectedRoute allowedRoles={["admin", "health_institution"]}>
              <Analysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <ProtectedRoute allowedRoles={["health_institution", "admin"]}>
              <HealthInstitutionAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={["admin", "hospital", "health_institution"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="activity"
          element={
            <ProtectedRoute allowedRoles={["admin", "health_institution"]}>
              <ActivityLog />
            </ProtectedRoute>
          }
        />
        <Route
          path="set-location"
          element={
            <ProtectedRoute allowedRoles={["donor"]}>
              <DonorLocationPicker />
            </ProtectedRoute>
          }
        />
        <Route
          path="nearest-donors"
          element={
            <ProtectedRoute allowedRoles={["admin", "hospital"]}>
              <NearestDonors />
            </ProtectedRoute>
          }
        />
        <Route
          path="hospital-requests"
          element={
            <ProtectedRoute allowedRoles={["hospital"]}>
              <HospitalRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="donor-requests"
          element={
            <ProtectedRoute allowedRoles={["donor"]}>
              <DonorRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="hospital-donors"
          element={
            <ProtectedRoute allowedRoles={["hospital"]}>
              <HospitalDonors />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
