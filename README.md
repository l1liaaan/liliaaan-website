# Liliaaan Studio — Data. Systems. Digital Solutions.

Website jasa personal technology studio untuk layanan sistem informasi, dashboard monitoring, data analytics, machine learning, ETL, dan data administration.

Dibuat dengan **HTML5, CSS3, dan Vanilla JavaScript** — tanpa framework, tanpa build step, tanpa dependency npm. Cukup buka `index.html` di browser, atau deploy langsung ke **Cloudflare Pages**.

---

## Daftar isi

1. [Struktur folder](#struktur-folder)
2. [Menjalankan secara lokal](#menjalankan-secara-lokal)
3. [Kustomisasi](#kustomisasi)
4. [Perilaku form kontak](#perilaku-form-kontak)
5. [Deployment ke Cloudflare Pages](#deployment-ke-cloudflare-pages)
6. [Update website](#update-website)
7. [Rencana pengembangan (Phase 1–7)](#rencana-pengembangan)
8. [Checklist sebelum publish](#checklist-sebelum-publish)

---

## Struktur folder

```
/
├── index.html              # Seluruh halaman: SEO, section, dialog case study
├── style.css               # Design tokens (CSS variables), layout, animasi, dark mode
├── script.js               # Interaksi: tema, navbar, menu mobile, reveal, form, dll.
├── assets/
│   ├── images/
│   │   └── og-image.png    # Gambar preview saat link dibagikan (1200×630)
│   └── icons/
│       ├── favicon.svg
│       └── apple-touch-icon.png
├── robots.txt              # Instruksi untuk mesin pencari
├── sitemap.xml             # Daftar URL untuk mesin pencari
├── _headers                # Security & cache headers (dibaca otomatis oleh Cloudflare Pages)
└── README.md
```

Icon menggunakan **inline SVG sprite** bergaya Lucide yang sudah ditanam di `index.html` (di bawah tag `<body>`). Jadi tidak ada request ke icon library eksternal. Satu-satunya resource eksternal adalah Google Fonts (Geist & Geist Mono); jika gagal dimuat, website otomatis memakai font sistem.

---

## Menjalankan secara lokal

**Cara paling cepat:** klik dua kali `index.html`. Semua fitur berjalan.

**Cara yang disarankan** (agar perilakunya sama dengan saat online), jalankan server lokal dari folder project:

```bash
# Python 3
python -m http.server 8000

# atau Node.js
npx serve .
```

Lalu buka `http://localhost:8000`.

---

## Kustomisasi

### 1. Nama brand dan data kontak

Data yang sudah terpasang:

| Data | Nilai |
|---|---|
| Brand | Liliaaan Studio |
| Nama tampilan | Liliaaan |
| Domain | `liliaaan.pages.dev` |
| Email | nuraulia.putri150405@gmail.com |
| WhatsApp | +62 823-3963-3564 (`6282339633564`) |
| LinkedIn | linkedin.com/in/nur-aulia-putri-5a90aa2b0 |
| GitHub | github.com/l1liaaan |

Jika ingin mengganti, pakai *Find & Replace in Files* di editor (VS Code: `Ctrl+Shift+H`). Nomor WhatsApp muncul dalam dua bentuk: tampilan (`+62 823-3963-3564`) dan link (`6282339633564`). Jika nama project di Cloudflare Pages ternyata berbeda, ganti `liliaaan.pages.dev` di `index.html`, `robots.txt`, dan `sitemap.xml`.

### 2. Warna dan radius

Semua token desain ada di bagian atas `style.css`:

```css
:root {
  --color-bg: #F6F6F4;
  --color-surface: #FFFFFF;
  --color-text: #15171C;
  --color-muted: ...;
  --color-border: ...;
  --color-accent: #0B7A6E;   /* warna aksen utama */
  --radius: 20px;
  --shadow: ...;
}

[data-theme="dark"] {
  --color-accent: #3CC8B4;   /* aksen versi dark mode */
  ...
}
```

Jika mengganti `--color-accent`, ganti juga versi dark mode-nya dan pastikan kontras teks tetap cukup (target minimal 4.5:1 untuk teks kecil). Ganti juga `--color-accent-strong` dan `--color-accent-soft` agar konsisten.

### 3. Kartu nama (section About)

Section About menampilkan kartu nama yang bisa dibalik: sisi depan berisi brand, nama, dan jabatan; sisi belakang berisi kontak yang bisa diklik. Semua isinya ada di `index.html` (cari komentar `KARTU NAMA`), sedangkan warna dan ukurannya di `style.css` bagian `.bizcard`. Rasio kartu mengikuti kartu nama standar (85 × 55 mm).

### 4. Portfolio / case study

Keempat project di section **Selected Work** adalah **contoh (PLACEHOLDER)**. Cara menggantinya:

- **Card project**: edit langsung di `index.html` (cari komentar `PLACEHOLDER: ganti keempat project`). Setiap card berisi kategori, judul, deskripsi, teknologi, mockup, dan hasil.
- **Isi popup "View Case Study"**: di bagian bawah `index.html` ada `<template id="case-dashboard">`, `case-system`, `case-forecast`, dan `case-etl`. Tombol card memanggil template lewat atribut `data-case="..."`. Untuk menambah project, buat template baru dengan id unik lalu arahkan tombolnya ke id tersebut.
- Mockup dibuat dengan HTML/CSS (bukan gambar) supaya ringan dan tajam. Anda bisa menggantinya dengan screenshot asli:
  `<img src="assets/images/project-1.webp" alt="Tampilan dashboard ..." loading="lazy" width="1200" height="800">`

> ⚠️ **Penting:** jangan mempublikasikan angka hasil, nama klien, atau testimoni yang tidak benar-benar terjadi. Contoh yang disediakan sengaja memakai hasil kualitatif. Ganti dengan data nyata (dan izin dari klien) sebelum website dipromosikan.

### 5. Layanan dan prefill form

Tombol "Diskusikan" pada card layanan otomatis memilih jenis project di form kontak. Hubungannya diatur lewat atribut `data-service="..."` di card, yang nilainya harus sama persis dengan salah satu `<option value="...">` di select **Project Type**. Jika menambah/mengganti layanan, ubah keduanya.

### 6. Animasi hero

Panel hero menampilkan 4 tahap (Mentah → Terstruktur → Informasi → Keputusan) dan berpindah otomatis. Durasi per tahap diatur di `style.css` pada aturan `.window__progress.is-running span` (default `4.6s`); tahap berikutnya dimulai saat animasi progress bar selesai. Autoplay otomatis berhenti saat kursor/fokus berada di panel, saat panel tidak terlihat, saat tab browser tidak aktif, dan dinonaktifkan untuk pengguna yang mengaktifkan *reduce motion*.

---

## Perilaku form kontak

Versi pertama ini **tidak memiliki backend**, jadi form **tidak menyimpan atau mengirim data ke server**. Ini sengaja, supaya jujur kepada pengunjung.

Yang terjadi saat form dipakai:

- **Send Inquiry** → validasi field, lalu membuka aplikasi email pengunjung dengan subjek dan isi pesan yang sudah terisi (`mailto:`).
- **Kirim lewat WhatsApp** → membuka WhatsApp (`wa.me`) dengan pesan yang sudah terisi.

Tujuan email dan nomor WhatsApp diatur di atribut form:

```html
<form ... data-email="hello@yourbrand.com" data-whatsapp="6280000000000">
```

### Menghubungkan ke backend (nanti)

**Opsi A — layanan form (paling mudah, tanpa server):** Formspree, Web3Forms, atau Basin. Ubah form menjadi `action="https://formspree.io/f/xxxx" method="POST"`, lalu sesuaikan handler submit di `script.js` agar mengirim dengan `fetch()` dan menampilkan status sukses/gagal.

**Opsi B — Cloudflare Pages Functions + D1 (tetap di ekosistem Cloudflare):**

1. Buat folder `functions/api/contact.js` di root project.
2. Buat database D1 di dashboard Cloudflare, lalu *bind* ke project Pages (Settings → Functions → D1 bindings).
3. Tambahkan **Cloudflare Turnstile** untuk mencegah spam.
4. Kirim notifikasi email (misalnya via layanan email transaksional) setiap ada inquiry baru.

Contoh kerangka function:

```js
// functions/api/contact.js
export async function onRequestPost({ request, env }) {
  const data = await request.formData();
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const type = String(data.get('type') || '').trim();
  const message = String(data.get('message') || '').trim();

  if (!name || !email || !message) {
    return Response.json({ ok: false, error: 'Data belum lengkap' }, { status: 400 });
  }

  await env.DB.prepare(
    'INSERT INTO inquiries (name, email, type, message, created_at) VALUES (?, ?, ?, ?, datetime("now"))'
  ).bind(name, email, type, message).run();

  return Response.json({ ok: true });
}
```

Karena Pages Functions dideteksi otomatis dari folder `functions/`, Anda tetap **tidak perlu build command**.

---

## Deployment ke Cloudflare Pages

Website ini statis dan tidak butuh build step, jadi konfigurasinya paling sederhana.

### Langkah 1 — Siapkan project

Pastikan semua file (termasuk `_headers`, `robots.txt`, `sitemap.xml`, dan folder `assets/`) berada di satu folder dengan `index.html` di root-nya.

### Langkah 2 — Buat repository GitHub

1. Login ke [github.com](https://github.com), klik **New repository**.
2. Isi nama, misalnya `yourbrand-website`. Pilih **Public** atau **Private** (keduanya bisa dipakai Cloudflare Pages).
3. Jangan centang "Add a README" (kita sudah punya), lalu klik **Create repository**.

### Langkah 3 — Upload kode

**Lewat Git (disarankan):**

```bash
cd folder-project
git init
git add .
git commit -m "Initial website"
git branch -M main
git remote add origin https://github.com/USERNAME/yourbrand-website.git
git push -u origin main
```

**Tanpa Git:** di halaman repository kosong, klik **uploading an existing file**, seret semua file & folder, lalu **Commit changes**.

### Langkah 4 — Hubungkan GitHub ke Cloudflare Pages

1. Login ke [dash.cloudflare.com](https://dash.cloudflare.com) (daftar gratis jika belum punya akun).
2. Buka **Workers & Pages** → **Create** → tab **Pages** → **Connect to Git**.
3. Otorisasi akun GitHub, pilih repository `yourbrand-website`, lalu klik **Begin setup**.

> Nama menu di dashboard Cloudflare kadang berubah. Jika tampilannya berbeda, cari opsi untuk membuat project **Pages** yang terhubung ke Git.

### Langkah 5 — Build settings

| Pengaturan | Nilai |
|---|---|
| Production branch | `main` |
| Framework preset | **None** |
| Build command | *(kosongkan)* |
| Build output directory | `/` |
| Root directory | *(kosongkan / default)* |
| Environment variables | tidak diperlukan |

Klik **Save and Deploy**. Proses biasanya selesai dalam hitungan detik.

### Langkah 6 — Domain `*.pages.dev`

Setelah deploy berhasil, Cloudflare memberi URL seperti `https://yourbrand-website.pages.dev`. Nama subdomain mengikuti nama project. Jika nama sudah dipakai, Cloudflare menambahkan akhiran acak — pilih nama project yang unik jika ingin URL yang rapi.

Setelah URL final diketahui, **ganti `liliaaan.pages.dev`** di `index.html`, `robots.txt`, dan `sitemap.xml`, lalu push ulang.

### Langkah 7 — Custom domain

1. Buka project Pages → tab **Custom domains** → **Set up a custom domain**.
2. Masukkan domain, misalnya `yourbrand.com` atau `www.yourbrand.com`.
3. Ikuti instruksi DNS:
   - **Domain sudah dikelola Cloudflare** → record DNS dibuat otomatis.
   - **Domain di registrar lain** → tambahkan record **CNAME** yang ditunjukkan Cloudflare (mengarah ke `yourbrand-website.pages.dev`). Untuk domain utama (apex) tanpa `www`, cara paling mudah adalah memindahkan nameserver domain ke Cloudflare.
4. Tunggu verifikasi DNS dan SSL (biasanya beberapa menit, kadang hingga 24 jam). HTTPS aktif otomatis.
5. Perbarui canonical, OG URL, JSON-LD, `robots.txt`, dan `sitemap.xml` ke domain baru.

### Alternatif — Direct Upload (tanpa GitHub)

Di **Workers & Pages** → **Create** → **Pages** → **Upload assets**, beri nama project lalu seret folder project. Cocok untuk mencoba cepat, tetapi setiap update harus di-upload ulang secara manual.

---

## Update website

Dengan integrasi GitHub, setiap perubahan otomatis ter-deploy:

```bash
git add .
git commit -m "Update portfolio"
git push
```

Cloudflare Pages membangun ulang dalam beberapa detik. Riwayat deployment ada di tab **Deployments**; jika ada yang salah, pilih deployment lama lalu **Rollback**.

Push ke branch selain `main` akan membuat **preview deployment** dengan URL tersendiri — berguna untuk mengecek perubahan sebelum ditayangkan.

Karena `_headers` men-cache folder `/assets/*` selama 7 hari, jika mengganti gambar dengan nama file yang sama, pengunjung lama mungkin masih melihat versi lama. Solusinya: ganti nama file (misalnya `og-image-v2.png`).

---

## Rencana pengembangan

| Phase | Fokus | Implementasi yang disarankan |
|---|---|---|
| **1. Static service website** | Versi saat ini: profil jasa, portfolio, kontak via email/WA | HTML/CSS/JS + Cloudflare Pages |
| **2. Contact form + database** | Inquiry tersimpan, anti-spam, notifikasi | Pages Functions + D1 + Turnstile + email notifikasi |
| **3. Admin dashboard** | Melihat & mengelola inquiry, status lead | Halaman `/admin` dilindungi **Cloudflare Access**, data dari D1 |
| **4. Client/project management** | Data klien, project, milestone, catatan | Tabel `clients`, `projects`, `tasks` di D1; mulai pertimbangkan framework ringan jika UI makin kompleks |
| **5. Quotation system** | Membuat penawaran dari template layanan & harga | Generator quotation + ekspor PDF, penyimpanan file di **R2** |
| **6. Client portal** | Klien login, melihat progres, file, dan invoice | Autentikasi (magic link / OAuth), role klien vs admin |
| **7. Analytics** | Traffic, sumber lead, konversi, performa layanan | Cloudflare Web Analytics (tanpa cookie) + dashboard internal dari data D1 |

Prinsipnya: tambah kompleksitas hanya ketika kebutuhannya sudah nyata. Phase 2 sudah cukup untuk sebagian besar jasa freelance/studio kecil.

---

## Checklist sebelum publish

- [ ] Domain di canonical, OG, JSON-LD, `robots.txt`, `sitemap.xml` sudah benar
- [ ] Portfolio & case study berisi project nyata (tanpa angka/hasil karangan)
- [ ] Form: coba **Send Inquiry** dan **Kirim lewat WhatsApp** dari HP & laptop
- [ ] Cek tampilan di mobile, tablet, desktop, mode terang & gelap
- [ ] Jalankan Lighthouse (Chrome DevTools → Lighthouse) dan perbaiki temuan jika ada
- [ ] Daftarkan domain di Google Search Console dan submit `sitemap.xml`

---

© 2026 Liliaaan Studio. All rights reserved.
