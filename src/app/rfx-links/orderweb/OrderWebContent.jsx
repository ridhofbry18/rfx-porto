'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, X, ExternalLink, Download } from 'lucide-react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { defaultTemplates } from '@/utils/constants';

const OrderWebContent = () => {
  const router = useRouter();
  const templates = defaultTemplates; // Menggunakan template statis dari constants
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [checkoutNama, setCheckoutNama] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutTelp, setCheckoutTelp] = useState('');
  const [checkoutPesan, setCheckoutPesan] = useState('');
  const [invoiceDicetak, setInvoiceDicetak] = useState(false);

  const tanganiCetakInvoice = async (e) => {
    e.preventDefault();

    if (!checkoutNama || !checkoutEmail || !checkoutTelp) {
      alert("Harap isi Nama Lengkap, Email, dan No. Telepon.");
      return;
    }

    const orderId = `RFX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const tanggal = new Date().toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const invoiceContainer = document.createElement('div');
    invoiceContainer.style.width = '800px';
    invoiceContainer.style.padding = '40px';
    invoiceContainer.style.background = '#ffffff';
    invoiceContainer.style.color = '#000000';
    invoiceContainer.style.fontFamily = 'Arial, sans-serif';
    invoiceContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #dc2626; padding-bottom: 20px;">
        <h1 style="font-size: 32px; font-weight: 900; margin: 0; color: #000;">RFX<span style="color: #dc2626;">.VISUAL</span></h1>
        <p style="font-size: 14px; color: #666; margin: 5px 0 0 0; letter-spacing: 2px;">INVOICE PEMBELIAN</p>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
        <div>
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">DITAGIHKAN KEPADA:</p>
          <p style="margin: 0 0 3px 0; font-weight: bold; font-size: 16px;">${checkoutNama}</p>
          <p style="margin: 0 0 3px 0; font-size: 14px;">${checkoutEmail}</p>
          <p style="margin: 0 0 0 0; font-size: 14px;">${checkoutTelp}</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">INFO TAGIHAN:</p>
          <p style="margin: 0 0 3px 0; font-size: 14px;"><span style="font-weight: bold;">Order ID:</span> ${orderId}</p>
          <p style="margin: 0 0 0 0; font-size: 14px;"><span style="font-weight: bold;">Tanggal:</span> ${tanggal}</p>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
        <thead>
          <tr style="background-color: #f4f4f5;">
            <th style="padding: 15px; text-align: left; border-bottom: 2px solid #e4e4e7; font-size: 14px;">DESKRIPSI PRODUK</th>
            <th style="padding: 15px; text-align: center; border-bottom: 2px solid #e4e4e7; font-size: 14px;">KATEGORI</th>
            <th style="padding: 15px; text-align: right; border-bottom: 2px solid #e4e4e7; font-size: 14px;">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 20px 15px; border-bottom: 1px solid #e4e4e7;">
              <p style="font-weight: bold; font-size: 16px; margin: 0 0 5px 0;">${selectedTemplate.title}</p>
              <p style="font-size: 12px; color: #666; margin: 0;">Template Source Code Web Portfolio Statis Full Customization.</p>
            </td>
            <td style="padding: 20px 15px; text-align: center; border-bottom: 1px solid #e4e4e7; font-size: 14px;">Digital Product</td>
            <td style="padding: 20px 15px; text-align: right; border-bottom: 1px solid #e4e4e7; font-weight: bold; font-size: 16px;">${selectedTemplate.price}</td>
          </tr>
        </tbody>
      </table>

      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="width: 50%;">
          <p style="font-weight: bold; font-size: 14px; margin: 0 0 10px 0;">METODE PEMBAYARAN:</p>
          <p style="font-size: 12px; line-height: 1.6; color: #666; margin: 0;">Pembayaran dilakukan melalui transfer Bank/E-Wallet/QRIS.<br/>Detail rekening akan diberikan via WhatsApp Admin setelah<br/>konfirmasi invoice ini.</p>
        </div>
        <div style="width: 40%; background-color: #fafafa; padding: 20px; border-radius: 8px; border: 1px solid #e4e4e7;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <span style="font-size: 14px; color: #666;">Subtotal</span>
            <span style="font-weight: bold; font-size: 14px;">${selectedTemplate.price}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #e4e4e7; padding-top: 15px;">
            <span style="font-size: 16px; font-weight: bold;">TOTAL TAGIHAN</span>
            <span style="font-size: 24px; font-weight: 900; color: #dc2626;">${selectedTemplate.price}</span>
          </div>
        </div>
      </div>

      <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e4e4e7; padding-top: 20px;">
        <p style="margin: 0;">Simpan file invoice ini sebagai bukti pemesanan yang sah.</p>
        <p style="margin: 5px 0 0 0;">Terima kasih atas kepercayaan Anda kepada RFX Visual.</p>
      </div>
    `;

    document.body.appendChild(invoiceContainer);

    try {
      const canvas = await html2canvas(invoiceContainer, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_RFX_${orderId}.pdf`);

      setInvoiceDicetak(true);
      alert("Invoice berhasil dicetak! Silakan klik 'Kirim Pesanan ke WhatsApp' untuk melanjutkan.");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Gagal mencetak invoice. Silakan coba lagi.");
    } finally {
      document.body.removeChild(invoiceContainer);
    }
  };

  const kirimKeWhatsapp = (e) => {
    e.preventDefault();
    if (!invoiceDicetak) {
      alert("Cetak Invoice terlebih dahulu sebelum mengirim ke WhatsApp!");
      return;
    }

    const hpAdmin = '6285731021469';
    const text = `Halo RFX VISUAL, saya ingin mengonfirmasi pesanan Template Website saya.

*DATA PEMESAN:*
Nama: ${checkoutNama}
Email: ${checkoutEmail}
No. WhatsApp: ${checkoutTelp}

*PRODUK:*
Kategori: Portfolio Statis
Template: ${selectedTemplate.title}
Total Biaya: ${selectedTemplate.price}

*CATATAN:*
${checkoutPesan || '-'}

Saya telah mendownload invoice. Mohon info nomor rekening / QRIS untuk pembayaran. Terima kasih.`;

    window.open(`https://wa.me/${hpAdmin}?text=${encodeURIComponent(text)}`, '_blank');
    setSelectedTemplate(null);
    setInvoiceDicetak(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans py-16 px-6 relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => router.push('/rfx-links')} className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest font-bold flex items-center gap-2 mb-10 transition-colors">
          <ChevronLeft className="w-3 h-3" /> Kembali ke Bio
        </button>

        <div className="mb-16 text-center md:text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-blue-500 mb-4">Produk Digital</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tighter">Web Store<span className="text-blue-500">.</span></h2>
          <p className="text-zinc-400 text-sm font-light max-w-xl mx-auto md:mx-0">Pilih template website portofolio premium yang dirancang khusus untuk kreator visual. Tingkatkan profesionalitas Anda dengan satu kali bayar (Tanpa Biaya Bulanan).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(tpl => (
            <div key={tpl.id} className="bg-zinc-900/40 border border-white/5 hover:border-blue-500/30 rounded-[2rem] overflow-hidden transition-all group flex flex-col">
              <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                <img src={tpl.image} alt={tpl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <h3 className="text-xl font-black uppercase tracking-wide">{tpl.title}</h3>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest shadow-lg">PROMO</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6 flex-1 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                  {tpl.description}
                </p>

                <div className="space-y-2 mb-6">
                  {tpl.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-[10px] text-zinc-500 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mt-1 shrink-0"></div>
                      <span>{feat}</span>
                    </div>
                  ))}
                  {tpl.features.length > 3 && <div className="text-[10px] text-zinc-600 italic pl-3.5">+ {tpl.features.length - 3} fitur lainnya</div>}
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Harga Normal</p>
                    <p className="text-xs text-zinc-600 line-through font-mono">Rp 350.000</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-1">Sekarang Hanya</p>
                    <p className="text-2xl font-black text-white">{tpl.price}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a href={tpl.demoUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold uppercase tracking-widest transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> Preview Demo
                  </a>
                  <button onClick={() => { setSelectedTemplate(tpl); setInvoiceDicetak(false); }} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                    Beli Sekarang
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setSelectedTemplate(null)}>
          <div className="relative w-full max-w-lg bg-[#0d0d0d] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-blue-800/80 flex justify-between items-center bg-blue-950/40">
              <div>
                <p className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold mb-0.5">Formulir Checkout</p>
                <h3 className="text-base font-bold text-white">Pembelian {selectedTemplate.title}</h3>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar p-6 space-y-4">
              <form onSubmit={tanganiCetakInvoice} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Nama Lengkap *</label>
                  <input type="text" required placeholder="Masukkan nama lengkap Anda" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-blue-500 transition-colors" value={checkoutNama} onChange={e => setCheckoutNama(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Email *</label>
                  <input type="email" required placeholder="contoh@email.com" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-blue-500 transition-colors" value={checkoutEmail} onChange={e => setCheckoutEmail(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Nomor WhatsApp / Telp *</label>
                  <input type="tel" required placeholder="Contoh: 085731021469" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-blue-500 transition-colors" value={checkoutTelp} onChange={e => setCheckoutTelp(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">Kategori Produk</label>
                    <input type="text" readOnly className="w-full bg-zinc-900/30 border border-zinc-800/80 rounded-xl px-4 py-3 text-zinc-500 text-xs outline-none cursor-not-allowed" value="Portfolio Statis (No Backend)" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold">Produk Pilihan</label>
                    <input type="text" readOnly className="w-full bg-zinc-900/30 border border-zinc-800/80 rounded-xl px-4 py-3 text-zinc-500 text-xs outline-none cursor-not-allowed" value={selectedTemplate.title} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Pesan / Catatan Tambahan</label>
                  <textarea rows="2" placeholder="Tuliskan catatan tambahan jika ada..." className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-blue-500 transition-colors" value={checkoutPesan} onChange={e => setCheckoutPesan(e.target.value)} />
                </div>
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/50 space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400 font-medium"><span>Harga Template:</span><span className="text-white font-bold">{selectedTemplate.price}</span></div>
                  <div className="flex justify-between text-xs text-zinc-400 font-medium pb-2 border-b border-white/5"><span>Metode Pembayaran:</span><span className="text-white">Mandiri / SeaBank / ShopeePay / QRIS</span></div>
                  <div className="flex justify-between items-baseline pt-1"><span className="text-xs text-white font-bold">Total Pembayaran:</span><span className="text-blue-400 font-mono font-bold text-lg">{selectedTemplate.price}</span></div>
                </div>
                <button type="submit" className="w-full py-4 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg">
                  <Download className="w-4 h-4" /> Cetak Invoice (Wajib)
                </button>
              </form>
              <div className="pt-2 border-t border-white/5">
                <button onClick={kirimKeWhatsapp} disabled={!invoiceDicetak} className={`w-full py-4 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${invoiceDicetak ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-lg shadow-blue-600/10' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800/80'}`}>
                  Kirim Pesanan ke WhatsApp
                </button>
              </div>
              {!invoiceDicetak && <p className="text-[10px] text-center text-zinc-500 italic mt-2">*Anda harus menekan "Cetak Invoice" terlebih dahulu untuk mengaktifkan tombol Kirim WhatsApp.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderWebContent;
