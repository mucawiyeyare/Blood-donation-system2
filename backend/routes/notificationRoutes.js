import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getVapidPublicKey,
  savePushSubscription,
  resubscribePush,
  testPushNotification,
  getMyDevices,
  revokeDevice,
} from "../controllers/notificationController.js";

const router = express.Router();

// GET public VAPID key
router.get("/vapid-key", getVapidPublicKey);

// POST save push subscription
router.post("/subscribe", protect, savePushSubscription);

// POST rotate an existing push subscription (called by the service worker itself, with no user
// signed in at the time — see resubscribePush for why this is intentionally unauthenticated)
router.post("/resubscribe", resubscribePush);

// POST test push notification (with delay)
router.post("/test-push", protect, testPushNotification);

// GET list this user's registered push devices
router.get("/devices", protect, getMyDevices);

// DELETE revoke one of this user's registered push devices
router.delete("/devices/:id", protect, revokeDevice);

// GET all notifications for logged-in user
router.get("/", protect, getUserNotifications);

// PUT mark single notification as read
router.put("/:id/read", protect, markNotificationAsRead);

// PUT mark all as read
router.put("/read-all", protect, markAllNotificationsAsRead);

// DELETE single notification
router.delete("/:id", protect, deleteNotification);

export default router;
