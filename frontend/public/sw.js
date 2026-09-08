// DHIIG KAAL Service Worker for OS-Level Emergency Warning Notifications
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle incoming Web Push notification (wakes up phone over YouTube/other apps)
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || "🚨 DIGIIN DEGDEG AH: Dhiig Baa Loo Baahan Yahay!";
    const options = {
      body:
        data.body ||
        data.message ||
        "Waxaa loo baahan yahay dhiig-bixin degdeg ah si loo badbaadiyo nolol. Fadlan fur codsiga.",
      icon: "/logo.png",
      badge: "/logo.png",
      vibrate: [400, 200, 400, 200, 400],
      requireInteraction: true, // Remains on top until user acts on it
      renotify: true,
      tag: data.tag || `emergency-alert-${Date.now()}`,
      data: {
        url: data.data?.actionUrl || data.url || "/dashboard/donor-requests",
      },
      actions: [
        { action: "open", title: "🚨 Fur Codsiga (View)" },
        { action: "close", title: "Xir (Dismiss)" },
      ],
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error("Error processing push event:", err);
  }
});

// Handle notification click on mobile phone (over YouTube or lockscreen)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") return;

  const targetUrl = event.notification.data?.url || "/dashboard/donor-requests";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus and navigate it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
