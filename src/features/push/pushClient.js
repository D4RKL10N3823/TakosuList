function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

/** Espera a que el Service Worker esté completamente activo */
function waitForActivation(registration) {
  return new Promise((resolve, reject) => {
    const sw = registration.installing || registration.waiting || registration.active;
    if (!sw) return reject(new Error("No se encontró Service Worker"));

    if (sw.state === "activated") {
      return resolve(registration);
    }

    // Forzar activación inmediata si está en waiting
    if (registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }

    const timeout = setTimeout(() => reject(new Error("Tiempo de espera agotado al activar el Service Worker")), 10000);

    sw.addEventListener("statechange", function handler(e) {
      if (e.target.state === "activated") {
        clearTimeout(timeout);
        sw.removeEventListener("statechange", handler);
        resolve(registration);
      } else if (e.target.state === "redundant") {
        clearTimeout(timeout);
        sw.removeEventListener("statechange", handler);
        reject(new Error("Service Worker fue descartado"));
      }
    });
  });
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) throw new Error("Service Worker no soportado en este navegador");

  // Si ya hay uno registrado, úsalo directamente
  const existing = await navigator.serviceWorker.getRegistration("/");
  if (existing) {
    return waitForActivation(existing);
  }

  const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  return waitForActivation(registration);
}

function withTimeout(promise, ms, label) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`⏱ Timeout en: ${label} (${ms}ms)`)), ms)
  );
  return Promise.race([promise, timeout]);
}

export async function subscribeToPush(apiClient) {
  // 1. Solicitar permiso
  console.log("[Push] Solicitando permiso...");
  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error(`Permiso de notificaciones: ${perm}`);
  console.log("[Push] Permiso concedido");

  // 2. Registrar / esperar SW activo
  console.log("[Push] Registrando Service Worker...");
  const reg = await withTimeout(registerServiceWorker(), 8000, "SW activation");
  console.log("[Push] SW activo:", reg);

  // 3. Obtener clave VAPID pública del backend
  console.log("[Push] Obteniendo clave VAPID...");
  const { data } = await withTimeout(
    apiClient.get("/api/push/vapidPublicKey"),
    5000,
    "GET /api/push/vapidPublicKey"
  );
  const publicKey = data.publicKey;
  if (!publicKey) throw new Error("El servidor no devolvió la clave VAPID");
  console.log("[Push] Clave VAPID:", publicKey.slice(0, 20) + "...");

  // 4. Suscribir al servicio push (puede tardar — red externa)
  console.log("[Push] Suscribiendo a push service...");
  const sub = await withTimeout(
    reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    }),
    15000,
    "pushManager.subscribe"
  );
  console.log("[Push] Suscripción creada:", sub.endpoint.slice(0, 40) + "...");

  // 5. Guardar suscripción en el servidor
  console.log("[Push] Guardando suscripción en servidor...");
  await withTimeout(
    apiClient.post("/api/push/subscribe", sub),
    5000,
    "POST /api/push/subscribe"
  );
  console.log("[Push] ¡Suscripción guardada!");
  return sub;
}