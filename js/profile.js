window.addEventListener('DOMContentLoaded', () => {
  const nama = localStorage.getItem('profileNama') || 'Fransis96';
  const github = localStorage.getItem('profileGithub') || 'Fransis96';
  const deskripsi = localStorage.getItem('profileDeskripsi') || 'Mahasiswa yang sedang belajar membuat website responsif menggunakan Bootstrap 5 dan HTML5.';
  const gambar = localStorage.getItem('profileImg');

  document.getElementById('profileNama').textContent = nama;
  document.getElementById('namaSpan').textContent = nama;
  document.getElementById('githubLink').href = `https://github.com/${github}`;
  document.getElementById('deskripsiText').textContent = deskripsi;
  if (gambar) {
    document.getElementById('profileImg').src = gambar;
  }

  fetch(`https://api.github.com/users/${github}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('repo-count').textContent = data.public_repos;
      document.getElementById('followers-count').textContent = data.followers;
    })
    .catch(err => {
      console.error('Gagal ambil GitHub:', err);
      document.getElementById('repo-count').textContent = 'N/A';
      document.getElementById('followers-count').textContent = 'N/A';
    });
});
