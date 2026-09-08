import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getVapidPublicKey,
  savePushSubscription,
  testPushNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// GET public VAPID key
router.get("/vapid-key", getVapidPublicKey);

// POST save push subscription
router.post("/subscribe", protect, savePushSubscription);

// POST test push notification (with delay)
router.post("/test-push", protect, testPushNotification);

// GET all notifications for logged-in user
router.get("/", protect, getUserNotifications);

// PUT mark single notification as read
router.put("/:id/read", protect, markNotificationAsRead);

// PUT mark all as read
router.put("/read-all", protect, markAllNotificationsAsRead);

// DELETE single notification
router.delete("/:id", protect, deleteNotification);

export default router;
