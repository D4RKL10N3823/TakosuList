// ── TakosuList Service Worker ──────────────────────────────────────────────
const CACHE_NAME = "takosulist-v1";

// Solo cacheamos el shell (index.html). Las rutas SPA no son archivos reales.
const PRE_CACHE = ["/"];

// ── Instalación: pre-cachear shell ──────────────────────────────────────────
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Activar inmediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRE_CACHE).catch(() => {}))
  );
});

// ── Activación: limpiar cachés antiguas ─────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      ),
    ])
  );
});

// ── SKIP_WAITING desde pushClient ───────────────────────────────────────────
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

// ── Estrategia de caché ─────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Estrategia para API y otros orígenes (solo cacheamos GET)
  if (url.pathname.startsWith("/api/")) {
    // Si no es un GET, no intentamos cachear (POST, PUT, DELETE no se pueden cachear)
    if (request.method !== "GET") {
      event.respondWith(fetch(request));
      return;
    }

    event.respondWith(
      fetch(request)
        .then((response) => {
          // Si la respuesta es exitosa, guardamos una copia en el caché
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          // Si falla la red (offline), buscamos en el caché
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            // Si no está ni en caché, devolver error JSON
            return new Response(
              JSON.stringify({ error: "Sin conexión y sin datos en caché." }),
              { headers: { "Content-Type": "application/json" }, status: 503 }
            );
          });
        })
    );
    return;
  }

  // 2. Estrategia para el HTML (Network-first para asegurar frescura)
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
    );
    return;
  }

  // 3. Estrategia para Assets (JS, CSS, Imágenes, Fuentes) — Cache-First
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          }
          return res;
        })
        .catch(() => {
          // Si es una imagen y falla, podemos devolver un placeholder
          if (request.destination === "image") {
            return new Response(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#0a1020" width="100" height="100"/><text fill="#06b6d4" x="50" y="55" font-size="40" text-anchor="middle">🐙</text></svg>`,
              { headers: { "Content-Type": "image/svg+xml" } }
            );
          }
        });
    })
  );
});

// ── Push notifications ───────────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let data = {};
  try { data = event.data.json(); } catch { data = { title: "TakosuList", body: event.data.text() }; }

  event.waitUntil(
    self.registration.showNotification(data.title || "TakosuList", {
      body: data.body || "",
      icon: "/icons/icon-192x192.png",
      data: { url: data.url || "/app" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/app";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if (w.url.includes(url) && "focus" in w) return w.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
