// Jalankan kode setelah seluruh DOM selesai dimuat
window.addEventListener('DOMContentLoaded', async () => {
  let profil;

  try {
    // Coba ambil data profil dari IndexedDB
    profil = await getProfile();
  } catch (err) {
    // Jika gagal (misal browser tidak mendukung), pakai localStorage
    console.warn("IndexedDB tidak tersedia, fallback ke localStorage");
  }

  // Jika profil tidak ditemukan, isi dengan data default dari localStorage
  if (!profil) {
    profil = {
      nama: localStorage.getItem('profileNama') || 'User',
      github: localStorage.getItem('profileGithub') || 'user',
      deskripsi: localStorage.getItem('profileDeskripsi') || 'Belum ada deskripsi...',
      foto: localStorage.getItem('profileImg'),
    };
  }

  // Tampilkan data profil ke elemen HTML sesuai ID-nya
  document.getElementById('profile-name').textContent = profil.nama || 'User';
  document.getElementById('display-name').textContent = profil.nama || 'User';
  document.getElementById('profile-desc').textContent = profil.deskripsi || '';
  document.getElementById('img-profile').src = profil.foto || 'assets/img/profile.png';
  document.getElementById('img-profile').alt = `Foto profil ${profil.nama || 'User'}`;
  document.getElementById('profile-username').textContent = profil.github ? `@${profil.github}` : '@username';

  // Tautan GitHub
  const gitLink = document.getElementById('github-link');
  if (profil.github) {
    gitLink.href = `https://github.com/${profil.github}`;
    gitLink.title = profil.github;

    try {
      // Ambil data publik dari GitHub API
      const res = await fetch(`https://api.github.com/users/${profil.github}`);
      const data = await res.json();
      document.getElementById('repo-count').textContent = data.public_repos ?? '0';
      document.getElementById('followers-count').textContent = data.followers ?? '0';
    } catch (err) {
      // Jika gagal ambil data GitHub
      console.warn('❌ Gagal ambil data GitHub:', err);
      document.getElementById('repo-count').textContent = 'N/A';
      document.getElementById('followers-count').textContent = 'N/A';
    }
  }
});
