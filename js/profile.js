window.addEventListener('DOMContentLoaded', async () => {
  let profil;

  try {
    // Ambil data dari IndexedDB
    profil = await getProfile();
  } catch (err) {
    console.warn("IndexedDB tidak tersedia, fallback ke localStorage");
  }

  // Jika tidak ada di IndexedDB, coba ambil dari localStorage (fallback)
  if (!profil) {
    profil = {
      nama: localStorage.getItem('profileNama') || 'Fransis96',
      github: localStorage.getItem('profileGithub') || 'Fransis96',
      deskripsi: localStorage.getItem('profileDeskripsi') || 'Mahasiswa yang sedang belajar membuat website responsif menggunakan Bootstrap 5 dan HTML5.',
      foto: localStorage.getItem('profileImg'),
    };
  }

  // Update elemen tampilan
  document.getElementById('profileNama').textContent = profil.nama || 'User';
  document.getElementById('namaSpan').textContent = profil.nama || 'User';
  document.getElementById('githubLink').href = `https://github.com/${profil.github || ''}`;
  document.getElementById('deskripsiText').textContent = profil.deskripsi || '';

  if (profil.foto) {
    document.getElementById('profileImg').src = profil.foto;
  }

  // Ambil statistik GitHub
  if (profil.github) {
    fetch(`https://api.github.com/users/${profil.github}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById('repo-count').textContent = data.public_repos ?? '0';
        document.getElementById('followers-count').textContent = data.followers ?? '0';
      })
      .catch(err => {
        console.error('Gagal ambil GitHub:', err);
        document.getElementById('repo-count').textContent = 'N/A';
        document.getElementById('followers-count').textContent = 'N/A';
      });
  }
});
