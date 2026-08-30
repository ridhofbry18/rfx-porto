# Perencanaan Redesign RFX Visual — "Editorial Studio"

> Landasan: `hasilnanalisa.md` (audit slop) + keputusan kamu di percakapan.
> Arah dalam satu kalimat: **portofolio editorial monokrom yang menceritakan dan membuktikan karya visual — fotografi, videografi, seni visual — dengan warna hanya datang dari karyanya sendiri.**

> **Revisi (30 Agu 2026, putaran 2):** aksen merah **dibuang total** (tidak cocok, terkesan norak) → sistem **monokrom** (kertas + tinta, plus grayscale); warna hidup hanya dari foto/video karya. Dilarang ada sub-head "bubble + pulse" gaya `● OPEN TO WORK` dan copy bergaya template. Cerita utama = **visual arts / fotografi / videografi**; web/UI-UX designer **bukan** prioritas narasi. Logo dibuat ulang (typografi, monokrom) di `src/components/logo/`. Ditambah ke scope global: halaman **/link** ala lynk.id dan **panel admin** (tampilan, layout HP, live preview).

---

## 0. Logo Baru (sudah dibuat)

Dua komponen React, **monokrom `currentColor`** (ikut tema putih↔hitam otomatis, nol hex hardcode, nol merah):

- **`src/components/logo/wordmark.tsx`** — lockup "RFX / VISUAL". Idenya: ketegangan tipografi antara **RFX** (display condensed, berat, tracking rapat) dan **VISUAL** (mono, uppercase, tracking 0.42em, lapang), dipisah garis hairline. Props: `size`, `variant` (`lockup`/`stack`), `bare`. Dipakai di navbar & footer.
- **`src/components/logo/logo.tsx`** — monogram "RFX" dibingkai **crop-mark** (tanda potong 4 sudut) — motif kropping/framing fotografer, bukan ikon kamera klise. Props: `size`, `frame`. Dipakai favicon, nav mobile, avatar.

Keduanya `.tsx` → `tsconfig.json` ditambahkan (allowJs, strict off, alias `@/*`), `typescript` masuk devDeps. Font mengacu `var(--font-display)`/`var(--font-mono)` dengan fallback aman sebelum Fase 0 selesai.

---

## 1. Arah Desain ("Editorial Studio", monokrom)

Referensi struktur: screenshot Wall of Portfolios (kertas terang, label mono uppercase tracking lebar, chip outline, potret grayscale + doodle tangan, display condensed tebal, garis pemisah tegas). **Tanpa** meniru aksen biru/merahnya — kita monokrom.

| Prinsip | Artinya di kode |
|---|---|
| Monokrom, warna dari karya | Palet hanya kertas/tinta/abu. Foto & video karya jadi satu-satunya sumber warna |
| Kertas & tinta, bukan glow | Tanpa blob, glow, glass, partikel. Kedalaman dari garis 1–1.5px + whitespace |
| Tanpa gimmick "status" | **Tidak ada** bubble "OPEN TO WORK" + dot pulse. Ketersediaan (bila perlu) ditulis sebagai baris teks biasa yang wajar, bukan badge berdenyut |
| Copy manusiawi | Hapus frasa template ("Let's Create", "mahakarya sinematik", "Menangkap Momen Menciptakan Mahakarya"). Bahasa lugas, personal, seperti Ridho bicara |
| Mono untuk metadata | Label, nav, chip, tanggal, indeks → mono uppercase tracking lebar |
| Display condensed untuk nama besar | Nama/kota/judul → display berat |
| Mobile = desain utama | Satu kolom dulu, baru diperluas |


---

## 2. Token Warna Baru — Monokrom (tanpa merah)

Warna hidup **hanya datang dari foto/video karya**. UI-nya netral supaya karya yang bicara. Tidak ada aksen merah, tidak ada aksen warna apa pun — "aksen" diganti oleh **kontras tinta** dan **inversi** (tinta↔kertas).

```css
[data-theme="light"] {
  --paper:      #F5F3EE;  /* kertas hangat — hero, artikel, kontak */
  --paper-2:    #EBE8E1;  /* permukaan chip/kartu halus */
  --ink:        #14120F;  /* teks & garis utama (hampir hitam, hangat) */
  --muted:      #78726A;  /* teks sekunder */
  --line:       rgba(20,18,15,.16);
  --accent:     #14120F;  /* "aksen" = tinta itu sendiri (inversi), bukan warna */
  --accent-ink: #F5F3EE;
}
[data-theme="dark"] {
  --paper:      #100F0D;  /* section gelap (karya, myroom) */
  --paper-2:    #1A1815;
  --ink:        #F1EEE7;
  --muted:      #928C83;
  --line:       rgba(241,238,231,.18);
  --accent:     #F1EEE7;
  --accent-ink: #100F0D;
}
```

- Semua komponen **hanya boleh pakai variabel ini** — dilarang hardcode hex/merah (akar masalah "tiga merah" + keluhan "aksen norak").
- Penanda "aktif"/hover memakai **inversi** (bg tinta, teks kertas) atau underline tegas — bukan warna.
- Foto/video karya tampil grayscale saat diam, **warna penuh saat hover/aktif** — ini satu-satunya "warna" di situs, dan itu milik karyanya.
- Tailwind mapping: `bg-paper`, `text-ink`, `text-muted`, `border-line`, `bg-accent`, `text-accent-ink` → menunjuk CSS var.

---

## 3. Font Self-Hosted (tanpa CDN runtime)

Kriteria: gratis (OFL), punya karakter desainer, cocok arah editorial, file kecil. Dipilih 3 keluarga, cukup untuk seluruh situs:

| Peran | Font | Alasan | File (woff2, di-commit ke repo) |
|---|---|---|---|
| Display | **Anton** (400) | Condensed tebal, mirip "VANCOUVER" di screenshot; 1 weight, ~15 KB | `anton-latin.woff2` |
| Body + UI | **Space Grotesk** (variable, 300–700) | Grotesk berkarakter, bukan Inter pasaran; nyaman dibaca panjang | `spacegrotesk-latin-var.woff2` |
| Mono (label/nav/chip/meta) | **Space Mono** (400, 700) | Mono dengan personality; sepasang alami Space Grotesk; mirip label screenshot | `spacemono-latin-400.woff2`, `-700.woff2` |

Cara hosting: file woff2 ditaruh di `src/fonts/`, dimuat lewat **`next/font/local`** (self-host murni, zero runtime CDN, `display: swap`, subset latin). Sumber unduhan: repo resmi `google/fonts` (OFL) / paket `@fontsource-*` untuk woff2 siap pakai — keduanya legal untuk komersial. Font lama (Inter/Outfit via next/font google) dicabut dari `app/layout.jsx`.

Skala type: label mono 11–12px / tracking 0.18em · body 16–18px · h2 display 32–56px (Anton) · nama hero 72–160px (Anton, clamp).

---

## 4. Pengalaman Background Scroll (putih → hitam → putih)

Ini "variasi overlapping section background" yang kamu minta, dibuat sebagai mekanisme tunggal:

- **`ThemeScroller`** (komponen client, dipasang di layout utama):
  - Setiap `<section>` menyatakan `data-theme="light|dark"`.
  - Scroll listener passive (rAF-throttled) mendeteksi section yang melewati tengah viewport → set `data-page-theme` di wrapper → CSS variables berpindah dengan `transition: background-color .6s, color .6s` (ease).
  - Batas antar tema diberi **overlap membulat** (`rounded-t-[2.5rem]`, section berikutnya menimpa −2rem) supaya pergantian warna terasa seperti lembaran yang ditumpuk, bukan potongan keras.
  - Semua teks/garis otomatis ikut karena komponen memakai `var(--ink)`, `var(--line)`, dst.
  - `prefers-reduced-motion` → transisi dimatikan (pindah instan), tema tetap jalan.
- Peta tema homepage: **Hero (kertas) → Karya Pilihan (gelap) → Cerita (kertas) → footer (kertas)**. Halaman `/works` gelap menyeluruh (ruang tayang), `/artikel`, `/about`, `/kontak` kertas menyeluruh, `/myroom` hitam (sudah demikian).

---

## 5. Struktur Route & Navigasi Baru

| Route | Isi | Perubahan |
|---|---|---|
| `/` | Hero baru (spesifikasi §6) + Karya Pilihan + Cerita Terbaru + CTA kontak | Ditulis ulang |
| `/works` | Halaman karya: penyampaian & penjelasan karya (§7) | Baru (pengganti `/portofolio`) |
| `/myroom` | Ruang 3D yang sekarang ada di `/portofolio` — dipindah utuh, opsional | Pindahan; nav baru sesuai request |
| `/artikel` + `/artikel/[id]` | Cerita/artikel, jadi fokus (§8) | Restyle |
| `/about` | Bio, perjalanan, tools — vertikal, tanpa scroll-jacking | Restyle |
| `/kontak` | Kontak langsung + form singkat; Rexa AI dipindah keluar | Restyle |
| `/portofolio` | → redirect permanen ke `/works` (next.config `redirects`, aman SEO) | Baru |

**Nav** (desktop & mobile, gaya screenshot): **`<Wordmark />`** kiri (teks, bukan png hitam) + link mono uppercase: `HOME · WORK · STORIES · ABOUT · CONTACT · MY ROOM`. Aktif = underline/inversi tinta (bukan merah). Mobile: nav satu baris scroll-horizontal (tanpa hamburger overlay merah). Garis horizontal tegas 2px di bawah header. Favicon/nav-collapsed pakai **`<Logo />`** (monogram crop-mark).

Komponen global yang dihapus: `HireMe` (widget sudut), `TransitionEffect` (overlay blur tiap pindah halaman), `AnimatedBackground` (blob merah), mascot api footer. Footer baru = 3 baris: wordmark, nav + sosial asli, copyright — bukan panggung.

---

## 6. Hero Section (dari screenshot, tanpa gimmick)

Struktur atas→bawah (data dari Supabase `site_config`, fallback statis). **Semua doodle & teks monokrom (tinta di atas kertas).**

1. **Header**: `<Wordmark />` kiri, nav kanan (§5), garis 2px `--ink` di bawahnya.
2. **Baris label**: `SKILL STACK` (kiri) & `TOOLS & CRAFT` (kanan) — mono kecil tracking lebar. Isi diarahkan ke **visual arts / foto / video** (mis. Sinematografi, Color Grading, Fotografi, Editing, Motion) — **bukan** stack developer.
3. **Chips**: kotak outline 1.5px `--ink`, mono uppercase; hover = inversi. Dari tabel `skills`.
4. **Potret**: foto grayscale (`grayscale(1) contrast(1.05)`). Overlay **doodle SVG tinta** (stroke `--ink`, sedikit goyang tangan): kamera video di tripod, laptop kecil, dan satu coretan bebas — **tanpa** speech-bubble "Hai, there…" (itu persis gimmick yang kamu tolak). Doodle jadi tekstur personal, bukan basa-basi.
5. **Blok bawah** (pengganti badge berdenyut): **tanpa** `● OPEN TO WORK` + pulse. Sebagai gantinya, satu baris naratif jujur, mis. — `Ridho Febriyansyah — bikin foto & video di Malang sejak 2020.` lalu nama besar **MALANG** (display, clamp 72–160px) dan `JAWA TIMUR` mono muted. Kalau memang mau menandai "menerima proyek", tulis sebagai kalimat wajar di dekat CTA kontak, bukan lencana.
6. **CTA**: dua tautan teks bergaris-bawah (bukan tombol norak): `Lihat karya →` dan `Hubungi →`.
7. Interaksi hero tipis: reveal teks sekali saat load (fade-up 0.5s). Tanpa parallax fixed, tanpa teks raksasa ganda, tanpa pulse.

Mobile: urutan sama satu kolom; chips wrap; potret full-width; nama kota tetap besar.

**Copy yang dilarang** (contoh dari kode lama, jangan diulang): "LET'S CREATE", "mahakarya sinematik", "Menangkap Momen, Menciptakan Mahakarya", "Welcome To My Portfolio", "Explore More". Ganti dengan kalimat spesifik & personal.

---

## 7. Halaman `/works` — "menampilkan & menjelaskan"

- Tema gelap menyeluruh (ruang tayang), tanpa gerbang — karya langsung terlihat.
- **Filter chip** mono, urutan sesuai prioritas cerita: **Semua · Foto · Video · Animasi · Web** (Web paling akhir — bukan fokus narasi). Dari `subcategories` Supabase.
- **Daftar karya** gaya indeks editorial: baris besar dengan nomor indeks mono (`01`, `02`…, tinta bukan merah), thumbnail 16:9 grayscale→warna saat hover, judul display, meta mono (tahun · kategori · klien), dan **deskripsi 1–3 kalimat** (field `description` — bagian "menjelaskan", bukan sekadar grid).
- Klik baris → **panel detail/modal** dalam halaman: pemutar video (iframe YouTube, reuse `VideoModal`) untuk video/animasi, lightbox untuk foto (album per subkategori), link kunjungan untuk web. Tanpa simulasi TV/macOS di jalur utama.
- **CTA "Masuk ke My Room"** di akhir halaman: satu baris mono + panah, menuju `/myroom` (pengalaman opsional).
- Semua data tetap dari Supabase; kalau DB kosong → empty state jujur satu baris.

---

## 8. `/myroom` — ruang 3D dipindah, bukan dihapus

- Pindahkan `PortofolioContent.jsx` + `ClientWrapper.jsx` ke `src/app/(main)/myroom/`. Title/copy: "My Room — Ruang Pamer 3D (Opsional)".
- Perubahan kecil saat pemindahan: `preload="none"` untuk semua `<audio>` (vhs_noise 22 MB tidak lagi terunduh di halaman lain), tombol "Skip Tutorial" tetap, label tetap.
- Dari nav: item `MY ROOM`; dari `/works`: CTA di akhir halaman. Tidak ada halaman lain yang memuat Three.js (hanya route ini, via dynamic import `ssr:false` — pola sudah ada).

---

## 9. Cerita/Artikel & halaman lain (fokus baru)

- **Homepage** punya blok "Cerita Terbaru" (3 tulisan: gambar grayscale, judul, ringkasan 2 baris, tanggal mono) — artikel jadi wajib di beranda, sesuai "fokus ke artikel & cerita".
- **`/artikel`**: daftar editorial di kertas — bukan buku 3D sebagai gerbang. Item: nomor, judul display, excerpt, tanggal + estimasi baca. Buku 3D boleh tinggal sebagai ilustrasi header kecil (dekoratif, non-blocking) atau dihapus.
- **`/artikel/[id]`**: kolom baca 60–68ch, judul Anton, meta mono, gambar full di atas — pengalaman baca yang tenang (maksud "cerita").
- **`/about`**: vertikal — bio (dari `homeDescription`), garis waktu perjalanan (3 titik, sederhana, tanpa glow berjalan), keahlian sebagai chip (tanpa persentase). **Narasi berpusat pada perjalanan visual arts / foto / video** (bukan "web developer"); web/UI-UX cukup disebut sebagai layanan tambahan, tidak jadi tulang cerita. Tutup dengan CTA kontak.
- **`/kontak`**: dua kolom — kiri kontak langsung (WA dengan nomor asli dari config, email, IG), kanan form singkat **dengan label bahasa manusia** (Nama, Kontak, Judul Proyek, Ceritakan kebutuhanmu) — metafora clapperboard dihapus. Rexa AI dihapus dari halaman ini (bisa dijadikan halaman eksperimen terpisah nanti).

---

## 9b. Halaman link-in-bio ala lynk.id (perombakan tampilan saja)

> **Routing TIDAK diubah.** Subdomain `link.rfxvisual.my.id` → rewrite ke `/rfx-links` (di `src/middleware.js`) **sudah benar dan dipertahankan**. Yang dirombak murni tampilan `src/app/rfx-links/LinksContent.jsx` (file inilah yang kamu maksud dengan "/links" — sekadar penunjuk lokasi direktori). Tidak ada perubahan route, matcher, atau subdomain.

Sekarang `LinksContent.jsx` = satu kartu raksasa berisi profil + tombol warna-warni (hijau/biru/merah) + grid template → monoton, warna acak, tidak seperti link-in-bio modern. Target: **serupa lynk.id** — bersih, vertikal, kartu tombol seragam, fokus tap.

- **Rewrite** jadi kolom tunggal terpusat (max ~480px), latar kertas/tinta (ikut token monokrom, `isDark` tetap didukung via `toggleTheme`).
- **Header profil**: avatar bulat (`aboutImage`), nama (`<Wordmark size sedang>` atau nama), satu baris bio jujur (bukan "estetika digital & solusi kreatif" yang template), lalu deret ikon sosial kecil.
- **Tombol link seragam**: kartu penuh-lebar tinggi sama, border `--line`, hover = inversi/geser halus, ikon kiri + label + panah kanan. Semua warna dibuang → seragam monokrom, yang membedakan cuma ikon + label. Isi: Karya (→ portofolio utama), Katalog Template, Web Services, Pricelist Foto, Instagram, YouTube, WhatsApp.
- **Thumbnail preview** opsional per link (gaya lynk.id "link with image") untuk item unggulan (mis. template terbaru) — 1 baris kecil, bukan grid 4 kolom.
- Animasi masuk: stagger fade-up tipis (bukan crossfade blur 3 detik yang sekarang).
- Perbaikan data: email `email@rfx.web.id` → email config yang benar; WA sudah betul (`6285731021469`).
- Motif teknik (web-technique-to-skill): satu mekanisme jelas = **daftar tombol seragam dengan hover-invert**; tidak menumpuk efek.

## 9c. Panel Admin — tampilan, layout HP, live preview

Sekarang `PanelAdmin.jsx` (767 baris) + `AdminContent.jsx` fungsional tapi padat, kurang nyaman di HP, tanpa pratinjau hasil. Perbaikan (tanpa mengubah logika Supabase/upload yang sudah jalan):

- **Skin** ke token monokrom + font baru; input, tab, tombol distyle konsisten (fokus terlihat).
- **Layout mobile**: tab jadi bar scroll-horizontal atau drawer; daftar item jadi kartu satu kolom; form pakai pola "sheet" (tombol `+ Tambah` membuka panel geser), memanfaatkan `isFormBuka` yang sudah ada.
- **Live preview**: panel kanan (desktop) / tab "Preview" (HP) yang merender komponen tampilan nyata dari `itemBaru`/`configSitus`/`artikelBaru` **secara langsung saat mengetik** — mis. kartu karya, baris hero, atau artikel — reuse komponen publik supaya WYSIWYG. Untuk web/pricelist gunakan komponen preview yang sudah ada (`TampilanOrderWeb`, `IGLayout`) dirapikan.
- Sisanya (login, CRUD, PDF-extract Rexa) dipertahankan; hanya presentasi & responsivitas yang diangkat.

---

## 10. Perbaikan dari Audit (digabung ke pekerjaan)

- P0: route artikel `/articles/…` → `/artikel/[id]`; hapus semua referensi `bg-noise.png`; isi nomor WA & email konsisten; ikon sosial tanpa akun dihapus; statistik palsu (237 followers, 40+ clients) dihapus — angka yang tampil hanya yang datang dari DB.
- Hapus file mati: `src/index.css`, `src/supabaseClient.js` (versi Vite), `TampilanFormBooking.jsx`/`TampilanOrderWeb.jsx` (root src), `SectionWrapper.jsx`, `Untitled-1.txt`, `*.bak`, `page.jsx.backup`; bersihkan devDeps Vite di `package.json`.
- Audio 22 MB: `preload="none"` sekarang; kompresi opsional jika tool tersedia.
- Aksesibilitas dasar: `prefers-reduced-motion`, focus-visible terlihat, kontras teks muted ≥ 4.5:1 pada kertas.

---

## 11. Fase Implementasi & Urutan Kerja

| Fase | Isi | Hasil yang bisa dicek |
|---|---|---|
| **0 — Fondasi** | Token warna (§2) + font self-host (§3) + hapus file mati + perbaikan P0 + cleanup `package.json` | Situs masih bentuk lama tapi sudah satu sumber warna/font, tidak ada 404 |
| **1 — Shell global** | ThemeScroller (§4), Navbar & Footer baru, hapus HireMe/Transition/blob | Nav berkarakter, background sudah bisa putih→hitam→putih |
| **2 — Hero & Homepage** | Hero sesuai screenshot (§6) + Karya Pilihan + Cerita Terbaru | Beranda langsung to-the-point |
| **3 — Works & MyRoom** | Halaman `/works` (§7), redirect `/portofolio`, pindah ruang 3D ke `/myroom` (§8) | Karya tampil & terjelaskan ≤1 klik dari beranda |
| **4 — Halaman sisanya** | `/artikel` + detail, `/about`, `/kontak` (§9) | Seluruh map selesai |
| **5 — QA & polish** | Uji 390/768/1440, keyboard, reduced-motion, console bersih, Lighthouse ringan, screenshot pembanding | Siap tayang |

Setiap fase selesai → dijalankan `npm run dev` + dicek visual di 1440 & 390 sebelum lanjut.

---

## 12. Keputusan & Aset yang Saya Butuhkan (kerjakan dengan default dulu, tidak menghalangi)

1. **Bahasa label UI**: default mengikuti screenshot — **Inggris mono uppercase** (HOME/WORK/STORIES/ABOUT/CONTACT/MY ROOM), isi artikel tetap Indonesia. Bilang kalau mau full Indonesia.
2. **Foto potret grayscale** untuk hero: sementara pakai `aboutImage`/`heroImage` yang ada di DB; kalau punya foto potret bagus (salah pose kamera di tangan seperti doodle), kirim nanti — tinggal ganti config.
3. **Nomor WA & akun sosial resmi** (Bē/TikTok ada atau tidak) — default: hanya IG, LinkedIn, YouTube, WA `6285731021469` (nomor yang sudah ada di HireMe).
4. **Rexa AI**: default dihapus dari /kontak. Kalau mau diselamatkan, jadi `/lab/rexa` nanti.
5. **Chips skill**: default pakai tabel `skills` sekarang + pemetaan fallback; penambahan kolom `category` di Supabase opsional (SQL saya siapkan kalau mau rapi).

---

## 13. Risiko & Mitigasi

- **Data Supabase client-side** (SEO): di redesign ini konten publik tetap dari Supabase, tapi fallback statis membuat first paint tidak kosong. SSR/ISR menyusul sebagai fase terpisah kalau mau (tidak digabung supaya risiko kecil).
- **Pemindahan halaman 3D**: hanya pindah route; tidak refactor WebGL — risiko rendah.
- **Font variable Space Grotesk + next/font/local**: perlu deklarasi weight range yang benar; diuji di Fase 0.
- **Redirect `/portofolio`**: dipasang di `next.config.mjs` (301) + update `sitemap.js` agar SEO tidak jatuh.
