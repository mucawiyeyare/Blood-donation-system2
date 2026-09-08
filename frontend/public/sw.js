// DHIIG KAAL Service Worker for Mobile Notifications
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle incoming push notification
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || "🩸 Dhiig Kaal Notification";
    const options = {
      body: data.message || "Waxaad heshay ogeysiis cusub oo dhiig-bixin ah.",
      icon: "/logo.png",
      badge: "/logo.png",
      vibrate: [200, 100, 200, 100, 200],
      tag: data.tag || "dhiig-kaal-notification",
      data: {
        url: data.url || "/dashboard/donor-requests",
      },
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error("Error displaying push notification:", err);
  }
});

// Handle notification click on mobile phone
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/dashboard/donor-requests";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
