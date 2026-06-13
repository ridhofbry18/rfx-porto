'use client'

import React, { useState } from 'react'
import { Edit, Trash2, X, Lock, ExternalLink, Layout, Sparkles, Play, AlertCircle, LogOut, Image as ImageIcon, BookOpen, Instagram } from 'lucide-react'
import { uploadFotoCloudinary, uploadVideoCloudinary } from '../utils/cloudinary'
import { convertImageLink, convertToCustomYoutube, convertGDriveToPreview, getYoutubeId } from '../utils/helpers'
import IGLayout from './IGLayout'

const PanelAdmin = ({
  modalAdminBuka, setModalAdminBuka, statusAdmin, setStatusAdmin,
  inputKunciAdmin, setInputKunciAdmin, tanganiLoginAdmin,
  tabAdmin, setTabAdmin, itemBaru, setItemBaru,
  idEdit, setIdEdit, batalEdit,
  tanganiHapusKarya, handleSimpanItem,
  daftarKarya, daftarSubKategori, subKatBaru, setSubKatBaru, handleSimpanSubKategori, tanganiHapusSubKategori,
  configSitus, setConfigSitus, handleSimpanConfig,
    instagramConfig, setInstagramConfig, handleSimpanInstagram,
  skills, setSkills, experiences, setExperiences,
  handleSimpanSkill, tanganiHapusSkill,
  handleSimpanExperience, tanganiHapusExperience,
  daftarWebsite, handleSimpanWebsite, tanganiHapusWebsite,
  daftarPricelist, handleSimpanPricelist, tanganiHapusPricelist,
  daftarArtikel, handleSimpanArtikel, tanganiHapusArtikel,
  isAdminRoute = false
}) => {

  const [skillBaru, setSkillBaru] = useState({ title: '', level: 50, category: 'software' });
  const [expBaru, setExpBaru] = useState({ year: '', title: '', company: '', description: '', icon: 'Camera' });
  const [webBaru, setWebBaru] = useState({ title: '', link_web: '', link_preview: '' });
  const [pricelistBaru, setPricelistBaru] = useState({ title: '', subtitle: '', packages: [], extra_info: [], terms: [] });
  const [artikelBaru, setArtikelBaru] = useState({ title: '', date: '', image: '', content: '' });
  const [isPdfExtracting, setIsPdfExtracting] = useState(false);

  // Admin List Filters
  const [filterKategoriAdmin, setFilterKategoriAdmin] = useState('all');

  // Mobile Form Toggle
  const [isFormBuka, setIsFormBuka] = useState(false);

  // Upload state
  const [modeFoto, setModeFoto] = useState('url');
  const [modeVideo, setModeVideo] = useState('youtube');
  const [modePreviewWeb, setModePreviewWeb] = useState('url');
  const [fotoProgress, setFotoProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [fotoUploading, setFotoUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleUploadFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadError('');
    setFotoUploading(true); setFotoProgress(0);
    try {
      const url = await uploadFotoCloudinary(file, setFotoProgress);
      setItemBaru(prev => ({ ...prev, image: url }));
    } catch (err) { setUploadError('Foto: ' + err); }
    finally { setFotoUploading(false); }
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadError('');
    setVideoUploading(true); setVideoProgress(0);
    try {
      const url = await uploadVideoCloudinary(file, setVideoProgress);
      setItemBaru(prev => ({ ...prev, youtubeUrl: url, videoType: 'file' }));
    } catch (err) { setUploadError('Video: ' + err); }
    finally { setVideoUploading(false); }
  };

  const handlePdfExtract = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsPdfExtracting(true);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;

      const arrayBuffer = await file.arrayBuffer();
      const typedArray = new Uint8Array(arrayBuffer);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
      }

      const prompt = `You are a data extractor. Extract the packages, prices, features, extra info, and terms from this pricelist text. Return ONLY a valid JSON object matching this schema, nothing else:
{ "title": "Category Name", "subtitle": "Brief subtitle", "packages": [{"name": "Reguler", "price": "250k", "features": ["feature 1"], "note": "optional note", "isBestValue": false}], "extra_info": ["extra cost"], "terms": ["term 1"] }
Text to extract: ${text}`;

      const response = await window.puter.ai.chat(prompt, { model: 'gpt-4o-mini' });
      const jsonStr = response.message.content.match(/\{[\s\S]*\}/)[0];
      const data = JSON.parse(jsonStr);

      setPricelistBaru({
        title: data.title || '', subtitle: data.subtitle || '',
        packages: data.packages || [], extra_info: data.extra_info || [], terms: data.terms || []
      });
      alert("Berhasil ekstrak data! Silakan periksa form.");
      setIsFormBuka(true);
    } catch (err) {
      alert("Gagal ekstrak PDF: " + err.message);
    } finally {
      setIsPdfExtracting(false);
    }
  };

  const resetForms = () => {
    setIsFormBuka(false);
    setSkillBaru({ title: '', level: 50, category: 'software' });
    setExpBaru({ year: '', title: '', company: '', description: '', icon: 'Camera' });
    setWebBaru({ title: '', link_web: '', link_preview: '' });
    setPricelistBaru({ title: '', subtitle: '', packages: [], extra_info: [], terms: [] });
    setArtikelBaru({ title: '', date: '', image: '', content: '' });
    setModeFoto('url'); setModeVideo('youtube'); setModePreviewWeb('url');
    setFotoProgress(0); setVideoProgress(0);
    setUploadError('');
    setIdEdit(null);
  };

  if (!modalAdminBuka && !isAdminRoute) return null;

  return (
    <div className={isAdminRoute ? "min-h-screen bg-[#050505] text-white flex flex-col font-sans relative" : "fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-2xl"}>
      <div className={isAdminRoute ? "flex-1 flex flex-col bg-[#050505]" : "relative w-full max-w-6xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[85vh]"}>
        {!statusAdmin ? (
          <div className="relative p-10 text-center space-y-8 flex-1 flex flex-col justify-center items-center">
            {!isAdminRoute && <button onClick={() => setModalAdminBuka(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>}
            <Lock className="w-10 h-10 text-red-600 animate-pulse" />
            <form onSubmit={tanganiLoginAdmin} className="w-full max-w-xs space-y-4">
              <input type="password" placeholder="Passkey..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center outline-none focus:border-red-600 text-white" value={inputKunciAdmin} onChange={e => setInputKunciAdmin(e.target.value)} />
              <button type="submit" className="w-full bg-red-600 py-4 rounded-2xl font-black uppercase text-xs text-white">Unlock</button>
            </form>
          </div>
        ) : (
          <div className={`flex flex-1 overflow-hidden ${isAdminRoute ? 'flex-col-reverse' : 'flex-col md:flex-row'}`}>

            {/* Navigasi (Sidebar di Desktop, Bottom-Bar di PWA Mobile) */}
            <div className={isAdminRoute ? "w-full bg-[#0a0a0a] border-t border-white/5 p-2 px-4 flex gap-2 overflow-x-auto custom-scrollbar z-50 shrink-0" : "w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-black/40 p-6 flex md:flex-col gap-2 shrink-0"}>

              <button onClick={() => { setTabAdmin('portofolio'); resetForms(); }} className={`flex items-center justify-center shrink-0 ${isAdminRoute ? 'flex-col gap-1 min-w-[70px] p-2' : 'gap-3 px-4 py-3'} rounded-xl font-black transition-all ${tabAdmin === 'portofolio' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white bg-white/5'}`}>
                <ImageIcon className={isAdminRoute ? 'w-5 h-5' : 'w-4 h-4'} />
                <span className={isAdminRoute ? 'text-[9px]' : 'text-xs'}>Karya</span>
              </button>

              <button onClick={() => { setTabAdmin('website'); resetForms(); }} className={`flex items-center justify-center shrink-0 ${isAdminRoute ? 'flex-col gap-1 min-w-[70px] p-2' : 'gap-3 px-4 py-3'} rounded-xl font-black transition-all ${tabAdmin === 'website' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white bg-white/5'}`}>
                <ExternalLink className={isAdminRoute ? 'w-5 h-5' : 'w-4 h-4'} />
                <span className={isAdminRoute ? 'text-[9px]' : 'text-xs'}>Website</span>
              </button>

              <button onClick={() => { setTabAdmin('subkategori'); resetForms(); }} className={`flex items-center justify-center shrink-0 ${isAdminRoute ? 'flex-col gap-1 min-w-[70px] p-2' : 'gap-3 px-4 py-3'} rounded-xl font-black transition-all ${tabAdmin === 'subkategori' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white bg-white/5'}`}>
                <Layout className={isAdminRoute ? 'w-5 h-5' : 'w-4 h-4'} />
                <span className={isAdminRoute ? 'text-[9px]' : 'text-xs'}>Album</span>
              </button>

              <button onClick={() => { setTabAdmin('skills'); resetForms(); }} className={`flex items-center justify-center shrink-0 ${isAdminRoute ? 'flex-col gap-1 min-w-[70px] p-2' : 'gap-3 px-4 py-3'} rounded-xl font-black transition-all ${tabAdmin === 'skills' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white bg-white/5'}`}>
                <Sparkles className={isAdminRoute ? 'w-5 h-5' : 'w-4 h-4'} />
                <span className={isAdminRoute ? 'text-[9px]' : 'text-xs'}>Skills</span>
              </button>

              <button onClick={() => { setTabAdmin('journey'); resetForms(); }} className={`flex items-center justify-center shrink-0 ${isAdminRoute ? 'flex-col gap-1 min-w-[70px] p-2' : 'gap-3 px-4 py-3'} rounded-xl font-black transition-all ${tabAdmin === 'journey' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white bg-white/5'}`}>
                <Play className={isAdminRoute ? 'w-5 h-5' : 'w-4 h-4'} />
                <span className={isAdminRoute ? 'text-[9px]' : 'text-xs'}>Journey</span>
              </button>

              <button onClick={() => { setTabAdmin('config'); resetForms(); }} className={`flex items-center justify-center shrink-0 ${isAdminRoute ? 'flex-col gap-1 min-w-[70px] p-2' : 'gap-3 px-4 py-3'} rounded-xl font-black transition-all ${tabAdmin === 'config' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white bg-white/5'}`}>
                <Layout className={isAdminRoute ? 'w-5 h-5' : 'w-4 h-4'} />
                <span className={isAdminRoute ? 'text-[9px]' : 'text-xs'}>Tampilan</span>
              </button>

              <button onClick={() => { setTabAdmin('pricelist'); resetForms(); }} className={`flex items-center justify-center shrink-0 ${isAdminRoute ? 'flex-col gap-1 min-w-[70px] p-2' : 'gap-3 px-4 py-3'} rounded-xl font-black transition-all ${tabAdmin === 'pricelist' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white bg-white/5'}`}>
                <AlertCircle className={isAdminRoute ? 'w-5 h-5' : 'w-4 h-4'} />
                <span className={isAdminRoute ? 'text-[9px]' : 'text-xs'}>Pricelist</span>
              </button>

              <button onClick={() => { setTabAdmin('artikel'); resetForms(); }} className={`flex items-center justify-center shrink-0 ${isAdminRoute ? 'flex-col gap-1 min-w-[70px] p-2' : 'gap-3 px-4 py-3'} rounded-xl font-black transition-all ${tabAdmin === 'artikel' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white bg-white/5'}`}>
                <BookOpen className={isAdminRoute ? 'w-5 h-5' : 'w-4 h-4'} />
                <span className={isAdminRoute ? 'text-[9px]' : 'text-xs'}>Artikel</span>
              </button>

              <button onClick={() => { setTabAdmin('ig'); resetForms(); }} className={`flex items-center justify-center shrink-0 ${isAdminRoute ? 'flex-col gap-1 min-w-[70px] p-2' : 'gap-3 px-4 py-3'} rounded-xl font-black transition-all ${tabAdmin === 'ig' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white bg-white/5'}`}>
                <Instagram className={isAdminRoute ? 'w-5 h-5' : 'w-4 h-4'} />
                <span className={isAdminRoute ? 'text-[9px]' : 'text-xs'}>Instagram</span>
              </button>

              <div className={`flex ${isAdminRoute ? 'ml-auto gap-2 items-center' : 'md:mt-auto flex-col gap-2'}`}>
                <button onClick={() => {
                  setStatusAdmin(false);
                  localStorage.removeItem('rfx_admin_auth');
                  if (isAdminRoute) window.location.href = '/';
                }} className={`shrink-0 flex items-center justify-center rounded-xl font-black text-red-500 border border-red-900/20 transition-all hover:bg-red-900/20 ${isAdminRoute ? 'px-4 py-2 h-full' : 'w-full py-3 text-[10px]'}`}>
                  {isAdminRoute ? <LogOut className="w-4 h-4" /> : "Lock / Log Out"}
                </button>
                {!isAdminRoute && <button onClick={() => setModalAdminBuka(false)} className="w-full py-3 rounded-xl text-[10px] font-black text-zinc-500 border border-white/5 hover:bg-white/5">Close</button>}
              </div>
            </div>
            {/* AREA KONTEN (Scrolling) */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar bg-[#050505] pb-24 ${isAdminRoute ? 'p-4' : 'p-6 md:p-10'}`}>
              {tabAdmin === 'portofolio' && (
                <div className="flex flex-col md:flex-row gap-8 md:gap-10">
                  <div className={`flex-1 space-y-5 ${isFormBuka ? 'block' : 'hidden md:block'}`}>
                    <form onSubmit={handleSimpanItem} className="space-y-4">
                      <h4 className="text-white font-bold uppercase tracking-widest text-xs">Tambah/Edit Karya</h4>

                      {/* Error */}
                      {uploadError && <div className="text-red-400 text-xs bg-red-900/20 border border-red-800/50 rounded-xl px-4 py-3">{uploadError}</div>}

                      {/* Judul + Kategori */}
                      <input type="text" placeholder="Judul" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={itemBaru.title} onChange={e => setItemBaru({ ...itemBaru, title: e.target.value })} />
                      <div className="grid grid-cols-2 gap-4">
                        <select className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={itemBaru.category} onChange={e => setItemBaru({ ...itemBaru, category: e.target.value, subcategory_id: '' })}>
                          <option value="video">Video</option>
                          <option value="photo">Foto</option>
                          <option value="animation">Animasi</option>
                        </select>
                        <select className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={itemBaru.subcategory_id || ''} onChange={e => setItemBaru({ ...itemBaru, subcategory_id: e.target.value })}>
                          <option value="">(Tanpa Album/Lainnya)</option>
                          {daftarSubKategori.filter(s => s.parent_category === itemBaru.category).map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* THUMBNAIL (FOTO) */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Thumbnail</span>
                          <div className="flex gap-1 ml-auto">
                            <button type="button" onClick={() => setModeFoto('url')} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${modeFoto === 'url' ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>URL</button>
                            <button type="button" onClick={() => setModeFoto('upload')} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${modeFoto === 'upload' ? 'bg-blue-700 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>Upload</button>
                          </div>
                        </div>
                        {modeFoto === 'url' ? (
                          <input type="url" placeholder="Thumbnail URL / GDrive" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={itemBaru.image} onChange={e => setItemBaru({ ...itemBaru, image: e.target.value })} onBlur={e => setItemBaru({ ...itemBaru, image: convertImageLink(e.target.value) })} />
                        ) : (
                          <div className="space-y-2">
                            <label className="block w-full border-2 border-dashed border-zinc-700 hover:border-blue-600 rounded-2xl px-5 py-4 text-center cursor-pointer transition-colors">
                              <ImageIcon className="w-5 h-5 text-zinc-600 mx-auto mb-1" />
                              <span className="text-[10px] text-zinc-500">Pilih foto (max 5MB)</span>
                              <input type="file" accept="image/*" className="hidden" onChange={handleUploadFoto} disabled={fotoUploading} />
                            </label>
                            {fotoUploading && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-zinc-500"><span>Mengupload...</span><span>{fotoProgress}%</span></div>
                                <div className="h-1.5 bg-zinc-800 rounded-full"><div style={{ width: `${fotoProgress}%` }} className="h-full bg-blue-500 rounded-full transition-all" /></div>
                              </div>
                            )}
                            {itemBaru.image && !fotoUploading && <p className="text-[10px] text-green-500 truncate">✓ {itemBaru.image}</p>}
                          </div>
                        )}
                      </div>

                      {/* VIDEO / ANIMASI */}
                      {(itemBaru.category === 'video' || itemBaru.category === 'animation') && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Video</span>
                              <div className="flex gap-1 ml-auto">
                              <button type="button" onClick={() => setModeVideo('youtube')} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${modeVideo === 'youtube' ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>YouTube</button>
                              <button type="button" onClick={() => setModeVideo('upload')} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${modeVideo === 'upload' ? 'bg-red-700 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>Upload</button>
                              <button type="button" onClick={() => setModeVideo('external')} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${modeVideo === 'external' ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>External</button>
                            </div>
                          </div>
                          {modeVideo === 'youtube' ? (
                            <>
                              <input type="url" placeholder="Youtube URL" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={itemBaru.youtubeUrl || ''} onChange={e => setItemBaru({ ...itemBaru, youtubeUrl: convertToCustomYoutube(e.target.value), videoType: 'youtube' })} onBlur={e => setItemBaru({ ...itemBaru, youtubeUrl: convertToCustomYoutube(e.target.value), videoType: 'youtube' })} />
                              {getYoutubeId(itemBaru.youtubeUrl) ? (
                                <p className="text-[10px] text-zinc-400">Embed URL: <span className="text-white">https://www.youtube.com/embed/{getYoutubeId(itemBaru.youtubeUrl)}</span></p>
                              ) : itemBaru.youtubeUrl ? (
                                <p className="text-[10px] text-amber-400">URL belum valid. Gunakan link YouTube penuh.</p>
                              ) : null}
                            </>
                          ) : modeVideo === 'external' ? (
                            <>
                              <input type="url" placeholder="Direct video URL / Google Drive / Vimeo" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={itemBaru.youtubeUrl || ''} onChange={e => setItemBaru({ ...itemBaru, youtubeUrl: convertGDriveToPreview(e.target.value), videoType: 'external' })} onBlur={e => setItemBaru({ ...itemBaru, youtubeUrl: convertGDriveToPreview(e.target.value), videoType: 'external' })} />
                              {itemBaru.youtubeUrl ? (
                                <p className="text-[10px] text-zinc-400">Preview URL: <span className="text-white truncate">{itemBaru.youtubeUrl}</span></p>
                              ) : null}
                            </>
                          ) : (
                            <div className="space-y-2">
                              <label className="block w-full border-2 border-dashed border-zinc-700 hover:border-red-600 rounded-2xl px-5 py-4 text-center cursor-pointer transition-colors">
                                <Play className="w-5 h-5 text-zinc-600 mx-auto mb-1" />
                                <span className="text-[10px] text-zinc-500">Pilih video (max 200MB, auto-compress)</span>
                                <input type="file" accept="video/*" className="hidden" onChange={handleUploadVideo} disabled={videoUploading} />
                              </label>
                              {videoUploading && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px] text-zinc-500"><span>Mengupload &amp; compress...</span><span>{videoProgress}%</span></div>
                                  <div className="h-1.5 bg-zinc-800 rounded-full"><div style={{ width: `${videoProgress}%` }} className="h-full bg-red-500 rounded-full transition-all" /></div>
                                </div>
                              )}
                              {itemBaru.youtubeUrl && itemBaru.videoType === 'file' && !videoUploading && <p className="text-[10px] text-green-500 truncate">✓ {itemBaru.youtubeUrl}</p>}
                            </div>
                          )}
                        </div>
                      )}

                      <textarea placeholder="Deskripsi" rows="3" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={itemBaru.description} onChange={e => setItemBaru({ ...itemBaru, description: e.target.value })} />
                      <button type="submit" disabled={fotoUploading || videoUploading} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"> {idEdit ? 'Simpan Perubahan' : 'Publikasikan'}</button>
                      <div className="flex gap-2 mt-2">
                        {idEdit && <button onClick={() => { batalEdit(); resetForms(); }} type="button" className="flex-1 text-zinc-500 text-[10px] uppercase py-2 hover:bg-white/5 rounded-xl transition-all">Batal Edit</button>}
                        <button onClick={() => setIsFormBuka(false)} type="button" className="flex-1 md:hidden text-zinc-500 text-[10px] uppercase py-2 hover:bg-white/5 rounded-xl transition-all">Tutup Form</button>
                      </div>
                    </form>
                  </div>
                  <div className={`flex-1 space-y-4 pr-2 custom-scrollbar ${isAdminRoute ? '' : 'max-h-[500px] overflow-y-auto'} ${!isFormBuka ? 'block' : 'hidden md:block'}`}>
                    <button onClick={() => { resetForms(); setIsFormBuka(true); }} className="w-full md:hidden mb-4 bg-zinc-900 border border-white/5 hover:border-white/20 text-white rounded-2xl py-4 font-bold text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2">
                      <span className="text-red-500 text-sm leading-none">+</span> Tambah Karya Baru
                    </button>

                    {/* FILTER KARYA ADMIN */}
                    <div className="flex gap-2 mb-4 overflow-x-auto custom-scrollbar pb-2">
                      {['all', 'photo', 'video', 'animation'].map(cat => (
                        <button key={cat} onClick={() => setFilterKategoriAdmin(cat)} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shrink-0 transition-all ${filterKategoriAdmin === cat ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-500 hover:text-white border border-white/5'}`}>
                          {cat === 'all' ? 'Semua' : cat === 'photo' ? 'Foto' : cat === 'video' ? 'Video' : 'Animasi'}
                        </button>
                      ))}
                    </div>

                    {daftarKarya.filter(item => filterKategoriAdmin === 'all' || item.category === filterKategoriAdmin).map(item => (
                      <div key={item.id} className={`flex items-center gap-4 p-3 bg-zinc-900/50 rounded-2xl border ${idEdit === item.id ? 'border-red-600' : 'border-white/5'}`}>
                        <img src={item.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                        <div className="flex-1 truncate text-xs font-bold text-white uppercase">{item.title}</div>
                        <div className="flex gap-1">
                          <button onClick={() => {
                            const isFileVideo = item.youtubeUrl && item.youtubeUrl.match(/\.(mp4|mov|webm|ogg)(\?.*)?$/i);
                            const isGDrive = item.youtubeUrl && item.youtubeUrl.includes('drive.google.com');
                            setItemBaru(item);
                            setIdEdit(item.id);
                            setModeFoto('url');
                            setModeVideo(isFileVideo ? 'upload' : isGDrive ? 'external' : 'youtube');
                            setIsFormBuka(true);
                          }} className="p-2 text-zinc-500 hover:text-white"><Edit className="w-3 h-3" /></button>
                          <button onClick={() => tanganiHapusKarya(item.id)} className="p-2 text-zinc-500 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    ))}
                    {daftarKarya.filter(item => filterKategoriAdmin === 'all' || item.category === filterKategoriAdmin).length === 0 && (
                      <p className="text-zinc-500 text-xs text-center italic py-4">Belum ada karya di kategori ini.</p>
                    )}
                  </div>
                </div>
              )}

              {tabAdmin === 'website' && (
                <div className="flex flex-col md:flex-row gap-10">
                  <div className={`flex-1 space-y-6 ${isFormBuka ? 'block' : 'hidden md:block'}`}>
                    <form onSubmit={(e) => { e.preventDefault(); handleSimpanWebsite(webBaru, idEdit, resetForms); }} className="space-y-4">
                      <h4 className="text-white font-bold uppercase tracking-widest text-xs">Tambah/Edit Website</h4>
                      <input type="text" placeholder="Judul Website" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={webBaru.title} onChange={e => setWebBaru({ ...webBaru, title: e.target.value })} required />
                      <input type="url" placeholder="Link Web (https://...)" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={webBaru.link_web} onChange={e => setWebBaru({ ...webBaru, link_web: e.target.value })} />

                      {/* Preview Image — URL atau Upload */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Preview Image</span>
                          <div className="flex gap-1 ml-auto">
                            <button type="button" onClick={() => setModePreviewWeb('url')} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${modePreviewWeb === 'url' ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>URL</button>
                            <button type="button" onClick={() => setModePreviewWeb('upload')} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${modePreviewWeb === 'upload' ? 'bg-blue-700 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>Upload</button>
                          </div>
                        </div>
                        {modePreviewWeb === 'url' ? (
                          <input type="url" placeholder="Link Preview / GDrive Screenshot" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={webBaru.link_preview} onChange={e => setWebBaru({ ...webBaru, link_preview: e.target.value })} onBlur={e => setWebBaru({ ...webBaru, link_preview: convertImageLink(e.target.value) })} />
                        ) : (
                          <div className="space-y-2">
                            <label className="block w-full border-2 border-dashed border-zinc-700 hover:border-blue-600 rounded-2xl px-5 py-4 text-center cursor-pointer transition-colors">
                              <ImageIcon className="w-5 h-5 text-zinc-600 mx-auto mb-1" />
                              <span className="text-[10px] text-zinc-500">Pilih screenshot (max 5MB)</span>
                              <input type="file" accept="image/*" className="hidden" onChange={async (ev) => {
                                const file = ev.target.files[0]; if (!file) return;
                                setFotoUploading(true); setFotoProgress(0); setUploadError('');
                                try {
                                  const url = await uploadFotoCloudinary(file, setFotoProgress);
                                  setWebBaru(prev => ({ ...prev, link_preview: url }));
                                } catch (err) { setUploadError('Preview: ' + err); }
                                finally { setFotoUploading(false); }
                              }} disabled={fotoUploading} />
                            </label>
                            {fotoUploading && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-zinc-500"><span>Mengupload...</span><span>{fotoProgress}%</span></div>
                                <div className="h-1.5 bg-zinc-800 rounded-full"><div style={{ width: `${fotoProgress}%` }} className="h-full bg-blue-500 rounded-full transition-all" /></div>
                              </div>
                            )}
                            {webBaru.link_preview && !fotoUploading && <p className="text-[10px] text-green-500 truncate">✓ {webBaru.link_preview}</p>}
                          </div>
                        )}
                      </div>

                      <button type="submit" disabled={fotoUploading} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs hover:bg-red-600 hover:text-white transition-all disabled:opacity-50">{idEdit ? 'Simpan Perubahan' : 'Publikasikan Website'}</button>
                      <div className="flex gap-2 mt-2">
                        {idEdit && <button onClick={resetForms} type="button" className="flex-1 text-zinc-500 text-[10px] uppercase py-2 hover:bg-white/5 rounded-xl transition-all">Batal Edit</button>}
                        <button onClick={() => setIsFormBuka(false)} type="button" className="flex-1 md:hidden text-zinc-500 text-[10px] uppercase py-2 hover:bg-white/5 rounded-xl transition-all">Tutup Form</button>
                      </div>
                    </form>
                  </div>
                  <div className={`flex-1 space-y-3 pr-2 custom-scrollbar ${isAdminRoute ? '' : 'max-h-[500px] overflow-y-auto'} ${!isFormBuka ? 'block' : 'hidden md:block'}`}>
                    <button onClick={() => { resetForms(); setIsFormBuka(true); }} className="w-full md:hidden mb-4 bg-zinc-900 border border-white/5 hover:border-white/20 text-white rounded-2xl py-4 font-bold text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2">
                      <span className="text-red-500 text-sm leading-none">+</span> Tambah Web Baru
                    </button>
                    {daftarWebsite.map(site => (
                      <div key={site.id} className={`flex items-center gap-4 p-3 bg-zinc-900/50 rounded-2xl border ${idEdit === site.id ? 'border-red-600' : 'border-white/5'}`}>
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0"><ExternalLink className="w-4 h-4" /></div>
                        <div className="flex-1 truncate text-xs font-bold text-white">{site.title}</div>
                        <div className="flex gap-1">
                          <button onClick={() => { setWebBaru({ title: site.title, link_web: site.link_web || '', link_preview: site.link_preview || '' }); setIdEdit(site.id); setIsFormBuka(true); }} className="p-2 text-zinc-500 hover:text-white"><Edit className="w-3 h-3" /></button>
                          <button onClick={() => tanganiHapusWebsite(site.id)} className="p-2 text-zinc-500 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    ))}
                    {daftarWebsite.length === 0 && <p className="text-zinc-600 text-xs italic">Belum ada website.</p>}
                  </div>
                </div>
              )}

              {tabAdmin === 'artikel' && (
                <div className="flex flex-col md:flex-row gap-10">
                  <div className={`flex-1 space-y-6 ${isFormBuka ? 'block' : 'hidden md:block'}`}>
                    <form onSubmit={(e) => { e.preventDefault(); handleSimpanArtikel(artikelBaru, idEdit).then(resetForms); }} className="space-y-4">
                      <h4 className="text-white font-bold uppercase tracking-widest text-xs">Tambah/Edit Artikel</h4>
                      <input type="text" placeholder="Judul Artikel" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={artikelBaru.title} onChange={e => setArtikelBaru({ ...artikelBaru, title: e.target.value })} required />
                      <input type="text" placeholder="Tanggal (e.g. 12 Juni 2026)" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={artikelBaru.date} onChange={e => setArtikelBaru({ ...artikelBaru, date: e.target.value })} required />
                      <input type="url" placeholder="URL Thumbnail Gambar" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={artikelBaru.image} onChange={e => setArtikelBaru({ ...artikelBaru, image: e.target.value })} />
                      <textarea placeholder="Konten Artikel (gunakan baris baru untuk paragraf)" rows="10" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs leading-relaxed" value={artikelBaru.content} onChange={e => setArtikelBaru({ ...artikelBaru, content: e.target.value })} required />
                      <button type="submit" className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs hover:bg-red-600 hover:text-white transition-all">{idEdit ? 'Simpan Perubahan' : 'Publikasikan Artikel'}</button>
                      <div className="flex gap-2 mt-2">
                        {idEdit && <button onClick={resetForms} type="button" className="flex-1 text-zinc-500 text-[10px] uppercase py-2 hover:bg-white/5 rounded-xl transition-all">Batal Edit</button>}
                        <button onClick={() => setIsFormBuka(false)} type="button" className="flex-1 md:hidden text-zinc-500 text-[10px] uppercase py-2 hover:bg-white/5 rounded-xl transition-all">Tutup Form</button>
                      </div>
                    </form>
                  </div>
                  <div className={`flex-1 space-y-3 pr-2 custom-scrollbar ${isAdminRoute ? '' : 'max-h-[500px] overflow-y-auto'} ${!isFormBuka ? 'block' : 'hidden md:block'}`}>
                    <button onClick={() => { resetForms(); setIsFormBuka(true); }} className="w-full md:hidden mb-4 bg-zinc-900 border border-white/5 hover:border-white/20 text-white rounded-2xl py-4 font-bold text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2">
                      <span className="text-red-500 text-sm leading-none">+</span> Tambah Artikel Baru
                    </button>
                    {daftarArtikel?.map(artikel => (
                      <div key={artikel.id} className={`flex items-center gap-4 p-3 bg-zinc-900/50 rounded-2xl border ${idEdit === artikel.id ? 'border-red-600' : 'border-white/5'}`}>
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0 overflow-hidden">
                          {artikel.image ? <img src={artikel.image} className="w-full h-full object-cover" /> : <BookOpen className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="truncate text-xs font-bold text-white">{artikel.title}</div>
                          <div className="text-[10px] text-zinc-500">{artikel.date}</div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setArtikelBaru({ title: artikel.title, date: artikel.date || '', image: artikel.image || '', content: artikel.content || '' }); setIdEdit(artikel.id); setIsFormBuka(true); }} className="p-2 text-zinc-500 hover:text-white"><Edit className="w-3 h-3" /></button>
                          <button onClick={() => tanganiHapusArtikel(artikel.id)} className="p-2 text-zinc-500 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    ))}
                    {(!daftarArtikel || daftarArtikel.length === 0) && <p className="text-zinc-600 text-xs italic">Belum ada artikel.</p>}
                  </div>
                </div>
              )}
              {tabAdmin === 'subkategori' && (
                <div className="flex flex-col md:flex-row gap-10">
                  <div className={`flex-1 space-y-6 ${isFormBuka ? 'block' : 'hidden md:block'}`}>
                    <form onSubmit={handleSimpanSubKategori} className="space-y-4">
                      <h4 className="text-white font-bold uppercase tracking-widest text-xs">Tambah/Edit Album (Sub Kategori)</h4>
                      <input type="text" placeholder="Nama Album (e.g. Wisuda)" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={subKatBaru.name} onChange={e => setSubKatBaru({ ...subKatBaru, name: e.target.value })} required />
                      <select className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={subKatBaru.parent_category} onChange={e => setSubKatBaru({ ...subKatBaru, parent_category: e.target.value })}>
                        <option value="video">Untuk Kategori Video</option>
                        <option value="photo">Untuk Kategori Foto</option>
                        <option value="animation">Untuk Kategori Animasi</option>
                      </select>
                      <input type="url" placeholder="Cover Image URL (Opsional)" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={subKatBaru.cover_image || ''} onChange={e => setSubKatBaru({ ...subKatBaru, cover_image: e.target.value })} />
                      <button type="submit" className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs hover:bg-red-600 hover:text-white transition-all">{idEdit ? 'Simpan Perubahan' : 'Buat Album Baru'}</button>
                      <div className="flex gap-2 mt-2">
                        {idEdit && <button onClick={resetForms} type="button" className="flex-1 text-zinc-500 text-[10px] uppercase py-2 hover:bg-white/5 rounded-xl transition-all">Batal Edit</button>}
                        <button onClick={() => setIsFormBuka(false)} type="button" className="flex-1 md:hidden text-zinc-500 text-[10px] uppercase py-2 hover:bg-white/5 rounded-xl transition-all">Tutup Form</button>
                      </div>
                    </form>
                  </div>
                  <div className={`flex-1 space-y-3 pr-2 custom-scrollbar ${isAdminRoute ? '' : 'max-h-[500px] overflow-y-auto'} ${!isFormBuka ? 'block' : 'hidden md:block'}`}>
                    <button onClick={() => { resetForms(); setIsFormBuka(true); }} className="w-full md:hidden mb-4 bg-zinc-900 border border-white/5 hover:border-white/20 text-white rounded-2xl py-4 font-bold text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2">
                      <span className="text-red-500 text-sm leading-none">+</span> Buat Album Baru
                    </button>
                    {daftarSubKategori.map(sub => (
                      <div key={sub.id} className={`flex items-center gap-4 p-3 bg-zinc-900/50 rounded-2xl border ${idEdit === sub.id ? 'border-red-600' : 'border-white/5'}`}>
                        {sub.cover_image ? (
                          <img src={sub.cover_image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0"><Layout className="w-4 h-4" /></div>
                        )}
                        <div className="flex-1">
                          <div className="truncate text-xs font-bold text-white">{sub.name}</div>
                          <div className="text-[10px] text-zinc-500 uppercase">{sub.parent_category}</div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setSubKatBaru({ name: sub.name, parent_category: sub.parent_category, cover_image: sub.cover_image || '' }); setIdEdit(sub.id); }} className="p-2 text-zinc-500 hover:text-white"><Edit className="w-3 h-3" /></button>
                          <button onClick={() => tanganiHapusSubKategori(sub.id)} className="p-2 text-zinc-500 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    ))}
                    {daftarSubKategori.length === 0 && <p className="text-zinc-600 text-xs italic">Belum ada album sub kategori.</p>}
                  </div>
                </div>
              )}

              {tabAdmin === 'skills' && (
                <div className="flex flex-col md:flex-row gap-10">
                  <div className={`flex-1 space-y-6 ${isFormBuka ? 'block' : 'hidden md:block'}`}>
                    <form onSubmit={(e) => { e.preventDefault(); handleSimpanSkill(skillBaru, idEdit, resetForms); }} className="space-y-4">
                      <h4 className="text-white font-bold uppercase tracking-widest text-xs">Tambah/Edit Skill</h4>
                      <input type="text" placeholder="Nama Software (e.g. Photoshop)" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={skillBaru.title} onChange={e => setSkillBaru({ ...skillBaru, title: e.target.value })} required />
                      <div className="flex items-center gap-4">
                        <input type="range" min="0" max="100" className="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600" value={skillBaru.level} onChange={e => setSkillBaru({ ...skillBaru, level: parseInt(e.target.value) })} />
                        <span className="text-white font-bold text-xs w-10">{skillBaru.level}%</span>
                      </div>
                      <button type="submit" className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs hover:bg-red-600 hover:text-white transition-all"> {idEdit ? 'Simpan Skill' : 'Tambah Skill'}</button>
                      <div className="flex gap-2 mt-2">
                        {idEdit && <button onClick={resetForms} type="button" className="flex-1 text-zinc-500 text-[10px] uppercase py-2 hover:bg-white/5 rounded-xl transition-all">Batal Edit</button>}
                        <button onClick={() => setIsFormBuka(false)} type="button" className="flex-1 md:hidden text-zinc-500 text-[10px] uppercase py-2 hover:bg-white/5 rounded-xl transition-all">Tutup Form</button>
                      </div>
                    </form>
                  </div>
                  <div className={`flex-1 space-y-3 pr-2 custom-scrollbar ${isAdminRoute ? '' : 'max-h-[500px] overflow-y-auto'} ${!isFormBuka ? 'block' : 'hidden md:block'}`}>
                    <button onClick={() => { resetForms(); setIsFormBuka(true); }} className="w-full md:hidden mb-4 bg-zinc-900 border border-white/5 hover:border-white/20 text-white rounded-2xl py-4 font-bold text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2">
                      <span className="text-red-500 text-sm leading-none">+</span> Tambah Skill Baru
                    </button>
                    {skills.map(item => (
                      <div key={item.id} className={`flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border ${idEdit === item.id ? 'border-red-600' : 'border-white/5'}`}>
                        <div>
                          <div className="text-xs font-bold text-white uppercase">{item.title}</div>
                          <div className="text-[10px] text-zinc-500">{item.level}% Mastery</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setSkillBaru(item); setIdEdit(item.id); setIsFormBuka(true); }} className="text-zinc-500 hover:text-white"><Edit className="w-3 h-3" /></button>
                          <button onClick={() => tanganiHapusSkill(item.id)} className="text-zinc-500 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tabAdmin === 'journey' && (
                <div className="flex flex-col md:flex-row gap-10">
                  <div className={`flex-1 space-y-6 ${isFormBuka ? 'block' : 'hidden md:block'}`}>
                    <form onSubmit={(e) => { e.preventDefault(); handleSimpanExperience(expBaru, idEdit, resetForms); }} className="space-y-4">
                      <h4 className="text-white font-bold uppercase tracking-widest text-xs">Tambah/Edit Journey</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Tahun (e.g. 2023-Now)" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={expBaru.year} onChange={e => setExpBaru({ ...expBaru, year: e.target.value })} required />
                        <select className="bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={expBaru.icon} onChange={e => setExpBaru({ ...expBaru, icon: e.target.value })}><option value="Camera">Camera Icon</option><option value="Palette">Palette Icon</option><option value="Play">Play Icon</option><option value="Other">Other</option></select>
                      </div>
                      <input type="text" placeholder="Posisi / Judul" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={expBaru.title} onChange={e => setExpBaru({ ...expBaru, title: e.target.value })} required />
                      <input type="text" placeholder="Perusahaan / Tempat" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={expBaru.company} onChange={e => setExpBaru({ ...expBaru, company: e.target.value })} required />
                      <textarea placeholder="Deskripsi Singkat" rows="3" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={expBaru.description} onChange={e => setExpBaru({ ...expBaru, description: e.target.value })} />
                      <button type="submit" className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs hover:bg-red-600 hover:text-white transition-all"> {idEdit ? 'Simpan Journey' : 'Tambah Journey'}</button>
                      <div className="flex gap-2 mt-2">
                        {idEdit && <button onClick={resetForms} type="button" className="flex-1 text-zinc-500 text-[10px] uppercase py-2 hover:bg-white/5 rounded-xl transition-all">Batal Edit</button>}
                        <button onClick={() => setIsFormBuka(false)} type="button" className="flex-1 md:hidden text-zinc-500 text-[10px] uppercase py-2 hover:bg-white/5 rounded-xl transition-all">Tutup Form</button>
                      </div>
                    </form>
                  </div>
                  <div className={`flex-1 space-y-4 pr-2 custom-scrollbar ${isAdminRoute ? '' : 'max-h-[500px] overflow-y-auto'} ${!isFormBuka ? 'block' : 'hidden md:block'}`}>
                    <button onClick={() => { resetForms(); setIsFormBuka(true); }} className="w-full md:hidden mb-4 bg-zinc-900 border border-white/5 hover:border-white/20 text-white rounded-2xl py-4 font-bold text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2">
                      <span className="text-red-500 text-sm leading-none">+</span> Tambah Journey Baru
                    </button>
                    {experiences.map(item => (
                      <div key={item.id} className={`p-4 bg-zinc-900/50 rounded-2xl border ${idEdit === item.id ? 'border-red-600' : 'border-white/5'} hover:bg-zinc-900 transition-colors`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black font-mono text-zinc-500 border border-white/10 px-2 py-0.5 rounded-full">{item.year}</span>
                          <div className="flex gap-2">
                            <button onClick={() => { setExpBaru(item); setIdEdit(item.id); setIsFormBuka(true); }} className="text-zinc-500 hover:text-white"><Edit className="w-3 h-3" /></button>
                            <button onClick={() => tanganiHapusExperience(item.id)} className="text-zinc-500 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                        <h4 className="text-xs font-black text-white uppercase italic">{item.title}</h4>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">{item.company}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tabAdmin === 'config' && (
                <div className="max-w-2xl mx-auto space-y-8 pb-10">
                  <div className="p-8 bg-zinc-900/50 rounded-[2.5rem] border border-white/5 space-y-6">
                    <h4 className="text-white font-bold uppercase tracking-widest text-xs border-b border-white/5 pb-4 mb-4">Global Text Config</h4>

                    <div className="space-y-4">
                      <div className="space-y-1"><label className="text-[10px] text-zinc-500 uppercase font-bold">Navbar & Footer</label>
                        <input type="email" placeholder="Email Contact" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" value={configSitus.email || ''} onChange={e => setConfigSitus({ ...configSitus, email: e.target.value })} />
                      </div>
                      <div className="space-y-1"><label className="text-[10px] text-zinc-500 uppercase font-bold">Home: Hero Section</label>
                        <input type="text" placeholder="Tagline (e.g. Visual Artist • Malang)" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" value={configSitus.heroTagline || ''} onChange={e => setConfigSitus({ ...configSitus, heroTagline: e.target.value })} />
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <input type="text" placeholder="Title Line 1 (e.g. RFX)" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" value={configSitus.heroTitle1 || ''} onChange={e => setConfigSitus({ ...configSitus, heroTitle1: e.target.value })} />
                          <input type="text" placeholder="Title Line 2 (e.g. VISUAL)" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" value={configSitus.heroTitle2 || ''} onChange={e => setConfigSitus({ ...configSitus, heroTitle2: e.target.value })} />
                        </div>
                      </div>

                      <div className="space-y-1"><label className="text-[10px] text-zinc-500 uppercase font-bold">Home: About Section</label>
                        <input type="text" placeholder="Caption Besar" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" value={configSitus.homeCaption || ''} onChange={e => setConfigSitus({ ...configSitus, homeCaption: e.target.value })} />
                        <textarea placeholder="Deskripsi Bio Singkat" rows="3" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs mt-2" value={configSitus.homeDescription || ''} onChange={e => setConfigSitus({ ...configSitus, homeDescription: e.target.value })} />
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <input type="text" placeholder="Stat 1 (e.g. 40+)" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" value={configSitus.statClients || ''} onChange={e => setConfigSitus({ ...configSitus, statClients: e.target.value })} />
                          <input type="text" placeholder="Stat 2 (e.g. 50+)" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" value={configSitus.statProjects || ''} onChange={e => setConfigSitus({ ...configSitus, statProjects: e.target.value })} />
                          <input type="text" placeholder="Stat 3 (e.g. 4+)" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" value={configSitus.statYears || ''} onChange={e => setConfigSitus({ ...configSitus, statYears: e.target.value })} />
                        </div>
                      </div>

                      <div className="space-y-1"><label className="text-[10px] text-zinc-500 uppercase font-bold">Home: Journey Section</label>
                        <input type="text" placeholder="Quote Pendek" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" value={configSitus.aboutQuote || ''} onChange={e => setConfigSitus({ ...configSitus, aboutQuote: e.target.value })} />
                      </div>

                      <div className="space-y-1"><label className="text-[10px] text-zinc-500 uppercase font-bold">Portofolio Section</label>
                        <input type="text" placeholder="Portfolio Title" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" value={configSitus.portfolioTitle || ''} onChange={e => setConfigSitus({ ...configSitus, portfolioTitle: e.target.value })} />
                      </div>

                      <div className="space-y-1"><label className="text-[10px] text-zinc-500 uppercase font-bold">Contact Section</label>
                        <input type="text" placeholder="Status (e.g. Open For Commission)" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" value={configSitus.contactStatus || ''} onChange={e => setConfigSitus({ ...configSitus, contactStatus: e.target.value })} />
                        <input type="text" placeholder="Title (e.g. Mari Berkarya)" className="w-full mt-2 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" value={configSitus.contactTitle || ''} onChange={e => setConfigSitus({ ...configSitus, contactTitle: e.target.value })} />
                      </div>

                      <div className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-2xl">
                        <p className="text-xs text-blue-300">💡 Instagram Grid diatur di tab terpisah <strong>Instagram</strong>. Klik tab Instagram untuk atur profile dan 9 post grid.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-zinc-900/50 rounded-[2.5rem] border border-white/5 space-y-6">
                    <h4 className="text-white font-bold uppercase tracking-widest text-xs border-b border-white/5 pb-4 mb-4">Gambar Tampilan Utama</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block mb-2">Background Hero</span>
                        <div className="aspect-[4/5] bg-black/50 rounded-2xl border border-white/10 overflow-hidden relative group">
                          {configSitus.heroImage ? <img src={configSitus.heroImage} className="w-full h-full object-cover opacity-50" alt="" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600">Belum ada gambar</div>}
                          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer text-[10px] font-bold text-white uppercase tracking-widest bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-colors">
                              Ubah Foto
                              <input type="file" className="hidden" accept="image/*" onChange={async e => {
                                const file = e.target.files[0]; if (!file) return;
                                try { const url = await uploadFotoCloudinary(file); setConfigSitus({ ...configSitus, heroImage: url }); }
                                catch (err) { alert(err); }
                              }} />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block mb-2">Foto About (Hitam Putih)</span>
                        <div className="aspect-[4/5] bg-black/50 rounded-2xl border border-white/10 overflow-hidden relative group">
                          {configSitus.aboutImage ? <img src={configSitus.aboutImage} className="w-full h-full object-cover grayscale" alt="" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600">Belum ada gambar</div>}
                          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer text-[10px] font-bold text-white uppercase tracking-widest bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-colors">
                              Ubah Foto
                              <input type="file" className="hidden" accept="image/*" onChange={async e => {
                                const file = e.target.files[0]; if (!file) return;
                                try { const url = await uploadFotoCloudinary(file); setConfigSitus({ ...configSitus, aboutImage: url }); }
                                catch (err) { alert(err); }
                              }} />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleSimpanConfig} className="w-full bg-white text-black py-5 rounded-[2rem] font-black uppercase text-xs hover:bg-red-600 hover:text-white transition-all shadow-xl">
                    Simpan Semua Perubahan Tampilan
                  </button>
                </div>
              )}

              {tabAdmin === 'ig' && (
                <IGLayout
                  instagramConfig={instagramConfig}
                  setInstagramConfig={setInstagramConfig}
                  handleSimpanInstagram={handleSimpanInstagram}
                />
              )}

              {tabAdmin === 'pricelist' && (
                <div className="flex flex-col md:flex-row gap-10">
                  <div className={`flex-1 space-y-6 ${isFormBuka ? 'block' : 'hidden md:block'}`}>
                    <form onSubmit={(e) => { e.preventDefault(); handleSimpanPricelist(pricelistBaru, idEdit).then(resetForms); }} className="space-y-4">
                      <h4 className="text-white font-bold uppercase tracking-widest text-xs">Tambah/Edit Pricelist Kategori</h4>

                      {/* PDF EXTRACTOR BUTTON */}
                      <div className="p-4 rounded-2xl border border-dashed border-blue-500/50 bg-blue-500/5">
                        <label className="cursor-pointer flex items-center justify-center gap-2">
                          {isPdfExtracting ? (
                            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest animate-pulse">Sedang Ekstrak PDF (Tunggu bentar)...</span>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-blue-400" />
                              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest hover:text-blue-300">Auto-Isi dari PDF (AI)</span>
                            </>
                          )}
                          <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfExtract} disabled={isPdfExtracting} />
                        </label>
                        <p className="text-[8px] text-zinc-500 mt-2 text-center">Upload pricelist PDF kamu, AI akan otomatis isi form di bawah.</p>
                      </div>

                      <input type="text" placeholder="Nama Kategori (e.g. Wedding, Event)" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={pricelistBaru.title} onChange={e => setPricelistBaru({ ...pricelistBaru, title: e.target.value })} required />
                      <input type="text" placeholder="Subtitle Pendek" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs" value={pricelistBaru.subtitle} onChange={e => setPricelistBaru({ ...pricelistBaru, subtitle: e.target.value })} />

                      <div className="space-y-2">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block">Paket (JSON / AI Extracted)</span>
                        <textarea placeholder='[{"name": "Reguler", "price": "1jt", "features": ["feat1"]}]' rows="5" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs font-mono" value={JSON.stringify(pricelistBaru.packages, null, 2)} onChange={e => { try { setPricelistBaru({ ...pricelistBaru, packages: JSON.parse(e.target.value) }); } catch (err) { } }} />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" placeholder='["Info 1", "Info 2"]' className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs font-mono" value={JSON.stringify(pricelistBaru.extra_info)} onChange={e => { try { setPricelistBaru({ ...pricelistBaru, extra_info: JSON.parse(e.target.value) }); } catch (err) { } }} />
                        <input type="text" placeholder='["Syarat 1", "Syarat 2"]' className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs font-mono" value={JSON.stringify(pricelistBaru.terms)} onChange={e => { try { setPricelistBaru({ ...pricelistBaru, terms: JSON.parse(e.target.value) }); } catch (err) { } }} />
                      </div>

                      <button type="submit" className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs hover:bg-red-600 hover:text-white transition-all"> {idEdit ? 'Simpan Pricelist' : 'Tambah Pricelist'}</button>
                      <div className="flex gap-2 mt-2">
                        {idEdit && <button onClick={resetForms} type="button" className="flex-1 text-zinc-500 text-[10px] uppercase py-2 hover:bg-white/5 rounded-xl transition-all">Batal Edit</button>}
                        <button onClick={() => setIsFormBuka(false)} type="button" className="flex-1 md:hidden text-zinc-500 text-[10px] uppercase py-2 hover:bg-white/5 rounded-xl transition-all">Tutup Form</button>
                      </div>
                    </form>
                  </div>

                  <div className={`flex-1 space-y-4 pr-2 custom-scrollbar ${isAdminRoute ? '' : 'max-h-[500px] overflow-y-auto'} ${!isFormBuka ? 'block' : 'hidden md:block'}`}>
                    <button onClick={() => { resetForms(); setIsFormBuka(true); }} className="w-full md:hidden mb-4 bg-zinc-900 border border-white/5 hover:border-white/20 text-white rounded-2xl py-4 font-bold text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2">
                      <span className="text-red-500 text-sm leading-none">+</span> Tambah Pricelist
                    </button>
                    {daftarPricelist.map(item => (
                      <div key={item.id} className={`p-4 bg-zinc-900/50 rounded-2xl border ${idEdit === item.id ? 'border-red-600' : 'border-white/5'} hover:bg-zinc-900 transition-colors`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xs font-black text-white uppercase">{item.title}</h4>
                          <div className="flex gap-2">
                            <button onClick={() => { setPricelistBaru(item); setIdEdit(item.id); setIsFormBuka(true); }} className="text-zinc-500 hover:text-white"><Edit className="w-3 h-3" /></button>
                            <button onClick={() => tanganiHapusPricelist(item.id)} className="text-zinc-500 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                        <p className="text-[10px] text-zinc-500">{item.packages.length} Paket Tersedia</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelAdmin;
