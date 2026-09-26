import Notification from "../models/notificationModel.js";
import PushSubscription from "../models/pushSubscriptionModel.js";
import { sendUrgentPushToUser } from "../services/pushNotificationService.js";

/**
 * Reusable helper to create in-system notification
 */
export const createNotification = async ({
  recipient,
  sender,
  title,
  message,
  type = "blood_request",
  channel = "both",
  data = {},
}) => {
  try {
    if (!recipient || !title || !message) {
      console.warn("[Notification] Missing required fields for notification");
      return null;
    }

    const notification = new Notification({
      recipient,
      sender: sender || null,
      title,
      message,
      type,
      channel,
      data,
      isRead: false,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("[Notification] Error creating notification:", error.message);
    return null;
  }
};

/**
 * GET /api/notifications
 * Fetch notifications for authenticated user
 */
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = Math.min(parseInt(req.query.limit, 10) || 30, 100);

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ recipient: userId })
        .populate("sender", "name email phone location")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
      Notification.countDocuments({ recipient: userId, isRead: false }),
    ]);

    res.json({
      success: true,
      unreadCount,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/notifications/:id/read
 * Mark single notification as read
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

    res.json({
      success: true,
      notification,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/notifications/read-all
 * Mark all user's notifications as read
 */
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({
      success: true,
      modifiedCount: result.modifiedCount,
      unreadCount: 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndDelete({ _id: id, recipient: userId });

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

    res.json({
      success: true,
      message: "Notification deleted",
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/notifications/vapid-key
 * Returns the public VAPID key so frontend can subscribe to push notifications
 */
export const getVapidPublicKey = async (req, res) => {
  try {
    const key =
      process.env.VAPID_PUBLIC_KEY ||
      "BPujmoXAqNxiD7WW-5HZSoPFpGXlxI0C8L37Vh-O7XrBwcwEvnTQodYaYNG-fMSI5z6IH9kygseS6qr5krEQ41M";
    res.json({ success: true, publicKey: key });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/notifications/subscribe
 * Registers or updates a client Web Push Subscription
 */
export const savePushSubscription = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    const userId = req.user._id;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid push subscription data" });
    }

    const sub = await PushSubscription.findOneAndUpdate(
      { endpoint },
      {
        user: userId,
        endpoint,
        keys: {
          p256dh: keys.p256dh,
          auth: keys.auth,
        },
        userAgent: req.headers["user-agent"] || "",
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Device registered for emergency push notifications",
      subscriptionId: sub._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/notifications/resubscribe
 * The browser can silently rotate a push subscription's endpoint at any time (most commonly
 * weeks/months later, while the app is closed) — without handling that, the device would just
 * stop receiving alerts with no error visible to the donor or the admin. The service worker's
 * `pushsubscriptionchange` handler calls this to swap in the new endpoint/keys in place.
 * Deliberately unauthenticated: a service worker has no access to the page's JWT (and one saved
 * long ago may well have expired by the time this fires), so the old endpoint — a value only
 * ever known to the device that held that subscription — is what proves this is the same device.
 */
export const resubscribePush = async (req, res) => {
  try {
    const { oldEndpoint, endpoint, keys } = req.body;
    if (!oldEndpoint || !endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ success: false, message: "Invalid resubscribe data" });
    }

    const existing = await PushSubscription.findOne({ endpoint: oldEndpoint });
    if (!existing) {
      return res.status(404).json({ success: false, message: "No matching subscription to rotate" });
    }

    existing.endpoint = endpoint;
    existing.keys = { p256dh: keys.p256dh, auth: keys.auth };
    await existing.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/notifications/devices
 * List the current user's registered push-notification devices
 */
export const getMyDevices = async (req, res) => {
  try {
    const devices = await PushSubscription.find({ user: req.user._id })
      .select("_id endpoint userAgent createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ success: true, devices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/notifications/devices/:id
 * Revoke (unsubscribe) one of the current user's registered devices
 */
export const revokeDevice = async (req, res) => {
  try {
    const device = await PushSubscription.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    res.json({ success: true, message: "Device revoked" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/notifications/test-push
 * Allows a user to test their push notification.
 * Delays by 4 seconds so the user can switch to YouTube or another app on their phone.
 */
export const testPushNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const delaySeconds = parseInt(req.body.delaySeconds, 10) || 4;

    const count = await PushSubscription.countDocuments({ user: userId });
    if (count === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Taleefankaaga weli looma diwaangelin ogeysiisyada. Fadlan guji 'Ogolow Digniinta' marka hore.",
      });
    }

    res.json({
      success: true,
      message: `Digniinta tijaabada ah waxaa la soo diri doonaa ${delaySeconds} ilbiriqsi ka dib. Hadda u beddel YouTube ama app kale si aad u aragto!`,
      delaySeconds,
    });

    // Send after delay so user can switch to YouTube or lock phone
    setTimeout(async () => {
      await sendUrgentPushToUser(userId, {
        title: "🚨 TIJAABO: Digniin Dhiig-bixin Degdeg ah!",
        body: "Hambalyo! Digniintani waxay dusha sare kaga soo muuqanaysaa YouTube iyo apps-ka kale marka loo baahdo dhiig.",
        urgency: "high",
        data: {
          actionUrl: "/dashboard/donor-requests",
          test: true,
        },
      });
    }, delaySeconds * 1000);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
