# Showcase Website — Humas Polres Subang

Portofolio **Dewi Embun Permata Dini**. Pratinjau read-only sistem informasi aktivitas media sosial Polsek, dengan dua sudut pandang pengguna.

**Bukan website resmi, layanan operasional, atau hasil penelitian.** Semua angka, profil operator, rekap, percakapan, pengumuman, konten Instagram, dan hasil analisis pada showcase ini adalah data sintetis. Nama Polsek mengacu pada master publik project.

## Dua sudut pandang

- **Admin Humas Polres:** Dashboard, Kelola Polsek, Kelola User, Rekap Aktivitas, Crawling Instagram, Preprocessing (dataset, normalisasi, riwayat), Implementasi K-Means (centroid awal, iterasi, hasil, DBI), Ranking, Laporan, Pengumuman, Pesan, Profil.
- **Admin Humas Polsek:** Dashboard, Rekap Aktivitas milik unit sendiri, Ranking unit sendiri, Laporan unit sendiri, Pengumuman umum/khusus yang sesuai penerima, Pesan dengan Admin Polres, Profil.
- Pengunjung dapat mengganti POV dan Polsek contoh tanpa login operasional. Pilihan POV bukan autentikasi atau pembatasan akses server: semua data dummy pada repo ini memang publik.

## Yang dapat ditelusuri

Navigasi menu, filter rekap/ranking, detail data, pratinjau formulir, riwayat dataset, statistik Min-Max, tahapan K-Means, DBI, percakapan contoh, pengumuman contoh, notifikasi contoh, ekspor CSV dummy, dan cetak/simpan PDF laporan dummy.

Aksi yang menulis data (tambah, edit, hapus, ubah status, reset password, kirim pesan, terbitkan pengumuman, generate dataset, normalisasi, jalankan K-Means, dan crawling) **dinonaktifkan**. Hasil analisis sudah dipersiapkan dari data sintetis; bukan proses live di website ini.

Demo untuk mencoba K-Means tetap merupakan project terpisah. Showcase ini tidak mengubah project PHP asli maupun demo interaktif tersebut.

## Privasi

- Tidak ada token, ID akun Instagram, password, berkas .env, atau konfigurasi database.
- Tidak ada pengguna atau percakapan asli.
- Tidak ada permintaan API ke Instagram atau server PHP.
- ID publikasi pada contoh crawling hanyalah string fiktif, bukan ID akun.
- Tidak menyembunyikan kredensial di browser: nilai kredensial memang tidak disertakan.
- Pilihan POV/unit disimpan pada sessionStorage browser. Tidak ada perubahan terhadap data contoh.

## Teknologi showcase

HTML, CSS, dan JavaScript modules; file JSON dummy. Berbeda dari aplikasi asli yang menggunakan PHP dan database server. Tidak membutuhkan PHP, MySQL, build step, atau npm install untuk GitHub Pages.

## Publikasi GitHub Pages

1. Tambahkan folder repo ini pada GitHub Desktop, kemudian **Publish repository** sebagai repo publik khusus showcase.
2. Di GitHub: Settings → Pages → Deploy from a branch → main → /(root) → Save.
3. Buka URL Pages setelah deployment selesai.

File .nojekyll dipakai agar file statis disajikan apa adanya. Jalur asset relatif mendukung URL repo GitHub Pages.

Untuk preview lokal, sajikan folder melalui HTTP; jangan buka index.html lewat file:// karena pemuatan JSON memerlukan HTTP.

## Cakupan data contoh

- Periode September 2026 dan Agustus 2026 (bukan periode data penelitian September 2025).
- 21 Polsek × jumlah hari per periode.
- Enam fitur: YouTube, Police Tube, X/Twitter, Instagram, Facebook, TikTok.
- Rekap valid langsung disetujui; POV Polsek hanya membaca rekap sesuai versi project terbaru.
- Dataset adalah total rekap per Polsek/per platform.
- Normalisasi Min-Max disimpan 8 desimal.
- Hasil dummy mengikuti logika deterministic farthest-first, jarak Euclidean, rata-rata centroid, iterasi sampai kriteria konvergensi, dan evaluasi Davies-Bouldin Index dari implementasi project.
- Label serta ranking mengikuti centroid/hasil data dummy; tidak menyalin jumlah anggota, centroid, iterasi, atau nilai DBI penelitian.

CSV dan laporan cetak diberi label DATA DUMMY / SHOWCASE. Jangan dipakai untuk pelaporan operasional.

## Verifikasi sebelum publikasi

- 104 pemeriksaan alur, konsistensi data, cakupan kedua POV, ekspor, navigasi, dan layout responsif lulus.
- 23 pratinjau tindakan diuji: formulir tidak menulis data dan tombol simpan/konfirmasi nonaktif.
- Hasil analisis dua periode dummy dibandingkan langsung dengan KMeansCalculator PHP asli: 1.938 nilai numerik cocok, selisih maksimum 0.
- Tidak ada kesalahan JavaScript atau permintaan jaringan ke origin lain selama pengujian.
- File publik tidak berisi PHP, SQL, .env, kredensial, ID akun Instagram, atau percakapan asli.

Ringkasan pemeriksaan tersedia pada verification.json. Ini verifikasi showcase, bukan pengujian hasil penelitian.
