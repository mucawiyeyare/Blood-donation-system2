import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Droplet, UserCircle, BarChart3, FileText, Activity, UserPlus, MapPin, Search } from "lucide-react";

function Sidebar({ isOpen, onClose }) {
  const role = localStorage.getItem("role"); // admin / donor / hospital

  // 🧭 Sidebar navigation link style helper
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive ? "bg-red-600 text-white shadow-lg" : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  // Handle link click - close sidebar on mobile
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) { // lg breakpoint
      onClose();
    }
  };

  return (
    <div 
      className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white 
        flex flex-col p-4 shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* ====== TOP SECTION ====== */}
      <div>
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <div className="bg-red-600 w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center">
            <Droplet className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold">BDMS</h2>
          <p className="text-xs text-gray-400 mt-1">Blood Donation System</p>
        </div>

        <nav className="flex flex-col space-y-2">
          {/* ADMIN LINKS */}
          {role === "admin" && (
            <>
              <NavLink to="/dashboard" end className={linkClass} onClick={handleLinkClick}>
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/dashboard/donors" className={linkClass} onClick={handleLinkClick}>
                <Droplet className="w-5 h-5" />
                <span>Donors</span>
              </NavLink>
              <NavLink to="/dashboard/reports" className={linkClass} onClick={handleLinkClick}>
                <FileText className="w-5 h-5" />
                <span>Reports</span>
              </NavLink>
              <NavLink to="/dashboard/analysis" className={linkClass} onClick={handleLinkClick}>
                <BarChart3 className="w-5 h-5" />
                <span>Analysis</span>
              </NavLink>
              <NavLink to="/dashboard/activity" className={linkClass} onClick={handleLinkClick}>
                <Activity className="w-5 h-5" />
                <span>Activity</span>
              </NavLink>
              <NavLink to="/dashboard/users" className={linkClass} onClick={handleLinkClick}>
                <Users className="w-5 h-5" />
                <span>Users</span>
              </NavLink>
              <NavLink to="/dashboard/register-user" className={linkClass} onClick={handleLinkClick}>
                <UserPlus className="w-5 h-5" />
                <span>Register User</span>
              </NavLink>
              <NavLink to="/dashboard/profile" className={linkClass} onClick={handleLinkClick}>
                <UserCircle className="w-5 h-5" />
                <span>Profile</span>
              </NavLink>
            </>
          )}

          {/* HOSPITAL LINKS */}
          {role === "hospital" && (
            <>
              <NavLink to="/dashboard" end className={linkClass} onClick={handleLinkClick}>
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/dashboard/donors" className={linkClass} onClick={handleLinkClick}>
                <Droplet className="w-5 h-5" />
                <span>Donors</span>
              </NavLink>
              <NavLink to="/dashboard/reports" className={linkClass} onClick={handleLinkClick}>
                <FileText className="w-5 h-5" />
                <span>Reports</span>
              </NavLink>
              <NavLink to="/dashboard/nearest-donors" className={linkClass} onClick={handleLinkClick}>
                <Search className="w-5 h-5" />
                <span>Find Donors</span>
              </NavLink>
              <NavLink to="/dashboard/profile" className={linkClass} onClick={handleLinkClick}>
                <UserCircle className="w-5 h-5" />
                <span>My Profile</span>
              </NavLink>
            </>
          )}

          {/* DONOR LINKS */}
          {role === "donor" && (
            <>
              <NavLink to="/dashboard" end className={linkClass} onClick={handleLinkClick}>
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/dashboard/set-location" className={linkClass} onClick={handleLinkClick}>
                <MapPin className="w-5 h-5" />
                <span>Set Location</span>
              </NavLink>
              <NavLink to="/dashboard/profile" className={linkClass} onClick={handleLinkClick}>
                <UserCircle className="w-5 h-5" />
                <span>My Profile</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
