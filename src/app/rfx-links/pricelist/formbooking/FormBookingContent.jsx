'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronLeft, AlertCircle } from 'lucide-react';
import { useData } from '@/components/DataProvider';
import { normalizePricelist } from '@/utils/helpers';

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

  const normalizedPricelists = daftarPricelist.map(normalizePricelist);
  const kategoriDipilih = normalizedPricelists.find(k => k.title === formData.kategoriAcara);

  return (
    <div className="min-h-screen bg-paper text-ink theme-dark font-sans py-16 px-6 relative overflow-x-hidden">
      <div className="max-w-xl mx-auto">
        <button onClick={() => router.push('/pricelist')} className="mono-label-sm text-muted hover:text-ink flex items-center gap-2 mb-10 transition-colors">
          <ChevronLeft className="w-3 h-3" /> Kembali ke Pricelist
        </button>

        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-display uppercase mb-2 tracking-tighter">Form Booking<span className="text-ink">.</span></h2>
          <p className="text-muted text-xs font-light">Lengkapi form di bawah untuk mengecek ketersediaan jadwal kami.</p>
        </div>

        {/* PROGRESS BAR */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-ink' : 'bg-paper-2'}`} />
          ))}
        </div>

        <form onSubmit={kirimKeWhatsapp} className="space-y-6 bg-paper-2 border border-line p-6 md:p-10 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ink/5 rounded-full blur-[80px] -z-10 pointer-events-none" />

          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink border-b border-line pb-3 mb-6">Tahap 1: Data Diri & Pilihan</h3>
              <div className="space-y-1">
                <label className="mono-label-sm text-muted">Nama Lengkap <span className="text-ink">*</span></label>
                <input type="text" name="nama" value={formData.nama} onChange={tanganiInput} required className="w-full bg-paper border border-line rounded-lg px-5 py-4 text-ink text-xs outline-none focus:border-ink focus:outline-none transition-colors" placeholder="Masukkan nama Anda" />
              </div>
              <div className="space-y-1">
                <label className="mono-label-sm text-muted">Instansi / Brand (Opsional)</label>
                <input type="text" name="instansi" value={formData.instansi} onChange={tanganiInput} className="w-full bg-paper border border-line rounded-lg px-5 py-4 text-ink text-xs outline-none focus:border-ink focus:outline-none transition-colors" placeholder="Nama brand / instansi" />
              </div>
              <div className="space-y-1">
                <label className="mono-label-sm text-muted">No. WhatsApp <span className="text-ink">*</span></label>
                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={tanganiInput} required className="w-full bg-paper border border-line rounded-lg px-5 py-4 text-ink text-xs outline-none focus:border-ink focus:outline-none transition-colors" placeholder="Contoh: 08123456789" />
              </div>
              <div className="space-y-1">
                <label className="mono-label-sm text-muted">Kategori Acara <span className="text-ink">*</span></label>
                <select name="kategoriAcara" value={formData.kategoriAcara} onChange={tanganiInput} required className="w-full bg-paper border border-line rounded-lg px-5 py-4 text-ink text-xs outline-none focus:border-ink focus:outline-none transition-colors appearance-none">
                  <option value="" disabled>Pilih Kategori</option>
                  {normalizedPricelists.map(list => <option key={list.id} value={list.title}>{list.title}</option>)}
                </select>
              </div>
              {formData.kategoriAcara && kategoriDipilih && (
                <div className="space-y-1 animate-fade-in">
                  <label className="mono-label-sm text-muted">Paket Pilihan <span className="text-ink">*</span></label>
                  <select name="paketPilihan" value={formData.paketPilihan} onChange={tanganiInput} required className="w-full bg-paper border border-line rounded-lg px-5 py-4 text-ink text-xs outline-none focus:border-ink focus:outline-none transition-colors appearance-none">
                    <option value="" disabled>Pilih Paket</option>
                    {kategoriDipilih.packages.map((pkg, idx) => <option key={idx} value={pkg.name}>{pkg.name} - {pkg.price}</option>)}
                  </select>
                </div>
              )}
              <button type="button" onClick={lanjutStep} className="w-full mt-8 bg-ink text-paper py-4 rounded-md font-black uppercase tracking-widest text-xs hover:bg-ink/85 transition-all flex justify-center items-center gap-2">Selanjutnya <ChevronLeft className="w-4 h-4 rotate-180" /></button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink border-b border-line pb-3 mb-6">Tahap 2: Detail Pelaksanaan</h3>
              <div className="space-y-1">
                <label className="mono-label-sm text-muted">Tanggal Pelaksanaan <span className="text-ink">*</span></label>
                <input type="date" name="tanggal" value={formData.tanggal} onChange={tanganiInput} required className="w-full bg-paper border border-line rounded-lg px-5 py-4 text-ink text-xs outline-none focus:border-ink focus:outline-none transition-colors [color-scheme:dark]" />
              </div>
              <div className="space-y-1">
                <label className="mono-label-sm text-muted">Lokasi Pelaksanaan <span className="text-ink">*</span></label>
                <textarea name="lokasi" value={formData.lokasi} onChange={tanganiInput} required rows="3" className="w-full bg-paper border border-line rounded-lg px-5 py-4 text-ink text-xs outline-none focus:border-ink focus:outline-none transition-colors" placeholder="Alamat lengkap acara / venue" />
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={kembaliStep} className="w-1/3 border border-ink text-ink py-4 rounded-md font-bold uppercase tracking-widest text-[10px] hover:bg-ink hover:text-paper transition-all">Kembali</button>
                <button type="button" onClick={lanjutStep} className="w-2/3 bg-ink text-paper py-4 rounded-md font-black uppercase tracking-widest text-xs hover:bg-ink/85 transition-all flex justify-center items-center gap-2">Selanjutnya <ChevronLeft className="w-4 h-4 rotate-180" /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink border-b border-line pb-3 mb-6">Tahap 3: Info Tambahan</h3>
              <div className="space-y-1">
                <label className="mono-label-sm text-muted">Referensi Visual (Opsional)</label>
                <input type="url" name="referensi" value={formData.referensi} onChange={tanganiInput} className="w-full bg-paper border border-line rounded-lg px-5 py-4 text-ink text-xs outline-none focus:border-ink focus:outline-none transition-colors" placeholder="Link referensi video/foto (jika ada)" />
              </div>
              <div className="space-y-1">
                <label className="mono-label-sm text-muted">Catatan Tambahan (Opsional)</label>
                <textarea name="catatan" value={formData.catatan} onChange={tanganiInput} rows="4" className="w-full bg-paper border border-line rounded-lg px-5 py-4 text-ink text-xs outline-none focus:border-ink focus:outline-none transition-colors" placeholder="Pesan, request khusus, atau pertanyaan..." />
              </div>

              <div className="bg-paper border border-line p-4 rounded-lg mt-6 flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-ink shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted leading-relaxed font-light">Dengan mengirimkan form ini, Anda akan diarahkan ke WhatsApp untuk konfirmasi detail lebih lanjut bersama tim kami.</p>
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={kembaliStep} className="w-1/3 border border-ink text-ink py-4 rounded-md font-bold uppercase tracking-widest text-[10px] hover:bg-ink hover:text-paper transition-all">Kembali</button>
                <button type="submit" className="w-2/3 bg-ink text-paper py-4 rounded-md font-black uppercase tracking-widest text-xs hover:bg-ink/85 transition-all flex justify-center items-center gap-2">Kirim (WhatsApp) <CheckCircle2 className="w-4 h-4" /></button>
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
