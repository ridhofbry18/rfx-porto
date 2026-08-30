# Hasil Analisa UI/UX — RFX Visual Portfolio (rfx-porto)

> Audit awal sebelum redesign menyeluruh. Metode: *audit-ai-design-slop* (evidence-based, removal-first) + prinsip *web-technique-to-skill* (mekanisme vs staging, angka nyata, quality floor).
> Tanggal audit: 30 Agustus 2026. Basis kode: `D:/rfx-porto` (Next.js 16 + React 19 + Tailwind 3 + framer-motion + Three.js/R3F + Supabase).

---

## Verdict

Situs ini menderita **tumpukan dekorasi dan koreografi scroll yang berlebihan**, bukan kekurangan usaha desain. Hampir setiap halaman menumpuk 3–5 lapis atmosfer (blob blur merah + grid + noise + glow + partikel + tipografi raksasa) yang semuanya mengerjakan pekerjaan yang sama, sehingga hierarki antar-elemen kalah oleh dekorasi. Halaman portofolio inti — alasan utama pengunjung datang — tersembunyi di balik gerbang "Enter to the Room", tutorial suara wajib 17 detik, dan simulasi TV/kamera/macOS yang harus dipecahkan dulu oleh pengunjung awam sebelum melihat satu pun karya. Di mobile, seluruh konsep ini nyaris tidak bisa diakses (WebGL + drag look-around + tombol CH+/CH-), dan tidak ada fallback sama sekali. Ada juga **bug nyata**: 3 kartu artikel di homepage mengarah ke route `/articles/...` yang tidak ada (404), aset `/bg-noise.png` dipakai di 4 halaman tapi filenya tidak ada, tombol WhatsApp kosong (`https://wa.me/`), dan statistik IG hardcode ("237 followers") yang tampil sebagai bukti palsu. Sistem warna sendiri terfragmentasi menjadi **tiga merah berbeda** (#9B2E33, #943838, #D3222A/#E8454D) yang dipakai bergantian tanpa aturan.

**Yang harus dihapus/diperbaiki pertama:** jadikan karya bisa dilihat dalam ≤1 klik dari beranda tanpa gerbang 3D — pindahkan grid karya ke halaman `/portofolio` sebagai halaman biasa, dan jadikan ruang 3D "My Studio" sebagai *bonus experience* opsional (atau dihapus bila mau fokus).

---

## Ruang lingkup pemeriksaan

**Diperiksa (source code, bukan render):**
- Layout & navigasi: `src/app/layout.jsx`, `src/app/(main)/layout.jsx`, `src/components/Navigasi.jsx`, `Footer.jsx`, `HireMe.jsx`, `Layout.jsx`, `AnimatedBackground.jsx`, `TransitionEffect.jsx`, `AnimatedText.jsx`, `ItemKeahlian.jsx`
- Halaman publik: `HomeContent.jsx`, `PortofolioContent.jsx` (+ `ClientWrapper.jsx`), `AboutContent.jsx`, `ArtikelList.jsx`, `ArtikelDetail.jsx` (sebagian), `KontakContent.jsx`
- Data & config: `DataProvider.jsx`, `utils/constants.js`, `utils/helpers.js` (indikasi), `tailwind.config.js`, `globals.css`, `index.css`, `package.json`
- Sekilas: rfx-links (LinksContent, pricelist, templates, orderweb), PanelAdmin, IGLayout, not-found, `public/` (37 MB aset)
- Struktur route Next.js di `src/app/**`

**Tidak dapat diverifikasi dari kode saja** → lihat bagian *Unknowns*.

---

## Temuan (ringkas, dikelompokkan per akar masalah)

| Prio | Kelas | Pola | Bukti | Dampak | Hapus / Perbaiki |
|---|---|---|---|---|---|
| **P0** | Quality defect | Route mati | `HomeContent.jsx:102,121,140` → `router.push('/articles/${slug}')`; route asli `/artikel/[id]` dan datanya pakai `id` bukan `slug` (lihat `ArtikelList.jsx:117`) | Ketiga kartu "Latest Articles" di homepage → 404 | Ganti ke `/artikel/${a.id}` |
| **P0** | Quality defect | Aset hilang | `bg-noise.png` direferensikan di `AboutContent.jsx:321`, `ArtikelList.jsx:152,220,234`, `KontakContent.jsx:409`, `ArtikelDetail.jsx` — **tidak ada di `public/`** | Background noise gagap/blank di 4 halaman; build img request 404 | Hapus referensi atau sediakan file |
| **P0** | Quality defect | Link/CTA mati | `KontakContent.jsx:302` → `link="https://wa.me/"` (tanpa nomor); `Footer.jsx:173` → `mailto:contact@rfxvisual.com` (beda dengan email config `rfxvisual.my.id`); sosial `href="#"` di `HomeContent.jsx:483-488` dan `Footer.jsx:138,147` (Bē, TikTok/Music2, Twitter, LinkIcon) | Calon klien klik CTA utama → sia-sia | Isi nomor WA asli, samakan email, hapus ikon tanpa akun |
| **P1** | Quality defect | Gerbang + tutorial wajib sebelum karya | `PortofolioContent.jsx`: intro "MY STUDIO" → tombol "Enter to the Room" → tutorial suara 6 langkah (0–17.5 dtk) → baru bisa klik TV/kamera/laptop → masih perlu CH+/CH-/PWR untuk ganti kategori | Pengunjung awam butuh 6+ interaksi sebelum melihat 1 karya; bounce rate | Karya langsung tampil (grid biasa); ruang 3D jadi opsional |
| **P1** | Quality defect | Mobile tanpa jalur akses | Portofolio 3D: drag look-around + hitbox kecil + WebGL (`gabungan.glb` 6,4 MB); tidak ada fallback non-WebGL; hero & section sticky pakai `100vh` + `-mt-[100vh]` (rentan address-bar mobile) | Di HP: lambat, membingungkan, konten sulit dijangkau | Route mobile = layout vertikal sederhana; ganti `100vh` → `100dvh`/`svh` |
| **P1** | Slop pattern | Tumpukan dekorasi di SEMUA halaman | `AnimatedBackground.jsx`: 3 blob merah blur 100–140px + grid + noise; tiap halaman menambah lapisan sendiri (radial-gradient, glow `shadow-[0_0_60px_rgba(148,56,56,0.6)]`, `drop-shadow` teks, partikel terbang `HomeContent.jsx:205-208`, kotak berputar 360° `HomeContent.jsx:78-82`) | Konten kalah oleh atmosfer; performa (blur besar + mix-blend-screen di mobile) | Satu sumber atmosfer saja; hapus blob bergerak + partikel + rotasi dekoratif |
| **P1** | Quality defect | Beban aset tidak masuk akal | `public/`: `vhs_noise.mp3` **22,8 MB** (audio statis VHS!), `backsound.mp3` 4 MB, `speechpetunjuk.mp3` 317 KB, 2 whoosh, klik — total `public/` 37 MB; semua `<audio preload="auto">` di `PortofolioContent.jsx:1052-1057` | 22 MB *didownload* hanya untuk suara statis saat buka modal video; jorok di kuota mobile | Kompres ke ≤200 KB (loop pendek) atau hapus; `preload="none"` |
| **P1** | Slop pattern | Bukti palsu | `HomeContent.jsx:261-262,274-286`: follower IG hardcode **"237 followers / 216 following"** di mockup Instagram homepage; fallback "40+ clients / 50+ projects / 4+ years" (`AboutContent.jsx:238-247`) tanpa sumber | Kepercayaan calon klien; klaim tak bisa diverifikasi | Tampilkan angka dari data Supabase atau hapus; ganti stat dengan bukti nyata (jumlah karya di DB) |
| **P2** | Slop pattern | Navbar tanpa karakter + inkonsisten | `Navigasi.jsx`: logo + 4 link uppercase generik (WORK/SERVICES/ARTICLES/CONTACT) dengan underline hover — pola template; label **tidak cocok isi** (`/about` = bio+journey+skills, bukan "SERVICES"); menu mobile full-screen `bg-[#943838]` (merah bata) vs tema halaman `#050505` (hitam) — tumpang tindih warna; campuran bahasa EN/ID | Identitas lemah, mobile menu terasa dari desain lain | Navbar khas (lihat arah redesign); samakan bahasa; menu mobile ikuti sistem warna |
| **P2** | Slop pattern | Tiga merah berbeda tanpa aturan | `tailwind.config.js` `logo-red:#9B2E33` vs hardcoded `#943838` (globals.css `:root`, Footer, Navigasi mobile, HomeContent) vs glow `rgba(232,69,77,…)`/`rgba(211,34,42,…)`/`rgba(148,56,56,…)` | Merk warna tidak konsisten; sulit di-theme ulang | Satu token aksen (+1 varian gelap/terang) dipakai lewat class, bukan hex inline |
| **P2** | Slop pattern | Kartu untuk segala hal | ContactButton, kartu artikel, kartu journey, mockup IG, kartu footer, chat AI — semuanya `rounded-2xl/3xl bg-[#0a0a0a] border-white/10 + glow` | Hierarki rata; tidak ada blok yang terasa "primer" | Kartu hanya untuk grup yang butuh batas; sisanya pakai garis/whitespace |
| **P2** | Slop pattern | Motion theater tanpa `prefers-reduced-motion` | `TransitionEffect` blur overlay tiap pindah halaman; `AnimatedText` stagger per kata; `animate-pulse` (≥10 lokasi); mascot api footer beranimasi terus (`Footer.jsx:14-88`); robot SVG kontak; lingkaran "Hire Me" berputar (`HireMe.jsx` + `spin-slow 8s`) | Mengganggu baca, boros CPU; aksesibilitas | Satu transisi halaman saja; hormati reduced-motion; HireMe digabung ke nav/kontak |
| **P2** | Quality defect | Kapitalisasi & tipografi | Semua uppercase: heading, tombol, label form, nav footer; teks raksasa bertumpuk (`text-[23vw]` hero, `text-[35vw]` footer, `text-[25vw]` "SOCIALS"); `text-justify` (`AboutContent.jsx:30`, `ItemKeahlian` non) | Hierarki type rusak; uppercase panjang sulit dibaca | Uppercase hanya untuk label micro; justify → left; satu "teks raksasa" per halaman |
| **P3** | Slop pattern | Widget berlebih di sudut | `HireMe.jsx`: lingkaran teks berputar + tombol, fixed kanan-bawah, `opacity-40` (di touch tak ada hover → selalu redup), menumpuk dengan footer dock | Clutter permanen di semua halaman | Hapus; CTA kontak cukup di nav + kontak |
| **P3** | Quality defect | Sisa scaffolding & file mati | `src/index.css` (versi Vite, background `#050505` vs `#943838` di globals), `postcss.config.js.bak`, `src/Untitled-1.txt` (draft HTML), `page.jsx.backup`, `src/supabaseClient.js` (pakai `import.meta.env` → mati di Next; yang dipakai `src/lib/supabaseClient.js`), `TampilanFormBooking.jsx`/`TampilanOrderWeb.jsx` di root `src/` (tidak diimpor), `SectionWrapper.jsx` (tidak diimpor), devDeps Vite (vite, plugin-react, pwa) + React 18 types di proyek React 19 | Bingung maintenance; dua "sumber kebenaran" CSS; bundle risk | Hapus arsip; satukan CSS; rapikan package.json |

---

## Rincian per halaman

### 1. Home (`HomeContent.jsx`, 514 baris)
- **Struktur scroll nyaris mustahil dipahami awam**: hero `fixed` + spacer `100vh` + section artikel `400vh` (kartu pinned, fan-out 3 kartu) + section IG `200vh` dengan `-mt-[100vh]` menimpa → total ±900vh scroll sebelum footer. Pengunjung yang hanya scroll sedikit hanya melihat "RIDHO VISUAL" + karakter 3D, tanpa tahu ada karya/artikel/kontak.
- Kartu artikel pinned: container `pointer-events-none`, kartu klik-able — tapi **tujuannya 404** (P0 di atas).
- Mockup Instagram lengkap dengan tombol "Follow" yang tidak melakukan apa-apa dan angka followers hardcode — replikasi UI aplikasi lain di dalam portofolio = template repetition, bukan konten.
- Hero mobile: sosial di-hide, "Just scroll down" di-hide, tersisa teks 23vw + tombol EXPLORE MORE + karakter — tidak ada indikasi ada halaman lain selain scroll.
- Skeleton loading bagus (jarang), tapi karena data dari Supabase client-side, **SEO first paint = skeleton** untuk crawler non-JS.

### 2. Portofolio / "My Studio" (`PortofolioContent.jsx`, 1076 baris)
- Ini konsep paling berat: Three.js + R3F + GLB 6,4 MB + 5 audio + tutorial voiceover. Konsepnya kreatif, tapi **menaruh seluruh isi portofolio di baliknya** adalah keputusan arsitektur informasi yang salah untuk pengunjung awam (sesuai keluhan Anda: "pengunjung awam kebingungan, ga to the point").
- Simulasi dalam simulasi: TV CRT (channel/volume/static) untuk video, viewfinder Sony untuk foto, macOS + AE + Safari untuk animasi/web. Masing-masing punya metafora UI sendiri yang harus dipelajari. Chanel video pakai tombol CH+/CH- — pola interaksi dari 1995 untuk konten 2026.
- Tidak ada daftar karya dalam bentuk apa pun untuk non-WebGL/awam; `prefers-reduced-motion` tidak dihormati; loading state "LOADING 3D ASSETS..." tanpa persentase di dalam canvas.
- Halaman ini sebenarnya bagus sebagai *showpiece* — masalahnya hanya **posisinya sebagai satu-satunya pintu karya**.

### 3. About (`AboutContent.jsx`, 340 baris)
- Seluruh halaman = horizontal-scroll-jacking (200–700vw) berisi 4 layar: Bio → Journey → Skills → Stats/Websites. Teks bio & journey pakai `text-justify` di dalam kartu blur. Di mobile lebar layar 200–250vw di-pin horizontal — pengalaman scroll vertikal yang sebenarnya horizontal, sulit di-skip.
- Angka "scroll-linked lighting" dihitung dari posisi vw manual (`AboutContent.jsx:91-102`) — rapuh terhadap perubahan layout.
- Skills: progress bar % (90% Premiere, 95% Capcut…) — pola slop klasik yang tak berarti bagi klien (apa artinya "75% After Effects"?).
- Stats fallback "40+/50+/4+" tanpa bukti (P1 di atas).

### 4. Artikel (`ArtikelList.jsx`, 264 baris)
- Konsep buku 3D dengan cover kulit + DAFTAR ISI + suara flipping — menarik, tapi: judul halaman "READ OUR **STORIES**" (bahasa Inggris, padahal `lang="id"`), tombol tutup bertuliskan "TUTUP BUKU" (Indonesia) — campur aduk di satu objek.
- Pengunjung harus membuka buku dulu untuk melihat daftar; klik item langsung ke detail (ok). Preview skeleton hanya `xl:` (mayoritas tidak melihat).
- Partikel melayang 30 buah + noise di background — lapisan dekorasi lagi.

### 5. Kontak (`KontakContent.jsx`, 471 baris)
- Dua kolom: form brief bergaya clapperboard (kreatif) + **chat "REXA AI"** (puter.ai + TTS berbahasa Inggris yang menyuarakan balasan). AI chat di halaman kontak = distraksi besar; orang datang untuk menghubungi, bukan ngobrol dengan robot. TTS otomatis juga mengejutkan pengguna.
- WhatsApp button rusak (`https://wa.me/`), email konsisten ke config — tapi footer memakai domain berbeda.
- Label form "PROD. TITLE / DIRECTOR / SCENE DESCRIPTION" — metafora sinematik yang membuat field sulit dipahami klien awam (nama field tidak selaras dengan maksudnya).

### 6. Nav / Footer / Widget global
- Navbar desktop: generik, tanpa karakter, label tidak match isi. Mobile: hamburger → overlay **merah bata solid** penuh layar (satu-satunya tempat warna ini jadi background dominan) — terasa seperti desain berbeda.
- Footer: panggung tersendiri (api mascot beranimasi SVG + karakter 3D + teks 35vw + 2 kartu besar + dock) — hampir 1 viewport penuh untuk informasi yang bisa jadi 3 baris. Email footer salah domain, 2 ikon sosial `#`.
- HireMe floating mengganggu + `opacity-40` di mobile.
- `TransitionEffect` dipasang manual di tiap page component (bukan di layout) — artinya tiap pindah halaman ada overlay blur 1 detik, menambah latensi persepsi untuk nol informasi.

---

## Kondisi "stabilisasi" & technical debt (penyebab layout terasa ruwet)

1. **Dua stylesheet konflik**: `globals.css` (`:root` merah `#943838`) vs `src/index.css` (`#050505`, warisan Vite) — hanya globals yang diimpor, tapi index.css bisa mengaburkan siapa yang berkuasa.
2. **Warna hardcode tersebar**: hitung kasar — `#943838` muncul ±30×, `logo-red` ±40×, glow rgba ±15×. Tidak mungkin re-theme tanpa sentuh 10+ file. (Ini alasan utama ganti warna sekarang terasa mahal.)
3. **Client-side data untuk halaman publik**: semua konten menunggu Supabase; skeleton dihomepage; tanpa SSR/ISR → teks halaman kosong untuk SEO.
4. **Stack campur**: Next 16 + React 19, tapi devDeps Vite 5 + React 18 types + eslint 8; `src/index.css`, `supabaseClient.js` ganda, file `Tampilan*` yatim, `Untitled-1.txt`.
5. **100vh & pinned sections di mobile** tanpa `dvh/svh`, `-mt-[100vh]` untuk overlap, `scale-[0.80]` hack untuk IG grid di mobile (`HomeContent.jsx:223`) — tanda layoutnya "dipaksa muat", bukan didesain untuk mobile.
6. **Aksesibilitas belum tersentuh**: tak ada `prefers-reduced-motion` di seluruh kode, fokus keyboard tidak distyle, hitbox 3D tidak keyboard-reachable, autoplay audio, kontras teks `text-white/50 di atas hitam` di beberapa tempat.

---

## Arah redesign (proposal — menunggu keputusan Anda)

Prinsip: **removal first**, lalu satu ide visual yang kuat, bukan lima. Semua opsi di bawah menjaga identitas "RFX Visual = sinematik" tanpa menumpuk dekorasi.

### A. Struktur informasi (berlaku untuk semua opsi)
1. **Beranda** = 1 viewport penuh: headline + 3–6 karya terbaik langsung terlihat + 1 CTA utama ("Lihat semua karya") + 1 CTA sekunder (Kontak/WA). Tidak ada fixed hero, tidak ada 900vh koreografi.
2. **/portofolio** = grid karya biasa dengan filter kategori (video/foto/animasi/web) + modal pemutar. Ruang 3D "My Studio" tetap ada sebagai **tombol "Masuki Studio 3D"** di halaman ini (pengalaman opt-in), bukan pintu utama.
3. **/about** = vertikal normal (bio → perjalanan → tools tanpa % → kontak). Hapus horizontal jacking.
4. **/artikel** = grid/kartu artikel langsung (buku 3D boleh jadi header dekoratif kecil, bukan gerbang).
5. **/kontak** = form + WA/email/langsung. Rexa AI dipindah jadi fitur terpisah atau dihapus.
6. **Footer** = 3 baris: nav, sosial, copyright. Hapus panggung mascot (mascot bisa jadi 404 page atau easter egg).
7. **Mobile = desain utama, bukan konversi**: nav bawah (bottom bar) atau header ringkas; semua section satu kolom; tanpa pin/jack.

### B. Opsi arah visual (pilih satu; saya terapkan konsisten di semua halaman)

| Opsi | Ide | Palet (baru, kreatif, bukan merah-generik) | Kapan cocok |
|---|---|---|---|
| **1. "Darkroom"** | Bahasa studio analog: hitam pekat + aksen amber safelight (kamar gelap fotografi) + garis frame film | Background `#0A0908`, teks `#F2EFE9`, aksen `#FFB020` (amber), sekunder `#8C8478`; tipografi: Outfit tetap untuk display, tapi tanpa all-caps semua | Konsep paling pas dengan fotografer/videografer; tegas, mudah dieksekusi |
| **2. "Signal"** | Influensi broadcast/editorial video: off-white terang + satu aksen merah brand DIPERTAHANKAN (dari logo) + blok warna datar, tanpa glow/blur sama sekali | Background `#F4F1EA`, teks `#141210`, aksen `#9B2E33` (logo), aksen gelap `#1E1B18` | Kalau mau keluar dari "dark portfolio" yang pasaran; sangat to-the-point |
| **3. "Night Studio"** | Pertahankan dark mode, tapi sistem: charcoal hangat + aksen tunggal + grain halus SATU lapis | Background `#111110`, permukaan `#1A1918`, teks `#EDEBE6`, aksen `#E8B14A` atau `#7FB069`; semua glow dihapus, kontras dijaga | Perubahan paling kecil dari sekarang, hasil paling "bersih" |

Rekomendasi saya: **Opsi 1 (Darkroom)** — identitas paling khas untuk visual artist, memberi navbar/footer/nuansa karakter sendiri (frame film, kode reel, timecode sebagai detail mikro), dan paletnya benar-benar baru dibanding sekarang.

### C. Karakter navbar (jawaban atas keluhan "navbar tidak punya karakter, apalagi mobile")
- Desktop: bar ramping dengan **timecode/film-strip motif** — logo RFX + link yang aktif ditandai frame merah/amber + indikator REC kecil di halaman portofolio; bukan underline generik.
- Mobile: **bottom navigation bar** (4 item + ikon) — selalu terlihat, jempol-friendly, jauh lebih berkarakter daripada hamburger; hamburger hanya jika halaman butuh menu lebih dalam.
- Semua label satu bahasa (disarankan Indonesia: Karya, Tentang, Tulisan, Kontak) atau Inggris penuh — konsisten.

### D. Teknik web yang layak diangkat jadi "mekanisme" (sesuai web-technique-to-skill)
Bukan menumpuk efek, tapi 1–2 teknik dengan mekanisme jelas:
- **Film-grain + safelight flicker** (Canvas 2D, clamp dt, pause saat tab hidden, reduced-motion = still frame) sebagai satu-satunya atmosfer.
- **Timecode scrubber** pada modal video (progress bar bergaya timecode) — fungsional + tematik.
- Hover kartu karya: *clip-path reveal* dengan easing nyata (0.3–0.4s) — bukan glow.

---

## Langkah lanjut yang saya usulkan (setelah file ini disetujui)

1. **Fase 0 — stabilisasi**: perbaiki P0 (route, bg-noise, link mati), hapus file mati/duplikat, rapikan token warna jadi satu sumber, kompres/hapus audio 22 MB.
2. **Fase 1 — re-struktur**: pindahkan karya ke depan (beranda + /portofolio biasa), 3D jadi opsional, footer/nav baru (termasuk bottom-nav mobile).
3. **Fase 2 — skin**: terapkan palet baru + tipografi baru di semua halaman dari satu sumber token.
4. **Fase 3 — polish & uji**: mobile 390px, keyboard, reduced-motion, console bersih, Lighthouse.

---

## Unknowns (tidak bisa dipastikan dari kode saja)

- **Rendering aktual di browser** (audit ini berbasis source code; belum dijalankan/dev-server) — hasil render bisa menyimpan temuan tambahan (clipping, overlap nyata, kontras).
- **Data Supabase produksi**: isi `site_config`, jumlah karya, apakah artikel punya kolom `slug` (kalau ada, perbaikan route tinggal ganti prefix; kalau tidak, pakai `id`).
- **Perilaku `puter.ai`** (REXA AI) pada produksi — script dimuat lazy; keberhasilan chat/TTS tidak terverifikasi.
- **Apakah `pakasir`, jspdf, html2canvas, qrcode** benar-benar dipakai alur publik (rfx-links) atau bisa dicabut dari bundle utama.
- **Target audiens utama Anda** (klien brand lokal vs agensi vs komunitas) — menentukan pilihan bahasa dan intensitas "playfulness".
