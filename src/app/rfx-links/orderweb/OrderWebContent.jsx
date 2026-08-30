'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, X, ExternalLink, Download, CheckCircle2, ArrowRight } from 'lucide-react';
import { useData } from '@/components/DataProvider';

// Data Produk Lynk.id Style
const produkDigital = [
  {
    id: 'landing-page',
    kategori: 'Landing Page Portfolio',
    deskripsi: 'Cocok untuk menampilkan satu halaman lengkap yang ringkas, elegan, dan profesional.',
    image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80',
    varian: [
      {
        id: 'lp-basic',
        nama: 'Basic',
        hargaStr: 'Rp 400.000',
        tipeCheckout: 'custom_wa',
        fitur: ['Custom isian data', '4 Menu Navigasi', '2x Revisi'],
        badge: ''
      },
      {
        id: 'lp-full',
        nama: 'Full Treat',
        hargaStr: 'Rp 700.000',
        tipeCheckout: 'custom_wa',
        fitur: ['Full Custom Layout & UI/UX', 'Custom isian data', '2x Revisi', 'Bonus Domain .web.id'],
        badge: 'Best Seller'
      }
    ]
  },
  {
    id: 'template-pribadi',
    kategori: 'Template Website Portfolio',
    deskripsi: 'Source code template portfolio frontend siap pakai. Bisa disesuaikan sendiri atau kami bantu.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80',
    varian: [
      {
        id: 'tpl-basic',
        nama: 'Template Saja',
        hargaStr: 'Rp 200.000',
        tipeCheckout: 'direct_pakasir',
        linkPakasir: 'https://pakasir.com/checkout/KODE_PAKASIR_ANDA',
        fitur: ['File Source Code Mentah', 'Tanpa Customization', 'Pilih dari Katalog Template'],
        badge: 'Instant'
      },
      {
        id: 'tpl-full',
        nama: 'Full Custom',
        hargaStr: 'Rp 300.000',
        tipeCheckout: 'custom_wa',
        fitur: ['Custom UI/UX & Tata Letak', 'Custom Isian Data', 'Bonus Domain .my.id'],
        badge: 'Recommended'
      }
    ]
  },
  {
    id: 'paket-ekstra',
    kategori: 'Website Paket Ekstra',
    deskripsi: 'Website sistem dinamis dengan fitur kompleks seperti E-commerce, Blog, dan Admin Panel khusus.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
    varian: [
      {
        id: 'pe-full',
        nama: 'Paket Lengkap',
        hargaStr: 'Rp 1.500.000',
        perpanjangStr: 'Perpanjang tahunan: Rp 600.000',
        tipeCheckout: 'custom_wa',
        fitur: [
          '8 Menu', 'Gratis Domain .com', 'E-commerce / Blog', 
          'Integrasi Media Sosial', 'Panduan Edit (User/Video)', 'Pemasangan Google Map',
          'Statistic Kunjungan', 'Kontak Form', 'Panel Admin', 'Garansi Selamanya'
        ],
        badge: 'Premium'
      }
    ]
  }
];

const OrderWebContent = () => {
  const { isDark } = useData();
  const router = useRouter();
  const [selectedKategori, setSelectedKategori] = useState(null);
  const [selectedVarian, setSelectedVarian] = useState(null);

  const [checkoutNama, setCheckoutNama] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutTelp, setCheckoutTelp] = useState('');
  const [checkoutPesan, setCheckoutPesan] = useState('');
  const tanganiPilihVarian = (kategori, varian) => {
    if (varian.tipeCheckout === 'direct_pakasir') {
      router.push('/templates');
    } else {
      setSelectedKategori(kategori);
      setSelectedVarian(varian);
    }
  };

  const tanganiKirimKeWhatsapp = (e) => {
    e.preventDefault();
    if (!checkoutNama || !checkoutEmail || !checkoutTelp) {
      alert("Harap isi Nama Lengkap, Email, dan No. Telepon.");
      return;
    }

    const hpAdmin = '6285731021469';
    const text = `Halo RFX VISUAL, saya ingin berkonsultasi mengenai pemesanan Web Custom.

*DATA PEMESAN:*
Nama: ${checkoutNama}
Email: ${checkoutEmail}
No. WhatsApp: ${checkoutTelp}

*PRODUK DIPILIH:*
Kategori: ${selectedKategori.kategori}
Varian / Paket: ${selectedVarian.nama}
Estimasi Biaya: ${selectedVarian.hargaStr}
${selectedVarian.perpanjangStr ? `(${selectedVarian.perpanjangStr})` : ''}

*CATATAN KONSULTASI:*
${checkoutPesan || '-'}

Mohon arahannya untuk proses diskusi lebih lanjut. Terima kasih.`;

    window.open(`https://wa.me/${hpAdmin}?text=${encodeURIComponent(text)}`, '_blank');
    setSelectedKategori(null);
    setSelectedVarian(null);
  };

  return (
    <div className={`min-h-screen font-sans py-16 px-6 relative overflow-x-hidden transition-colors duration-500 bg-paper text-ink ${isDark ? 'theme-dark' : ''}`}>
      <div className="max-w-4xl mx-auto relative z-10">
        <button onClick={() => router.push('/')} className="mono-label-sm text-muted hover:text-ink flex items-center gap-2 mb-10 transition-colors">
          <ChevronLeft className="w-3 h-3" /> Kembali ke Bio
        </button>

        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line text-muted text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-ink animate-pulse"></span>
            Digital Solutions & Custom Web
          </div>
          <h2 className="text-4xl md:text-5xl font-display uppercase mb-4 tracking-tighter">Web Services<span className="text-ink">.</span></h2>
          <p className="text-sm font-light max-w-xl mx-auto leading-relaxed text-muted">Layanan pembuatan website custom profesional, dari Landing Page hingga Full CMS Terintegrasi. Temukan solusi digital terbaik Anda di sini.</p>
        </div>

        <div className="space-y-12">
          {produkDigital.map(produk => (
            <div key={produk.id} className="border rounded-lg overflow-hidden flex flex-col md:flex-row transition-all group shadow-sm hover:shadow-lg bg-paper-2 border-line hover:border-ink">
              {/* Gambar / Info Kategori */}
              <div className="md:w-5/12 bg-paper-2 relative overflow-hidden">
                <img src={produk.image} alt={produk.kategori} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h3 className="text-2xl font-display uppercase tracking-wide mb-2 text-white">{produk.kategori}</h3>
                  <p className="text-xs text-white/80 font-light leading-relaxed">{produk.deskripsi}</p>
                </div>
              </div>

              {/* Varian Pilihan */}
              <div className="md:w-7/12 p-8 flex flex-col justify-center bg-paper">
                <p className="mono-label-sm text-muted mb-6">Pilih Varian Paket</p>
                <div className="grid grid-cols-1 gap-4">
                  {produk.varian.map(varian => (
                    <div key={varian.id} className="relative border rounded-lg p-5 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-paper-2 border-line hover:border-ink shadow-sm">
                      {varian.badge && (
                        <div className="absolute -top-2.5 -right-2.5 bg-ink text-paper px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-lg z-10">
                          {varian.badge}
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h4 className="text-sm font-bold uppercase tracking-wider mb-1">{varian.nama}</h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                          {varian.fitur.map((f, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted">
                              <CheckCircle2 className="w-3 h-3 text-ink" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="w-full sm:w-auto flex flex-col items-start sm:items-end shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0 border-line">
                        <span className="text-lg font-black">{varian.hargaStr}</span>
                        {varian.perpanjangStr && <span className="text-[9px] text-muted italic mt-0.5">{varian.perpanjangStr}</span>}
                        <button 
                          onClick={() => tanganiPilihVarian(produk, varian)}
                          className={`mt-3 w-full sm:w-auto px-5 py-2.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${varian.tipeCheckout === 'direct_pakasir' ? 'bg-ink text-paper hover:bg-ink/85' : 'border border-ink text-ink hover:bg-ink hover:text-paper'}`}
                        >
                          {varian.tipeCheckout === 'direct_pakasir' ? 'Lihat Katalog Template' : 'Konsultasi (WA)'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Modal untuk Custom WA */}
      {selectedKategori && selectedVarian && (
        <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => { setSelectedKategori(null); setSelectedVarian(null); }}>
          <div className="relative w-full max-w-lg border border-line rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] bg-paper" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center border-line bg-paper-2">
              <div>
                <p className="mono-label-sm text-muted mb-0.5">Pengajuan Konsultasi</p>
                <h3 className="text-base font-bold line-clamp-1 text-ink">{selectedKategori.kategori} - {selectedVarian.nama}</h3>
              </div>
              <button onClick={() => { setSelectedKategori(null); setSelectedVarian(null); }} className="w-8 h-8 rounded-md border border-line flex items-center justify-center transition-all shrink-0 bg-paper text-muted hover:text-ink hover:bg-paper-2">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar p-6 space-y-4">
              <form onSubmit={tanganiKirimKeWhatsapp} className="space-y-4">
                <div className="space-y-1">
                  <label className="mono-label-sm text-muted">Nama Lengkap *</label>
                  <input type="text" required placeholder="Masukkan nama lengkap Anda" className="w-full border border-line rounded-lg px-4 py-3 text-xs text-ink outline-none focus:border-ink focus:outline-none transition-colors bg-paper" value={checkoutNama} onChange={e => setCheckoutNama(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="mono-label-sm text-muted">Email *</label>
                  <input type="email" required placeholder="contoh@email.com" className="w-full border border-line rounded-lg px-4 py-3 text-xs text-ink outline-none focus:border-ink focus:outline-none transition-colors bg-paper" value={checkoutEmail} onChange={e => setCheckoutEmail(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="mono-label-sm text-muted">Nomor WhatsApp *</label>
                  <input type="tel" required placeholder="Contoh: 085731021469" className="w-full border border-line rounded-lg px-4 py-3 text-xs text-ink outline-none focus:border-ink focus:outline-none transition-colors bg-paper" value={checkoutTelp} onChange={e => setCheckoutTelp(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="mono-label-sm text-muted">Catatan Konsep (Opsional)</label>
                  <textarea rows="3" placeholder="Ceritakan singkat gambaran website yang Anda inginkan..." className="w-full border border-line rounded-lg px-4 py-3 text-xs text-ink outline-none focus:border-ink focus:outline-none transition-colors bg-paper" value={checkoutPesan} onChange={e => setCheckoutPesan(e.target.value)} />
                </div>
                
                <div className="p-4 rounded-lg border border-line space-y-2 mt-2 bg-paper-2">
                  <div className="flex justify-between text-xs font-medium pb-2 border-b border-line text-muted"><span>Estimasi Harga:</span><span className="font-bold text-ink">{selectedVarian.hargaStr}</span></div>
                  <p className="text-[9px] text-muted leading-relaxed italic">*Harga final dan metode pembayaran akan didiskusikan lebih lanjut via WhatsApp bersama tim RFX Visual.</p>
                </div>
                
                <button type="submit" className="w-full py-4 rounded-md bg-ink text-paper hover:bg-ink/85 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg mt-6">
                  Kirim Pengajuan ke WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderWebContent;
