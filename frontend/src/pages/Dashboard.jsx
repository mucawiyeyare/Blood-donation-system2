import React, { useState } from "react";
import { Routes, Route, Outlet, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar.jsx";
import { LogOut, Menu, X, UserCheck, Shield, Droplet, Building2 } from "lucide-react";

function Dashboard({ setUser }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const role = localStorage.getItem("role") || "user";
  const userName = localStorage.getItem("userName") || "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0];
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
    if (setUser) {
      setUser(null);
    }
    navigate("/", { replace: true });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getRoleBadge = () => {
    switch (role) {
      case "hospital":
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-sky-500/20 text-sky-100 border border-sky-400/30 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-sky-300" />
            Hospital
          </span>
        );
      case "admin":
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-100 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            Administrator
          </span>
        );
      case "health_institution":
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 text-purple-100 border border-purple-400/30 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-purple-300" />
            Ministry of Health
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-100 border border-red-400/30 text-xs font-bold uppercase tracking-wider">
            <Droplet className="w-3.5 h-3.5 text-red-300" />
            Blood Donor
          </span>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 bg-slate-50 overflow-auto relative flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 right-0 z-20 flex justify-between items-center px-4 sm:px-6 py-3.5 bg-gradient-to-r from-red-600 via-red-700 to-slate-900 shadow-md text-white">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-colors"
              title="Toggle Menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-white">DHIIG KAAL</span>
              <span className="text-xs text-red-200">|</span>
              <span className="text-xs text-red-100 font-medium">Somalia Blood Donation Network</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {getRoleBadge()}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border border-white/10"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Nested View */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
