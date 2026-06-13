'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronLeft, AlertCircle } from 'lucide-react';
import { useData } from '@/components/DataProvider';

const FormBookingContent = () => {
  const { daftarPricelist = [] } = useData();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nama: '',
    instansi: '',
    whatsapp: '',
    kategoriAcara: '',
    paketPilihan: '',
    tanggal: '',
    lokasi: '',
    referensi: '',
    catatan: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('kategori');
    if (cat) {
      setFormData(prev => ({ ...prev, kategoriAcara: cat }));
    }
  }, []);

  const tanganiInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const lanjutStep = () => {
    if (step === 1 && (!formData.nama || !formData.whatsapp || !formData.kategoriAcara || !formData.paketPilihan)) {
      alert("Harap isi semua kolom wajib di Tahap 1.");
      return;
    }
    if (step === 2 && (!formData.tanggal || !formData.lokasi)) {
      alert("Harap isi semua kolom wajib di Tahap 2.");
      return;
    }
    setStep(prev => prev + 1);
  };

  const kembaliStep = () => setStep(prev => prev - 1);

  const kirimKeWhatsapp = (e) => {
    e.preventDefault();
    const hpAdmin = '6285731021469';
    const text = `Halo RFX VISUAL, saya ingin melakukan booking layanan.

*DATA PEMESAN:*
Nama: ${formData.nama}
Instansi/Pribadi: ${formData.instansi || '-'}
No. WhatsApp: ${formData.whatsapp}

*DETAIL BOOKING:*
Kategori Acara: ${formData.kategoriAcara}
Paket Pilihan: ${formData.paketPilihan}
Tanggal Pelaksanaan: ${formData.tanggal}
Lokasi Pelaksanaan: ${formData.lokasi}

*INFO TAMBAHAN:*
Referensi Visual: ${formData.referensi || '-'}
Catatan Tambahan: ${formData.catatan || '-'}

Mohon konfirmasi ketersediaan jadwal dan total biaya. Terima kasih!`;
    window.open(`https://wa.me/${hpAdmin}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const kategoriDipilih = daftarPricelist.find(k => k.title === formData.kategoriAcara);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans py-16 px-6 relative overflow-x-hidden">
      <div className="max-w-xl mx-auto">
        <button onClick={() => router.push('/rfx-links/pricelist')} className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest font-bold flex items-center gap-2 mb-10 transition-colors">
          <ChevronLeft className="w-3 h-3" /> Kembali ke Pricelist
        </button>

        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-2 tracking-tighter">Form Booking<span className="text-red-600">.</span></h2>
          <p className="text-zinc-500 text-xs font-light">Lengkapi form di bawah untuk mengecek ketersediaan jadwal kami.</p>
        </div>

        {/* PROGRESS BAR */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-red-600 shadow-[0_0_10px_#dc2626]' : 'bg-zinc-900'}`} />
          ))}
        </div>

        <form onSubmit={kirimKeWhatsapp} className="space-y-6 bg-zinc-900/30 border border-white/5 p-6 md:p-10 rounded-[2rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-[80px] -z-10 pointer-events-none" />

          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 mb-6">Tahap 1: Data Diri & Pilihan</h3>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Nama Lengkap <span className="text-red-500">*</span></label>
                <input type="text" name="nama" value={formData.nama} onChange={tanganiInput} required className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white text-xs outline-none focus:border-red-600 transition-colors" placeholder="Masukkan nama Anda" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Instansi / Brand (Opsional)</label>
                <input type="text" name="instansi" value={formData.instansi} onChange={tanganiInput} className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white text-xs outline-none focus:border-red-600 transition-colors" placeholder="Nama brand / instansi" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">No. WhatsApp <span className="text-red-500">*</span></label>
                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={tanganiInput} required className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white text-xs outline-none focus:border-red-600 transition-colors" placeholder="Contoh: 08123456789" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Kategori Acara <span className="text-red-500">*</span></label>
                <select name="kategoriAcara" value={formData.kategoriAcara} onChange={tanganiInput} required className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white text-xs outline-none focus:border-red-600 transition-colors appearance-none">
                  <option value="" disabled>Pilih Kategori</option>
                  {daftarPricelist.map(list => <option key={list.id} value={list.title}>{list.title}</option>)}
                </select>
              </div>
              {formData.kategoriAcara && kategoriDipilih && (
                <div className="space-y-1 animate-fade-in">
                  <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Paket Pilihan <span className="text-red-500">*</span></label>
                  <select name="paketPilihan" value={formData.paketPilihan} onChange={tanganiInput} required className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white text-xs outline-none focus:border-red-600 transition-colors appearance-none">
                    <option value="" disabled>Pilih Paket</option>
                    {kategoriDipilih.packages.map((pkg, idx) => <option key={idx} value={pkg.name}>{pkg.name} - {pkg.price}</option>)}
                  </select>
                </div>
              )}
              <button type="button" onClick={lanjutStep} className="w-full mt-8 bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all flex justify-center items-center gap-2">Selanjutnya <ChevronLeft className="w-4 h-4 rotate-180" /></button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 mb-6">Tahap 2: Detail Pelaksanaan</h3>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Tanggal Pelaksanaan <span className="text-red-500">*</span></label>
                <input type="date" name="tanggal" value={formData.tanggal} onChange={tanganiInput} required className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white text-xs outline-none focus:border-red-600 transition-colors [color-scheme:dark]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Lokasi Pelaksanaan <span className="text-red-500">*</span></label>
                <textarea name="lokasi" value={formData.lokasi} onChange={tanganiInput} required rows="3" className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white text-xs outline-none focus:border-red-600 transition-colors" placeholder="Alamat lengkap acara / venue" />
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={kembaliStep} className="w-1/3 bg-zinc-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-700 transition-all">Kembali</button>
                <button type="button" onClick={lanjutStep} className="w-2/3 bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all flex justify-center items-center gap-2">Selanjutnya <ChevronLeft className="w-4 h-4 rotate-180" /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 mb-6">Tahap 3: Info Tambahan</h3>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Referensi Visual (Opsional)</label>
                <input type="url" name="referensi" value={formData.referensi} onChange={tanganiInput} className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white text-xs outline-none focus:border-red-600 transition-colors" placeholder="Link referensi video/foto (jika ada)" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Catatan Tambahan (Opsional)</label>
                <textarea name="catatan" value={formData.catatan} onChange={tanganiInput} rows="4" className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white text-xs outline-none focus:border-red-600 transition-colors" placeholder="Pesan, request khusus, atau pertanyaan..." />
              </div>

              <div className="bg-red-600/10 border border-red-600/20 p-4 rounded-xl mt-6 flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-red-200 leading-relaxed font-light">Dengan mengirimkan form ini, Anda akan diarahkan ke WhatsApp untuk konfirmasi detail lebih lanjut bersama tim kami.</p>
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={kembaliStep} className="w-1/3 bg-zinc-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-700 transition-all">Kembali</button>
                <button type="submit" className="w-2/3 bg-red-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-500 transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)]">Kirim (WhatsApp) <CheckCircle2 className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </form>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}} />
    </div>
  );
};

export default FormBookingContent;
