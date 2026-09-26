import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Info, Stethoscope, Handshake, Mail } from "lucide-react";
import usePwaStandalone from "../hooks/usePwaStandalone.js";

const TABS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/about", label: "About", icon: Info },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/partners", label: "Partners", icon: Handshake },
  { to: "/contact", label: "Contact", icon: Mail },
];

// Only appears once SOBDA is running as the installed app, not in an ordinary browser tab — a
// browser visit keeps the familiar website layout (top navbar + footer); the installed app adds
// this bottom tab bar too, so it reads as an app rather than a website once someone's opened it
// from their Home Screen. Hidden on /dashboard, which already has its own role-based version.
export default function PublicBottomNavBar() {
  const isStandalone = usePwaStandalone();
  const { pathname } = useLocation();
  if (!isStandalone || pathname.startsWith("/dashboard")) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-white lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map(({ to, label, icon: Icon, end }) => (
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
              <Icon className="h-5 w-5" />
              <span>{label}</span>
              {isActive && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-brand" />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
