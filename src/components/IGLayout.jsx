import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadFotoCloudinary } from '../utils/cloudinary';

const IGLayout = ({ instagramConfig, setInstagramConfig, handleSimpanInstagram }) => {
  const [uploading, setUploading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [savedAt, setSavedAt] = useState(null);

  const handleUploadProfileImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFotoCloudinary(file);
      setInstagramConfig({ ...instagramConfig, igProfileImage: url });
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const getCurrentPosts = () => {
    let posts = instagramConfig.igFeedPosts || [];
    if (typeof posts === 'string') {
      try { posts = JSON.parse(posts); } catch { posts = []; }
    }
    if (!Array.isArray(posts)) posts = [];
    // Ensure 9 slots
    while (posts.length < 9) posts.push('');
    return posts;
  };

  const updatePost = (idx, value) => {
    const posts = getCurrentPosts();
    posts[idx] = value;
    setInstagramConfig({ ...instagramConfig, igFeedPosts: posts });
  };

  const removePost = (idx) => {
    const posts = getCurrentPosts();
    posts[idx] = '';
    setInstagramConfig({ ...instagramConfig, igFeedPosts: posts });
  };

  const posts = getCurrentPosts();

  return (
    <div className="min-h-screen bg-[#080808] p-4 md:p-10 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
            Instagram Grid
          </h1>
          <p className="text-zinc-400 text-base max-w-2xl">Atur profile IG dan isi 9 gambar untuk feed utama tanpa spacing antar kotak.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Profile Section */}
          <div className="space-y-8">
            <div className="p-8 bg-zinc-900/50 rounded-[2.5rem] border border-white/5 space-y-6">
              <h2 className="text-2xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-4">Profile Info</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold block mb-2">Username (tanpa @)</label>
                  <input
                    type="text"
                    placeholder="rfx.visual"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm hover:border-white/20 focus:border-logo-red/50 focus:outline-none transition-colors"
                    value={instagramConfig.igUsername || ''}
                    onChange={e => setInstagramConfig({ ...instagramConfig, igUsername: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold block mb-2">Bio Singkat</label>
                  <textarea
                    placeholder="Jadikan feed Instagram sebagai tampilan portofolio visual..."
                    rows="3"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm hover:border-white/20 focus:border-logo-red/50 focus:outline-none transition-colors resize-none"
                    value={instagramConfig.igBio || ''}
                    onChange={e => setInstagramConfig({ ...instagramConfig, igBio: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold block mb-3">Profile Picture</label>
                  <div className="flex items-center gap-5">
                    <div className="w-24 h-24 aspect-square rounded-full overflow-hidden border-2 border-white/10 bg-black flex items-center justify-center flex-shrink-0">
                      {instagramConfig.igProfileImage ? (
                        <img src={instagramConfig.igProfileImage} alt="Profile" className="w-full h-full object-cover block" />
                      ) : (
                        <div className="text-[11px] text-zinc-500 text-center px-2">Belum ada gambar</div>
                      )}
                    </div>
                    <label className="flex-1 px-6 py-4 rounded-2xl bg-logo-red/20 border border-logo-red/40 text-center cursor-pointer hover:bg-logo-red/30 transition-colors">
                      <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider">
                        <Upload className="w-4 h-4" />
                        Upload Foto
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleUploadProfileImage} disabled={uploading} />
                    </label>
                  </div>
                  {instagramConfig.igProfileImage && (
                    <button
                      onClick={() => setInstagramConfig({ ...instagramConfig, igProfileImage: '' })}
                      className="mt-2 text-xs text-zinc-500 hover:text-red-500 transition-colors"
                    >
                      Hapus foto
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={async () => {
                    setSaveStatus('saving');
                    const ok = await handleSimpanInstagram();
                    if (ok) { setSaveStatus('saved'); setSavedAt(new Date().toISOString()); setTimeout(() => setSaveStatus('idle'), 3000); }
                    else setSaveStatus('error');
                  }}
                  className="w-full mt-6 px-6 py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-wider text-sm hover:bg-logo-red hover:text-white transition-all"
                >
                  Simpan Profile
                </button>
                <div className="text-xs text-zinc-400">
                  {saveStatus === 'saving' && <span>Menyimpan...</span>}
                  {saveStatus === 'saved' && <span className="text-green-400">Tersimpan</span>}
                  {saveStatus === 'error' && <span className="text-red-400">Gagal</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="p-8 bg-zinc-900/50 rounded-[2.5rem] border border-white/5 space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-4">Preview Grid 3x3</h2>
            <div className="bg-black/50 rounded-3xl p-6 border border-white/10">
              {/* Profile Preview */}
              <div className="mb-6 pb-6 border-b border-white/10 flex items-center gap-4">
                <div className="w-16 h-16 aspect-square rounded-full overflow-hidden border border-white/20 bg-black flex items-center justify-center flex-shrink-0">
                      {instagramConfig.igProfileImage ? (
                        <img src={instagramConfig.igProfileImage} alt="Profile" className="w-full h-full object-cover block" />
                  ) : (
                    <div className="text-[10px] text-zinc-500">Foto</div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-[0.2em]">Instagram</p>
                  <h3 className="text-lg font-bold">@{instagramConfig.igUsername || 'username'}</h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{instagramConfig.igBio || 'bio'}</p>
                </div>
              </div>

              {/* Grid Preview */}
              <div className="grid grid-cols-3 gap-0">
                {posts.map((url, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-zinc-800/50 border-b border-r border-white/10 overflow-hidden relative"
                    onMouseEnter={() => setPreviewIndex(idx)}
                    onMouseLeave={() => setPreviewIndex(null)}
                  >
                    {url ? (
                      <img src={url} alt={`Post ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">Kosong</div>
                    )}
                    {previewIndex === idx && url && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-[10px] text-zinc-300">Post {idx + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grid URLs Section */}
        <div className="mt-10 p-8 bg-zinc-900/50 rounded-[2rem] border border-white/5 space-y-6">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Post URLs</h2>
            <p className="text-sm text-zinc-400">Isi 9 URL gambar langsung. Tidak perlu teks penjelasan panjang.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((url, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-logo-red/20 border border-logo-red/40 flex items-center justify-center text-[10px] font-black text-logo-red">
                    {idx + 1}
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">Slot {idx + 1}</span>
                </div>
                <div className="relative">
                  <input
                    type="url"
                    placeholder={`https://image-source.com/img-${idx + 1}.jpg`}
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs hover:border-white/20 focus:border-logo-red/50 focus:outline-none transition-colors"
                    value={url}
                    onChange={e => updatePost(idx, e.target.value)}
                  />
                  {url && (
                    <button
                      type="button"
                      onClick={() => removePost(idx)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

            <button
                onClick={handleSimpanInstagram}
            className="w-full mt-4 px-6 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-wider text-sm hover:bg-logo-red hover:text-white transition-all shadow-lg"
          >
            Simpan Grid Instagram
          </button>
        </div>
      </div>
    </div>
  );
};

export default IGLayout;
