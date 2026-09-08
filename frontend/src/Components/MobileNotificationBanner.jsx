import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  X,
  Droplet,
  Building2,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  AlertTriangle,
  Smartphone,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

export default function MobileNotificationBanner() {
  const navigate = useNavigate();
  const { activeTopBanner, dismissTopBanner, markAsRead } = useNotifications();
  const [touchStartY, setTouchStartY] = useState(null);

  // Auto-dismiss banner after 7 seconds
  useEffect(() => {
    if (!activeTopBanner) return;

    const timer = setTimeout(() => {
      dismissTopBanner();
    }, 7000);

    return () => clearTimeout(timer);
  }, [activeTopBanner, dismissTopBanner]);

  if (!activeTopBanner) return null;

  const handleOpenAction = () => {
    if (activeTopBanner._id) {
      markAsRead(activeTopBanner._id);
    }
    const targetUrl = activeTopBanner.data?.actionUrl || "/dashboard/donor-requests";
    dismissTopBanner();
    navigate(targetUrl);
  };

  // Support swipe-up to dismiss on mobile touchscreens
  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (touchStartY === null) return;
    const diffY = touchStartY - e.changedTouches[0].clientY;
    if (diffY > 30) {
      // Swiped upwards
      dismissTopBanner();
    }
    setTouchStartY(null);
  };

  const isEmergency =
    activeTopBanner.data?.urgency === "Emergency" ||
    activeTopBanner.type === "blood_request";

  return (
    <aside
      aria-label="Mobile heads-up notification"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed top-2 left-2 right-2 sm:top-4 sm:right-4 sm:left-auto sm:max-w-md z-[9999] animate-in slide-in-from-top-6 duration-300"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/98 to-slate-950 text-white p-3.5 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-700/80 backdrop-blur-xl">
        {/* Accent glow on top */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            isEmergency
              ? "bg-gradient-to-r from-red-500 via-rose-500 to-amber-500"
              : "bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500"
          }`}
        />

        {/* Mobile Header Pill (like WhatsApp / LinkedIn top notification) */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[11px] font-bold text-emerald-300">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WHATSAPP & SYSTEM</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Dhiig Kaal BDMS • Just now
            </span>
          </div>

          <button
            onClick={dismissTopBanner}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Body */}
        <div className="flex items-start gap-3">
          {/* Icon Badge */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
              isEmergency
                ? "bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-red-900/40"
                : "bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-sky-900/40"
            }`}
          >
            {isEmergency ? (
              <Droplet className="w-5 h-5 animate-pulse fill-current" />
            ) : (
              <Building2 className="w-5 h-5" />
            )}
          </div>

          {/* Texts */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-sm font-bold text-white truncate">
                {activeTopBanner.title}
              </h4>
              {activeTopBanner.data?.urgency && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wide flex-shrink-0 ${
                    activeTopBanner.data.urgency === "Emergency"
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {activeTopBanner.data.urgency}
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {activeTopBanner.message}
            </p>

            {/* Quick Action Footer */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleOpenAction}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                  isEmergency
                    ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-900/30"
                    : "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-sky-900/30"
                }`}
              >
                <span>View & Respond</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={dismissTopBanner}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drag-up pill hint */}
        <div className="sm:hidden mt-2 pt-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-slate-700/80" />
        </div>
      </div>
    </aside>
  );
}
