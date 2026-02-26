// ── TakosuList Service Worker ──────────────────────────────────────────────
const CACHE_VERSION = "v2";
const CACHE_NAME = `takosulist-${CACHE_VERSION}`;

// Shell mínimo para SPA (Vite + React). "/" suele servir index.html.
const PRE_CACHE = ["/"];

// ── Instalación: pre-cachear shell ─────────────────────────────────────────
self.addEventListener("install", (event) => {
  // Activar inmediatamente (controlado también por SKIP_WAITING)
  self.skipWaiting();

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRE_CACHE))
      .catch(() => {
        // No romper instalación si algo falla
      })
  );
});

// ── Activación: reclamar clientes y limpiar cachés antiguas ─────────────────
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

// ── SKIP_WAITING desde pushClient ──────────────────────────────────────────
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Helpers ───────────────────────────────────────────────────────────────────
async function putInCache(request, response) {
  // Solo cacheamos respuestas válidas
  // Nota: response.type puede ser "opaque" para cross-origin sin CORS (no siempre conviene cachearlo)
  if (!response || !response.ok) return;

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
}

async function cacheMatch(request) {
  const cache = await caches.open(CACHE_NAME);
  return await cache.match(request);
}

// ── Fetch: estrategias de caché ────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejamos http(s)
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // 1) API: network-first (solo GET) con fallback a caché
  if (url.pathname.startsWith("/api/")) {
    if (request.method !== "GET") {
      // POST/PUT/DELETE no se cachean
      event.respondWith(fetch(request));
      return;
    }

    event.respondWith(
      (async () => {
        try {
          const res = await fetch(request);
          // Guardar copia si OK
          await putInCache(request, res.clone());
          return res;
        } catch (err) {
          const cached = await cacheMatch(request);
          if (cached) return cached;

          return new Response(
            JSON.stringify({ error: "Sin conexión y sin datos en caché." }),
            { status: 503, headers: { "Content-Type": "application/json" } }
          );
        }
      })()
    );
    return;
  }

  // 2) Navegación (HTML): network-first + SPA fallback al shell ("/")
  // request.mode === "navigate" cubre clics, refresh, escritura de URL, etc.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(request);

          // Si el servidor devuelve 404/500 para una ruta SPA, devolvemos el shell
          if (!res || !res.ok) {
            const shell = await cacheMatch("/");
            return shell || (await fetch("/"));
          }

          // Cachear la navegación exitosa (opcional)
          await putInCache(request, res.clone());
          return res;
        } catch (err) {
          // Offline: devolver shell desde caché
          const shell = await cacheMatch("/");
          return (
            shell ||
            new Response("Offline", {
              status: 200,
              headers: { "Content-Type": "text/html; charset=utf-8" },
            })
          );
        }
      })()
    );
    return;
  }

  // 3) Assets estáticos (JS/CSS/img/fonts): cache-first
  // Para evitar cachear requests no-GET, dejamos pasar.
  if (request.method === "GET") {
    event.respondWith(
      (async () => {
        const cached = await cacheMatch(request);
        if (cached) return cached;

        try {
          const res = await fetch(request);
          await putInCache(request, res.clone());
          return res;
        } catch (err) {
          // Placeholder si es imagen
          if (request.destination === "image") {
            return new Response(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                 <rect width="100" height="100" fill="#0a1020"/>
                 <text x="50" y="58" font-size="40" text-anchor="middle" fill="#06b6d4">🐙</text>
               </svg>`,
              { headers: { "Content-Type": "image/svg+xml" } }
            );
          }
          // Si no hay red y no hay caché, dejar que falle
          return new Response("Offline", { status: 503 });
        }
      })()
    );
    return;
  }

  // Para cualquier otro caso, dejamos al navegador manejarlo
});

// ── Push notifications ─────────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: "TakosuList", body: event.data.text() };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "TakosuList", {
      body: data.body || "",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      data: { url: data.url || "/app" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/app";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      // Si ya hay una ventana, enfocarla
      for (const w of wins) {
        if (w.url.includes(targetUrl) && "focus" in w) return w.focus();
      }
      // Si no, abrir una nueva
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
