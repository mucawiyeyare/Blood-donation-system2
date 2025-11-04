import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Singup.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// Components
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
      {/*  Public Routes */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <Signin setUser={setUser} />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/dashboard" /> : <Signup />}
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "donor", "hospital"]}>
            <Dashboard setUser={setUser} />
          </ProtectedRoute>
        }
      >
        {/* Nested Routes */}
        <Route
          index
          element={
            <ProtectedRoute allowedRoles={["admin", "donor", "hospital"]}>
              <DashboardHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="donors"
          element={
            <ProtectedRoute allowedRoles={["admin", "hospital"]}>
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
            <ProtectedRoute allowedRoles={["donor", "hospital", "admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="analysis"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Analysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={["admin", "hospital"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="activity"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
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
      </Route>
    </Routes>
  );
}

export default App;
