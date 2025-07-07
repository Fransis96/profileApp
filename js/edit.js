let profileFotoBase64 = '';

// Preview Gambar
document.getElementById('profilePic').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      profileFotoBase64 = event.target.result;
      document.getElementById('previewImg').src = profileFotoBase64;
    };
    reader.readAsDataURL(file);
  }
});

// Load Data Profil
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const profil = await getProfile();
    if (profil) {
      document.getElementById('nama').value = profil.nama || '';
      document.getElementById('deskripsi').value = profil.deskripsi || '';
      document.getElementById('github_acc').value = profil.github || '';
      if (profil.foto) {
        profileFotoBase64 = profil.foto;
        document.getElementById('previewImg').src = profil.foto;
      }
    }
  } catch (err) {
    console.error('❌ Gagal memuat profil:', err);
  }
});

// Simpan Profil
document.getElementById('editProfileForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const data = {
    nama: document.getElementById('nama').value.trim(),
    deskripsi: document.getElementById('deskripsi').value.trim(),
    github: document.getElementById('github_acc').value.trim(),
    foto: profileFotoBase64 || document.getElementById('previewImg').src
  };
  try {
    await saveProfile(data);
    alert('✅ Profil berhasil disimpan!');
    window.location.href = 'index.html';
  } catch (err) {
    alert('❌ Gagal menyimpan profil.');
    console.error(err);
  }
});
