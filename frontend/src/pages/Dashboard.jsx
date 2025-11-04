import React, { useState } from "react";
import { Routes, Route, Outlet, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar.jsx";
import { LogOut, Menu, X } from "lucide-react";

function Dashboard({ setUser }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-red-50 via-white to-red-50 overflow-auto relative">
        {/* Top Bar with Menu Toggle and Logout - No Margin */}
        <div className="sticky top-0 right-0 z-20 flex justify-between items-center px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 shadow-2xl">
          {/* Menu Toggle Button - Only visible on mobile/tablet */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border border-white/30"
            title="Toggle Menu"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Spacer for desktop */}
          <div className="hidden lg:block"></div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 border border-white/30 transform hover:scale-105"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
        
        {/* Main Content Area - No Padding/Margin */}
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
