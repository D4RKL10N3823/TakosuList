import { registerSW } from "../../registerSW";

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

    if (sw.state === "activated") return resolve(registration);

    // Forzar activación inmediata si está en waiting (requiere handler en sw.js)
    if (registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }

    const timeout = setTimeout(
      () => reject(new Error("Tiempo de espera agotado al activar el Service Worker")),
      10000
    );

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

export async function getSWRegistration() {
  if (!("serviceWorker" in navigator)) return null;

  // Si ya existe, úsalo
  const existing = await navigator.serviceWorker.getRegistration("/");
  if (existing) return existing;

  // Si no existe, regístralo (registerSW debe evitar DEV)
  return await registerSW();
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker no soportado en este navegador");
  }

  // Si ya hay uno registrado, úsalo directamente
  const existing = await navigator.serviceWorker.getRegistration("/");
  if (existing) {
    return waitForActivation(existing);
  }

  // Si no hay, registra y espera activación
  const registration = await getSWRegistration();
  if (!registration) throw new Error("No Service Worker registration available");

  return waitForActivation(registration);
}

function withTimeout(promise, ms, label) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`⏱ Timeout en: ${label} (${ms}ms)`)), ms)
  );
  return Promise.race([promise, timeout]);
}

export async function subscribeToPush(apiClient) {
  // 1) Solicitar permiso
  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error(`Permiso de notificaciones: ${perm}`);

  // 2) Asegurar SW activo
  const reg = await withTimeout(registerServiceWorker(), 8000, "SW activation");
  if (!reg) throw new Error("No se obtuvo registration del Service Worker");

  // 3) Obtener clave VAPID pública del backend
  const { data } = await withTimeout(
    apiClient.get("/api/push/vapidPublicKey"),
    5000,
    "GET /api/push/vapidPublicKey"
  );

  const publicKey = data?.publicKey;
  if (!publicKey) throw new Error("El servidor no devolvió la clave VAPID");

  // 4) Suscribir al servicio push
  const sub = await withTimeout(
    reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    }),
    15000,
    "pushManager.subscribe"
  );

  // 5) Guardar suscripción en el servidor
  await withTimeout(apiClient.post("/api/push/subscribe", sub), 5000, "POST /api/push/subscribe");

  console.log("[Push] ¡Suscripción guardada!");
  return sub;
}