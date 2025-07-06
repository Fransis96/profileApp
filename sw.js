// Nonaktifkan log Workbox jika digunakan
self.__WB_DISABLE_DEV_LOGS = true;

// Nama versi cache
const CACHE_NAME = "fransis-pwa-v2";

// Daftar file yang akan dicache saat service worker di-install
const urlsToCache = [
  "./index.html",
  "./edit.html",
  "./detail.html",
  "./offline.html",            // fallback saat offline
  "./manifest.json",
  "./js/profile.js",
  "./js/db.js",
  "./assets/img/profile.svg",
  "./assets/img/offline.gif",

  // CDN eksternal
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css",
];

// Event: Install
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Lewati fase waiting dan langsung aktif
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => console.error("❌ Gagal cache saat install:", err))
  );
});

// Event: Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // 🔁 Hapus cache lama jika versi berubah
          }
        })
      )
    )
  );
  self.clients.claim(); // Segera ambil kontrol atas halaman aktif
});

// Event: Fetch / Intersepsi permintaan jaringan
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika file sudah di-cache, langsung kembalikan
      if (response) return response;

      // Jika belum, coba ambil dari jaringan
      return fetch(event.request).catch(() => {
        // 🔌 Jika jaringan gagal dan request HTML → fallback ke offline.html
        if (event.request.headers.get("accept")?.includes("text/html")) {
          return caches.match("./offline.html");
        }

        // Jika non-HTML dan gagal → kembalikan respon kosong
        return new Response("", {
          status: 200,
          statusText: "Offline fallback response",
        });
      });
    })
  );
});
