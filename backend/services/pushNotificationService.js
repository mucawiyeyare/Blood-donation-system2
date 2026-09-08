import webpush from "web-push";
import PushSubscription from "../models/pushSubscriptionModel.js";

// Initialize VAPID
const vapidPublicKey =
  process.env.VAPID_PUBLIC_KEY ||
  "BPujmoXAqNxiD7WW-5HZSoPFpGXlxI0C8L37Vh-O7XrBwcwEvnTQodYaYNG-fMSI5z6IH9kygseS6qr5krEQ41M";
const vapidPrivateKey =
  process.env.VAPID_PRIVATE_KEY || "RpBA2KSe7_rODbG0-CSk4KQLZZHq1HJVSkPweC8_m28";
const vapidEmail =
  process.env.VAPID_EMAIL || "mailto:support@dhiigkaal.iftiinhub.com";

try {
  webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);
  console.log("[WebPush] VAPID details configured successfully");
} catch (err) {
  console.error("[WebPush] Failed to set VAPID details:", err.message);
}

/**
 * Send high-priority OS-level warning push notification to user
 * Will wake up phone and show on top of YouTube or other running apps
 */
export const sendUrgentPushToUser = async (
  userId,
  {
    title = "🚨 DIGIIN DEGDEG AH: Waxaa loo baahan yahay dhiig!",
    body = "Isbitaal ayaa si degdeg ah ugu baahan dhiig. Fadlan fur codsiga.",
    urgency = "high",
    data = {},
  }
) => {
  try {
    if (!userId) return { success: false, reason: "No userId provided" };

    const subscriptions = await PushSubscription.find({ user: userId });
    if (!subscriptions || subscriptions.length === 0) {
      return { success: false, reason: "No push subscriptions for user" };
    }

    const payload = JSON.stringify({
      title,
      body,
      icon: "/logo.png",
      badge: "/logo.png",
      tag: `dhiigkaal-warning-${Date.now()}`,
      vibrate: [400, 200, 400, 200, 400],
      requireInteraction: true, // Remains on top until touched
      data: {
        ...data,
        actionUrl: data.actionUrl || "/dashboard/donor-requests",
        timestamp: Date.now(),
      },
      actions: [
        { action: "open", title: "Fur Codsiga (Open)" },
        { action: "close", title: "Xir (Dismiss)" },
      ],
    });

    const pushPromises = subscriptions.map(async (sub) => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.keys.p256dh,
          auth: sub.keys.auth,
        },
      };

      try {
        await webpush.sendNotification(pushConfig, payload, {
          urgency: urgency === "high" ? "high" : "normal",
          TTL: 60 * 60 * 2, // 2 hours
        });
        return { success: true, endpoint: sub.endpoint };
      } catch (error) {
        // HTTP 410 or 404 indicates subscription expired/unregistered
        if (error.statusCode === 410 || error.statusCode === 404) {
          console.log(`[WebPush] Pruning expired subscription for user ${userId}`);
          await PushSubscription.deleteOne({ _id: sub._id });
        } else {
          console.error(`[WebPush] Push failed for ${sub.endpoint}:`, error.message);
        }
        return { success: false, error: error.message };
      }
    });

    const results = await Promise.all(pushPromises);
    const sentCount = results.filter((r) => r.success).length;

    console.log(
      `[WebPush] Dispatched OS warning to user ${userId}: ${sentCount}/${subscriptions.length} devices reached`
    );

    return {
      success: sentCount > 0,
      sentCount,
      totalDevices: subscriptions.length,
    };
  } catch (err) {
    console.error("[WebPush] General error sending push notification:", err);
    return { success: false, error: err.message };
  }
};
