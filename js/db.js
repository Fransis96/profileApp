const DB_NAME = 'profilDB';
const DB_VERSION = 1;
const STORE_NAME = 'profil';

/**
 * Membuka koneksi ke IndexedDB dan mengembalikan objek database.
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject('❌ Gagal membuka IndexedDB');
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Menyimpan atau memperbarui data profil di IndexedDB.
 * @param {Object} data - Data profil yang akan disimpan.
 */
async function saveProfile(data) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    store.put({ ...data, id: 1 });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject('❌ Gagal menyimpan profil ke IndexedDB');
    });
  } catch (err) {
    console.error('[saveProfile]', err);
    throw err;
  }
}

/**
 * Mengambil data profil dari IndexedDB.
 */
async function getProfile() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('❌ Gagal membaca profil dari IndexedDB');
    });
  } catch (err) {
    console.error('[getProfile]', err);
    throw err;
  }
}
