
// SARA SOBERANA - SERVICE WORKER PASS-THROUGH
// Este worker existe solo para cumplir con el estándar PWA sin interferir con la red.

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Protocolo de Inmunidad: No interceptamos para evitar errores de CORS/MIME en entornos sandboxed
self.addEventListener('fetch', (event) => {
  // Simplemente dejamos pasar la petición al nexo real
  return;
});
