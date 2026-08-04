export const getYoutubeId = (url) => {
  if (!url) return null;
  const trimmed = String(url).trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/|youtube\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
};

export const convertImageLink = (url) => {
  if (!url) return url;

  // 1. Cek Google Drive
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }

  // 2. Cek YouTube (Auto-Thumbnail)
  const ytId = getYoutubeId(url);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
  }

  return url;
};

export const convertToCustomYoutube = (url) => {
  if (!url) return '';
  const id = getYoutubeId(url);
  return id ? `https://youtube/${id}` : String(url).trim();
};

export const convertGDriveToPreview = (url) => {
  if (!url) return url;
  const trimmed = String(url).trim();
  // match /d/FILE_ID/ style
  const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) return `https://drive.google.com/file/d/${match[1]}/preview`;
  // match open?id=FILE_ID
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  // if already preview or direct, return as-is
  if (trimmed.includes('drive.google.com') && trimmed.includes('/preview')) return trimmed;
  return trimmed;
};

// --- FUNGSI PUTER AI ---
export const generatePuterContent = async (prompt) => {
  try {
    const response = await window.puter.ai.chat(prompt, { model: 'gpt-4o-mini' });
    return response?.message?.content?.[0]?.text
      || response?.toString()
      || 'Maaf, Rexa lagi bingung mau jawab apa.';
  } catch (error) {
    console.error('Puter AI Error:', error);
    return 'Gagal menghubungi Rexa. Cek koneksi kamu ya.';
  }
};


const toPlainText = (value) => {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.map(toPlainText).filter(Boolean).join(' ');
  if (typeof value === 'object') return value.name || value.title || value.label || value.text || value.description || JSON.stringify(value);
  return String(value).trim();
};

const flattenArray = (value) => value.reduce((acc, item) => {
  if (Array.isArray(item)) return acc.concat(flattenArray(item));
  if (item !== null && item !== undefined && item !== '') acc.push(item);
  return acc;
}, []);

const parseJsonArrayField = (value) => {
  if (Array.isArray(value)) return flattenArray(value);
  if (typeof value !== 'string') return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? flattenArray(parsed) : [];
  } catch {
    return trimmed
      .split(/\r?\n/)
      .map(item => item.replace(/^[-*•\d.)\s]+/, '').trim())
      .filter(Boolean);
  }
};

const normalizePackage = (pkg = {}, index = 0) => {
  if (typeof pkg === 'string') {
    return { name: pkg, price: '', features: [], note: '', isBestValue: false };
  }

  const features = parseJsonArrayField(
    pkg.features || pkg.feature || pkg.includes || pkg.benefits || pkg.fasilitas || pkg.isi || []
  ).map(toPlainText).filter(Boolean);

  return {
    ...pkg,
    name: toPlainText(pkg.name || pkg.title || pkg.tier || pkg.package || pkg.paket || `Paket ${index + 1}`),
    price: toPlainText(pkg.price || pkg.harga || pkg.amount || pkg.biaya || ''),
    features,
    note: toPlainText(pkg.note || pkg.notes || pkg.catatan || ''),
    isBestValue: Boolean(pkg.isBestValue || pkg.bestValue || pkg.recommended || pkg.rekomendasi),
  };
};

export const normalizePricelist = (item = {}) => ({
  ...item,
  packages: parseJsonArrayField(item.packages).map(normalizePackage),
  extra_info: parseJsonArrayField(item.extra_info || item.extraInfo || item.extras).map(toPlainText).filter(Boolean),
  terms: parseJsonArrayField(item.terms || item.syarat || item.ketentuan).map(toPlainText).filter(Boolean),
});

export const normalizePricelistPayload = (payload = {}) => {
  const normalized = normalizePricelist(payload);

  return {
    ...normalized,
    title: String(normalized.title || '').trim(),
    subtitle: String(normalized.subtitle || '').trim(),
    packages: normalized.packages.filter(pkg => pkg.name || pkg.price || pkg.features.length > 0),
    extra_info: normalized.extra_info,
    terms: normalized.terms,
  };
};

export const getAiTextContent = (response) => {
  if (!response) return '';
  if (typeof response === 'string') return response;
  if (typeof response.message?.content === 'string') return response.message.content;
  if (Array.isArray(response.message?.content)) {
    return response.message.content.map(part => part?.text || part?.content || '').join('\n');
  }
  if (typeof response.content === 'string') return response.content;
  if (Array.isArray(response.content)) {
    return response.content.map(part => part?.text || part?.content || '').join('\n');
  }
  return String(response);
};
