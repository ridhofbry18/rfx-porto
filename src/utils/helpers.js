export const getYoutubeId = (url) => {
  if (!url) return null;
  const trimmed = String(url).trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  if (trimmed.includes('youtube/') && !trimmed.includes('watch?')) {
    const parts = trimmed.split('youtube/');
    const id = parts[1] ? parts[1].split('?')[0] : null;
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  }
  const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  return (match && match[1] && match[1].length === 11) ? match[1] : null;
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
