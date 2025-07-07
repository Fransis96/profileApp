// Nonaktifkan log Workbox di mode pengembangan
self.__WB_DISABLE_DEV_LOGS = true;

// Nama cache yang akan digunakan
const CACHE_NAME = "fransis-pwa-v2";

// Daftar file yang akan disimpan ke cache saat instalasi
const urlsToCache = [
  "./",
  "./index.html",
  "./edit.html",
  "./detail.html",
  "./offline.html",
  "./manifest.json",
  "./js/db.js",
  "./js/edit.js",
  "./js/profile.js",
  "./assets/img/profile.png",
  "./assets/img/offline.gif",

  // CDN eksternal yang juga ingin dicache
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css",
];

// Event: Install service worker
self.addEventListener("install", (event) => {
  // Lewati fase waiting agar langsung aktif
  self.skipWaiting();

  // Simpan file-file ke cache
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }).catch((err) => console.error("❌ Gagal cache saat install:", err))
  );
});

// Event: Activate service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    // Hapus cache lama yang tidak sesuai dengan nama CACHE_NAME
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );

  // Ambil kendali atas semua halaman yang terbuka
  self.clients.claim();
});

// Event: Fetch (menangani semua permintaan jaringan)
self.addEventListener("fetch", (event) => {
  // Tangani navigasi (misalnya saat pengguna buka halaman baru)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      // Jika gagal memuat, tampilkan halaman offline
      fetch(event.request).catch(() => caches.match("./offline.html"))
    );
    return;
  }

  // Tangani permintaan lain (CSS, JS, gambar, dll.)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Gunakan cache jika tersedia, jika tidak fetch dari jaringan
      return cachedResponse || fetch(event.request).catch(() => {
        // Jika permintaan gambar gagal, tampilkan gambar fallback
        if (event.request.destination === 'image') {
          return caches.match("./assets/img/offline.gif");
        }

        // Fallback untuk request lainnya
        return new Response("", {
          status: 200,
          statusText: "Offline fallback response",
        });
      });
    })
  );
});
