import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// GET all notifications for logged-in user
router.get("/", protect, getUserNotifications);

// PUT mark single notification as read
router.put("/:id/read", protect, markNotificationAsRead);

// PUT mark all as read
router.put("/read-all", protect, markAllNotificationsAsRead);

// DELETE single notification
router.delete("/:id", protect, deleteNotification);

export default router;
