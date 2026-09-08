import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { playNotificationChime } from "../utils/notificationSound";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTopBanner, setActiveTopBanner] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("default");

  const knownIdsRef = useRef(new Set());
  const isInitialLoadRef = useRef(true);
  const pollTimerRef = useRef(null);
  const swRegistrationRef = useRef(null);

  // Register service worker on mount
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          swRegistrationRef.current = reg;
        })
        .catch((err) => {
          console.debug("Service worker registration failed:", err);
        });
    }

    if ("Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Request browser push notification permission
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return "unsupported";

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      return permission;
    } catch (err) {
      console.error("Error requesting notification permission:", err);
      return "denied";
    }
  };

  // Trigger native mobile browser push notification
  const triggerNativeNotification = useCallback((notification) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    const title = notification.title || "🩸 Dhiig Kaal Notification";
    const options = {
      body: notification.message || "Waxaad heshay codsi cusub.",
      icon: "/logo.png",
      badge: "/logo.png",
      vibrate: [200, 100, 200],
      tag: `dhiigkaal-${notification._id || Date.now()}`,
      data: {
        url: notification.data?.actionUrl || "/dashboard/donor-requests",
      },
    };

    // Prefer service worker showNotification on mobile Android/Chrome
    if (swRegistrationRef.current && "showNotification" in swRegistrationRef.current) {
      swRegistrationRef.current.showNotification(title, options).catch(() => {
        try {
          new Notification(title, options);
        } catch (e) {}
      });
    } else {
      try {
        const n = new Notification(title, options);
        n.onclick = () => {
          window.focus();
          if (notification.data?.actionUrl) {
            window.location.href = notification.data.actionUrl;
          }
          n.close();
        };
      } catch (e) {}
    }
  }, []);

  // Trigger mobile top notification heads-up banner & audio chime
  const notifyUser = useCallback(
    (notification) => {
      // 1. Play realistic phone push notification chime
      playNotificationChime();

      // 2. Set active in-app top mobile floating banner
      setActiveTopBanner(notification);

      // 3. Fire native OS notification on mobile/desktop
      triggerNativeNotification(notification);
    },
    [triggerNativeNotification]
  );

  // Fetch notifications from server
  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("/api/notifications?limit=30", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        const incoming = res.data.notifications || [];
        setNotifications(incoming);
        setUnreadCount(res.data.unreadCount || 0);

        if (isInitialLoadRef.current) {
          // On first load, record existing IDs without firing loud banner alerts
          incoming.forEach((n) => knownIdsRef.current.add(n._id));
          isInitialLoadRef.current = false;
        } else {
          // Check for newly arrived unread notifications
          const newItems = incoming.filter(
            (n) => !knownIdsRef.current.has(n._id) && !n.isRead
          );

          if (newItems.length > 0) {
            // New notification arrived! Alert user with top mobile banner
            const latest = newItems[0];
            notifyUser(latest);

            // Add new IDs to known set
            newItems.forEach((n) => knownIdsRef.current.add(n._id));
          }
        }
      }
    } catch (err) {
      console.debug("Error fetching notifications:", err.message);
    }
  }, [notifyUser]);

  // Polling loop when authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();

    // Poll every 8 seconds for real-time notification sync
    pollTimerRef.current = setInterval(fetchNotifications, 8000);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [fetchNotifications]);

  // Mark single notification as read
  const markAsRead = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.put(
        `/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.put(
        "/api/notifications/read-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) => {
        const target = prev.find((n) => n._id === id);
        if (target && !target.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n._id !== id);
      });
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // Dismiss top mobile heads-up banner
  const dismissTopBanner = () => {
    setActiveTopBanner(null);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeTopBanner,
        permissionStatus,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        dismissTopBanner,
        requestNotificationPermission,
        notifyUser,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
