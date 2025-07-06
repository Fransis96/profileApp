// Nama cache
const CACHE_NAME = "frans-pwa-v2";

// Daftar file yang akan di-cache saat install
const urlsToCache = [
  "./index.html",
  "./edit.html",
  "./detail.html",
  "./offline.html",            // fallback page saat offline
  "./manifest.json",
  "./css/style.css",
  "./js/profile.js",
  "./assets/img/profile.webp",
  "./assets/img/offline.gif",

  // CDN eksternal (Bootstrap, FontAwesome, dsb)
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css",
];

// Instalasi service worker
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => console.error("Gagal cache saat install:", err))
  );
});

// Aktivasi service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Hapus cache lama
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Intersepsi permintaan
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika ada di cache, kembalikan
      if (response) return response;

      // Jika tidak ada, coba dari jaringan
      return fetch(event.request).catch(() => {
        // Jika offline dan permintaan HTML, tampilkan halaman offline
        if (event.request.headers.get("accept")?.includes("text/html")) {
          return caches.match("./offline.html");
        }

        // Jika bukan HTML, kirim respon kosong
        return new Response("", {
          status: 200,
          statusText: "Offline fallback response",
        });
      });
    })
  );
});
