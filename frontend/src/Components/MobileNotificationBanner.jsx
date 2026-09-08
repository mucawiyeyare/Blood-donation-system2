import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

/* ─────────────────────────────────────────────────────────────
   WhatsApp-style native Android heads-up notification banner
   Slides down from the top of the screen, dark frosted card
───────────────────────────────────────────────────────────── */
export default function MobileNotificationBanner() {
  const navigate = useNavigate();
  const { activeTopBanner, dismissTopBanner, markAsRead } = useNotifications();
  const [visible, setVisible] = useState(false);
  const [touchStartY, setTouchStartY] = useState(null);
  const timerRef = useRef(null);

  /* Slide-in when a new banner appears, auto-dismiss after 6s */
  useEffect(() => {
    if (!activeTopBanner) {
      setVisible(false);
      return;
    }
    // Trigger CSS transition
    requestAnimationFrame(() => setVisible(true));

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(dismissTopBanner, 320); // wait for slide-out
    }, 6000);

    return () => clearTimeout(timerRef.current);
  }, [activeTopBanner, dismissTopBanner]);

  if (!activeTopBanner) return null;

  /* Tap anywhere on the card to open the action */
  const handleTap = () => {
    if (activeTopBanner._id) markAsRead(activeTopBanner._id);
    const url = activeTopBanner.data?.actionUrl || "/dashboard/donor-requests";
    setVisible(false);
    setTimeout(() => { dismissTopBanner(); navigate(url); }, 280);
  };

  /* Swipe-up to dismiss */
  const handleTouchStart = (e) => setTouchStartY(e.touches[0].clientY);
  const handleTouchEnd = (e) => {
    if (touchStartY === null) return;
    if (touchStartY - e.changedTouches[0].clientY > 30) {
      setVisible(false);
      setTimeout(dismissTopBanner, 320);
    }
    setTouchStartY(null);
  };

  const isEmergency =
    activeTopBanner.data?.urgency === "Emergency" ||
    activeTopBanner.type === "blood_request";

  /* Time string like "9:52 AM" */
  const timeLabel = activeTopBanner.createdAt
    ? new Date(activeTopBanner.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  /* ── Inline styles so nothing fights Tailwind purge ── */
  const card = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    padding: "8px 10px 4px",
    transform: visible ? "translateY(0)" : "translateY(-115%)",
    transition: "transform 0.32s cubic-bezier(0.22,1,0.36,1)",
    pointerEvents: visible ? "auto" : "none",
  };

  const innerCard = {
    background: "rgba(28,28,30,0.97)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    borderRadius: "16px",
    padding: "10px 12px",
    boxShadow: "0 8px 36px rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    cursor: "pointer",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
  };

  const iconCircle = {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: isEmergency ? "#c62828" : "#25D366",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "21px",
    lineHeight: 1,
    boxShadow: isEmergency
      ? "0 2px 12px rgba(198,40,40,0.55)"
      : "0 2px 12px rgba(37,211,102,0.4)",
  };

  return (
    <aside
      aria-live="assertive"
      aria-label="Notification"
      style={card}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── WhatsApp-style card ── */}
      <div style={innerCard} onClick={handleTap}>
        {/* Left green/red circle icon */}
        <div style={iconCircle}>{isEmergency ? "🩸" : "🏥"}</div>

        {/* Center content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* App label row + time — exactly like WhatsApp */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "2px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: "#8e8e93",
                fontWeight: 500,
                letterSpacing: "0.1px",
              }}
            >
              Dhiig Kaal
              {isEmergency && (
                <span style={{ color: "#ff453a", fontWeight: 700 }}>
                  {" "}• EMERGENCY
                </span>
              )}
            </span>
            <span
              style={{ fontSize: "11px", color: "#8e8e93", flexShrink: 0 }}
            >
              {timeLabel}
            </span>
          </div>

          {/* Sender name — bold, like WhatsApp contact name */}
          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#ffffff",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: "1.3",
            }}
          >
            {activeTopBanner.title}
          </div>

          {/* Message preview — 2 lines, grey like WhatsApp */}
          <div
            style={{
              fontSize: "13px",
              color: "#aeaeb2",
              lineHeight: "1.4",
              marginTop: "1px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {activeTopBanner.message}
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
            setTimeout(dismissTopBanner, 320);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#636366",
            fontSize: "15px",
            lineHeight: 1,
            cursor: "pointer",
            padding: "0 2px",
            flexShrink: 0,
            marginTop: "1px",
          }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>

      {/* Swipe-up hint pill (visible on mobile) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "5px",
          paddingBottom: "2px",
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 4,
            background: "rgba(255,255,255,0.15)",
          }}
        />
      </div>
    </aside>
  );
}
