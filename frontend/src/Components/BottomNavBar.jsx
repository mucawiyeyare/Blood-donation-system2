import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Droplet,
  Inbox,
  MessageCircle,
  UserCircle,
  Building2,
  FileText,
  History,
  BarChart3,
  Stethoscope,
} from "lucide-react";
import useConsultUnread from "../hooks/useConsultUnread.js";

// A handful of the most-used sections per role, shown as a fixed bottom tab bar on phones —
// the same idea as the sidebar's full menu, just the 3-5 things people reach for constantly,
// so the installed PWA feels like a native app instead of a website with a hamburger menu.
// Everything else stays reachable from the sidebar; this doesn't replace it.
const TABS = {
  admin: [
    { to: "/dashboard", label: "Home", icon: LayoutDashboard, end: true },
    { to: "/dashboard/donors", label: "Donors", icon: Droplet },
    { to: "/dashboard/hospitals", label: "Hospitals", icon: Building2 },
    { to: "/dashboard/reports", label: "Reports", icon: FileText },
    { to: "/dashboard/profile", label: "Profile", icon: UserCircle },
  ],
  hospital: [
    { to: "/dashboard", label: "Home", icon: LayoutDashboard, end: true },
    { to: "/dashboard/hospital-donors", label: "Donors", icon: Droplet },
    { to: "/dashboard/hospital-requests", label: "Requests", icon: Inbox },
    { to: "/dashboard/hospital-history", label: "History", icon: History },
    { to: "/dashboard/profile", label: "Profile", icon: UserCircle },
  ],
  donor: [
    { to: "/dashboard/donor-requests", label: "Status", icon: LayoutDashboard, end: true },
    { to: "/dashboard/ask-doctor", label: "Ask Doctor", icon: MessageCircle, badge: true },
    { to: "/dashboard/profile", label: "Profile", icon: UserCircle },
  ],
  doctor: [
    { to: "/dashboard/doctor-inbox", label: "Questions", icon: MessageCircle, badge: true, end: true },
    { to: "/dashboard/profile", label: "Profile", icon: UserCircle },
  ],
  health_institution: [
    { to: "/dashboard", label: "Home", icon: LayoutDashboard, end: true },
    { to: "/dashboard/donors", label: "Donors", icon: Droplet },
    { to: "/dashboard/hospitals", label: "Hospitals", icon: Building2 },
    { to: "/dashboard/analysis", label: "Analytics", icon: BarChart3 },
    { to: "/dashboard/profile", label: "Profile", icon: UserCircle },
  ],
};

export default function BottomNavBar() {
  const role = localStorage.getItem("role");
  const unreadMessages = useConsultUnread(role);
  const tabs = TABS[role];
  if (!tabs) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-white lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {tabs.map(({ to, label, icon: Icon, end, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold transition-colors ${
              isActive ? "text-brand" : "text-slate-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="relative">
                <Icon className="h-5 w-5" />
                {badge && unreadMessages > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand text-[8px] font-bold text-white">
                    {unreadMessages > 9 ? "9+" : unreadMessages}
                  </span>
                )}
              </span>
              <span>{label}</span>
              {isActive && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-brand" />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
