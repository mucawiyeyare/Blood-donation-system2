import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Droplet,
  UserCircle,
  BarChart3,
  FileText,
  Activity,
  UserPlus,
  Inbox,
  MessageSquare,
  Building2,
  CheckCircle2,
  History,
} from "lucide-react";
import DhiigKaalLogo from "./DhiigKaalLogo.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import { useTranslation } from "../context/LanguageContext.jsx";

function Sidebar({ isOpen, onClose }) {
  const role = localStorage.getItem("role"); // admin / donor / hospital / health_institution
  const { t } = useTranslation();

  // Navigation link style helper
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30 font-semibold"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div
      className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 h-screen bg-slate-900 text-white 
        flex flex-col p-4 shadow-2xl border-r border-slate-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* Brand Logo Header */}
      <div className="pb-6 mb-4 border-b border-slate-800">
        <Link to="/" title="Go to Website Home" className="block bg-white/10 hover:bg-white/15 backdrop-blur-sm p-3 rounded-2xl border border-white/10 flex justify-center items-center transition-all group">
          <DhiigKaalLogo size="sm" light={true} />
        </Link>
        <div className="mt-3 px-2 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
            {role === "health_institution" ? "Ministry Portal" : `${role || "User"} Portal`}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-red-900/60 text-red-300 border border-red-700/50">
            Live
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
        {/* ADMIN ROLE */}
        {role === "admin" && (
          <>
            <NavLink to="/dashboard" end className={linkClass} onClick={handleLinkClick}>
              <LayoutDashboard className="w-5 h-5 text-sky-400" />
              <span>{t("sidebar.dashboard", "Dashboard")}</span>
            </NavLink>
            <NavLink to="/dashboard/hospitals" className={linkClass} onClick={handleLinkClick}>
              <Building2 className="w-5 h-5 text-red-400" />
              <span>{t("sidebar.hospitals", "Hospitals")}</span>
            </NavLink>
            <NavLink to="/dashboard/donors" className={linkClass} onClick={handleLinkClick}>
              <Droplet className="w-5 h-5 text-red-500" />
              <span>{t("sidebar.allDonors", "Donors")}</span>
            </NavLink>
            <NavLink to="/dashboard/users" className={linkClass} onClick={handleLinkClick}>
              <Users className="w-5 h-5 text-sky-400" />
              <span>{t("sidebar.users", "System Users")}</span>
            </NavLink>
            <NavLink to="/dashboard/register-user" className={linkClass} onClick={handleLinkClick}>
              <UserPlus className="w-5 h-5 text-emerald-400" />
              <span>{t("sidebar.registerUser", "Register User")}</span>
            </NavLink>
            <NavLink to="/dashboard/reports" className={linkClass} onClick={handleLinkClick}>
              <FileText className="w-5 h-5 text-amber-400" />
              <span>{t("sidebar.reports", "Reports")}</span>
            </NavLink>
            <NavLink to="/dashboard/analysis" className={linkClass} onClick={handleLinkClick}>
              <BarChart3 className="w-5 h-5 text-sky-400" />
              <span>{t("sidebar.analytics", "Analytics")}</span>
            </NavLink>
            <NavLink to="/dashboard/activity" className={linkClass} onClick={handleLinkClick}>
              <Activity className="w-5 h-5 text-rose-400" />
              <span>{t("sidebar.activityLog", "Activity Log")}</span>
            </NavLink>
            <NavLink to="/dashboard/messages" className={linkClass} onClick={handleLinkClick}>
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <span>{t("sidebar.messages", "Messages")}</span>
            </NavLink>
            <NavLink to="/dashboard/profile" className={linkClass} onClick={handleLinkClick}>
              <UserCircle className="w-5 h-5 text-gray-400" />
              <span>{t("sidebar.profile", "My Profile")}</span>
            </NavLink>
          </>
        )}

        {/* HOSPITAL ROLE */}
        {role === "hospital" && (
          <>
            <NavLink to="/dashboard" end className={linkClass} onClick={handleLinkClick}>
              <LayoutDashboard className="w-5 h-5 text-sky-400" />
              <span>{t("sidebar.dashboard", "Dashboard")}</span>
            </NavLink>
            <NavLink to="/dashboard/hospital-donors" className={linkClass} onClick={handleLinkClick}>
              <Droplet className="w-5 h-5 text-red-500" />
              <span>{t("sidebar.hospitalDonors", "Available Donors")}</span>
            </NavLink>
            <NavLink to="/dashboard/hospital-requests" className={linkClass} onClick={handleLinkClick}>
              <Inbox className="w-5 h-5 text-amber-400" />
              <span>{t("sidebar.hospitalRequests", "Active Requests")}</span>
            </NavLink>
            <NavLink to="/dashboard/hospital-history" className={linkClass} onClick={handleLinkClick}>
              <History className="w-5 h-5 text-emerald-400" />
              <span>{t("sidebar.myDonations", "Donations History")}</span>
            </NavLink>
            <NavLink to="/dashboard/reports" className={linkClass} onClick={handleLinkClick}>
              <FileText className="w-5 h-5 text-sky-400" />
              <span>{t("sidebar.reports", "Reports")}</span>
            </NavLink>
            <NavLink to="/dashboard/profile" className={linkClass} onClick={handleLinkClick}>
              <UserCircle className="w-5 h-5 text-gray-400" />
              <span>{t("sidebar.profile", "Hospital Profile")}</span>
            </NavLink>
          </>
        )}

        {/* DONOR ROLE */}
        {role === "donor" && (
          <>
            <NavLink to="/dashboard/donor-requests" className={linkClass} onClick={handleLinkClick}>
              <Inbox className="w-5 h-5 text-red-400" />
              <span>{t("sidebar.donorRequests", "My Status & Requests")}</span>
            </NavLink>
            <NavLink to="/dashboard/profile" className={linkClass} onClick={handleLinkClick}>
              <UserCircle className="w-5 h-5 text-sky-400" />
              <span>{t("sidebar.profile", "Profile & History")}</span>
            </NavLink>
          </>
        )}

        {/* HEALTH INSTITUTION / MINISTRY OF HEALTH */}
        {role === "health_institution" && (
          <>
            <NavLink to="/dashboard" end className={linkClass} onClick={handleLinkClick}>
              <LayoutDashboard className="w-5 h-5 text-sky-400" />
              <span>{t("sidebar.dashboard", "National Dashboard")}</span>
            </NavLink>
            <NavLink to="/dashboard/reports" className={linkClass} onClick={handleLinkClick}>
              <FileText className="w-5 h-5 text-amber-400" />
              <span>{t("sidebar.reports", "National Reports & Export")}</span>
            </NavLink>
            <NavLink to="/dashboard/donors" className={linkClass} onClick={handleLinkClick}>
              <Droplet className="w-5 h-5 text-red-500" />
              <span>{t("sidebar.allDonors", "National Donors Registry")}</span>
            </NavLink>
            <NavLink to="/dashboard/hospitals" className={linkClass} onClick={handleLinkClick}>
              <Building2 className="w-5 h-5 text-indigo-400" />
              <span>{t("sidebar.hospitals", "Hospitals Directory")}</span>
            </NavLink>
            <NavLink to="/dashboard/analysis" className={linkClass} onClick={handleLinkClick}>
              <BarChart3 className="w-5 h-5 text-sky-400" />
              <span>{t("sidebar.analytics", "Health Analytics")}</span>
            </NavLink>
            <NavLink to="/dashboard/activity" className={linkClass} onClick={handleLinkClick}>
              <Activity className="w-5 h-5 text-rose-400" />
              <span>{t("sidebar.activityLog", "Activity Log")}</span>
            </NavLink>
            <NavLink to="/dashboard/profile" className={linkClass} onClick={handleLinkClick}>
              <UserCircle className="w-5 h-5 text-gray-400" />
              <span>{t("sidebar.profile", "Institution Profile")}</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Language Selector & Footer System Info */}
      <div className="pt-4 mt-auto border-t border-slate-800 text-center space-y-3">
        <div className="flex justify-center">
          <LanguageSwitcher variant="pills" />
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium">DHIIG KAAL BDMS v2.0</p>
          <p className="text-[10px] text-slate-500">Ministry of Health & Healthcare Partners</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
