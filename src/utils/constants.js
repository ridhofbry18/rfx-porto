// --- KONFIGURASI ---
export const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
export const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;       // untuk foto
export const CLOUDINARY_PRESET_VIDEO = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_VIDEO; // untuk video

// --- DATA STATIS (FALLBACK) ---
export const defaultSkills = [
  { id: 1, title: "Premiere Pro", level: 90, category: "software" },
  { id: 2, title: "After Effects", level: 75, category: "software" },
  { id: 3, title: "Capcut", level: 95, category: "software" },
  { id: 4, title: "Lightroom", level: 80, category: "software" }
];

export const defaultExperiences = [
  { id: 1, year: "2020", title: "The Beginning", company: "Freelance", description: "Memulai eksplorasi visual dengan fokus pada dokumentasi acara lokal dan short movie indie di Malang.", icon: "Camera" },
  { id: 2, year: "2021-2022", title: "Identity Formation", company: "RFX Visual", description: "Membangun gaya color grading 'moody' yang menjadi ciri khas, serta merambah ke musik video.", icon: "Palette" },
  { id: 3, year: "2023-Now", title: "Visual Artist", company: "RFX Visual", description: "Full-time content creator dan videografer untuk berbagai brand fashion dan FnB.", icon: "Play" }
];

export const kategoriKarya = ["Semua", "Video", "Foto", "Animasi", "Website"];

export const defaultTemplates = [
  {
    id: 1,
    title: "Porto Statis 1",
    description: "Template website portofolio minimalis, modern, dan sangat cepat. Dilengkapi dengan animasi scrolling, halaman galeri responsif, dan personal branding yang kuat. Cocok untuk videografer atau fotografer.",
    price: "Rp 55.000",
    githubUrl: "https://github.com/rfxvsl-lab/portowebsite.git",
    demoUrl: "https://rfxvsl-lab.github.io/portowebsite/",
    image: 'https://placehold.co/600x400/111/222?text=Template+1',
    features: ["Fully Responsive Layout", "Light & Dark Mode Integration", "Modern Slide Animations", "SEO Optimized Structure", "Termasuk Full Custom RFX Visual"]
  },
  {
    id: 2,
    title: "Porto Statis 2",
    description: "Template portfolio dengan aksen visual gelap (dark mode), efek hover kartu premium, dan transisi antar-elemen yang mulus. Cocok untuk desainer grafis dan seniman visual.",
    price: "Rp 55.000",
    githubUrl: "https://github.com/rfxvsl-lab/portoweb2.git",
    demoUrl: "https://rfxvsl-lab.github.io/portoweb2/",
    image: 'https://placehold.co/600x400/111/222?text=Template+2',
    features: ["Aesthetic Dark Interface", "Interactive Card Hover Effects", "Fast Loading Speeds", "Contact Form Included", "Termasuk Full Custom RFX Visual"]
  },
  {
    id: 3,
    title: "Porto Statis 3",
    description: "Template portofolio bergaya grid kreatif dengan filter kategori modern. Cocok untuk memamerkan berbagai jenis karya digital secara komparatif.",
    price: "Rp 55.000",
    githubUrl: "https://github.com/rfxvsl-lab/portoweb3.git",
    demoUrl: "https://rfxvsl-lab.github.io/portoweb3/",
    image: 'https://placehold.co/600x400/111/222?text=Template+3',
    features: ["Creative Grid Layout", "Live Category Filtering", "Highly Customizable Code", "Google Fonts Pre-configured", "Termasuk Full Custom RFX Visual"]
  },
  {
    id: 4,
    title: "Porto Statis 4",
    description: "Desain portofolio premium dengan integrasi animasi linear dan split-screen layout yang unik untuk menonjolkan profil dan karya secara seimbang.",
    price: "Rp 55.000",
    githubUrl: "https://github.com/rfxvsl-lab/portoweb4.git",
    demoUrl: "https://rfxvsl-lab.github.io/portoweb4/",
    image: 'https://placehold.co/600x400/111/222?text=Template+4',
    features: ["Premium Split-Screen UI", "Interactive Scroll Animations", "Clean Codebase Architecture", "Social Links Integration", "Termasuk Full Custom RFX Visual"]
  },
  {
    id: 5,
    title: "Porto Statis 5",
    description: "Template website dengan layout minimalist-card yang modern dan interaktif, dirancang khusus untuk memikat agensi atau klien secara instan.",
    price: "Rp 55.000",
    githubUrl: "https://github.com/rfxvsl-lab/portoweb5.git",
    demoUrl: "https://rfxvsl-lab.github.io/portoweb5/",
    image: 'https://placehold.co/600x400/111/222?text=Template+5',
    features: ["Minimalist-Card Interface", "Smooth Transition Animations", "Optimized Mobile UX", "Easy Customization Guide", "Termasuk Full Custom RFX Visual"]
  },
  {
    id: 6,
    title: "Porto Statis 6",
    description: "Desain portofolio bergaya glassmorphism dengan efek transparansi modern dan gradien warna yang menawan. Cocok untuk visual creator kelas atas.",
    price: "Rp 55.000",
    githubUrl: "https://github.com/rfxvsl-lab/portoweb6.git",
    demoUrl: "https://rfxvsl-lab.github.io/portoweb6/",
    image: 'https://placehold.co/600x400/111/222?text=Template+6',
    features: ["Modern Glassmorphism UI", "Vibrant Accent Gradients", "Comprehensive Profile Section", "Cross-browser Compatible", "Termasuk Full Custom RFX Visual"]
  }
];
