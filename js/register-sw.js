// js/register-sw.js

// Fungsi untuk mendaftarkan Service Worker
async function registerServiceWorker() {
  // Cek apakah browser mendukung Service Worker
  if (!('serviceWorker' in navigator)) {
    console.warn('⚠️ Service Worker tidak didukung di browser ini.');
    return;
  }

  try {
    // Tunggu hingga seluruh halaman (termasuk asset) selesai dimuat
    await new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', () => resolve());
      }
    });

    // Daftarkan service worker dari file sw.js
    const registration = await navigator.serviceWorker.register('sw.js');
    console.log(`✅ Service Worker terdaftar dengan scope: ${registration.scope}`);

    // Pantau apakah ada versi SW baru yang ditemukan
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('🔄 Ditemukan update Service Worker, sedang menginstall...');

      // Pantau perubahan state pada SW baru
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // Jika sebelumnya sudah ada SW aktif, berarti ini adalah update
            console.log('✨ Service Worker baru telah terpasang dan siap aktif setelah reload halaman.');
            // Di sini bisa ditambahkan pemberitahuan ke user untuk me-reload halaman
          } else {
            // Jika belum ada SW sebelumnya, ini adalah instalasi pertama
            console.log('🎉 Service Worker pertama kali terpasang.');
          }
        }
      });
    });
  } catch (error) {
    // Tangani jika proses pendaftaran SW gagal
    console.warn('❌ Gagal mendaftar Service Worker:', error);
  }
}

// Jalankan fungsi pendaftaran service worker saat file ini di-load
registerServiceWorker();
