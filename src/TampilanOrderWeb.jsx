import React, { useState, useEffect } from 'react';
import { ChevronLeft, ExternalLink, X, Bell } from 'lucide-react';

const TampilanOrderWeb = ({ navigateTo, templates }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isCheckout, setIsCheckout] = useState(false);
  const [showNotif, setShowNotif] = useState(true);

  const dismissNotif = () => {
    setShowNotif(false);
  };

  // Checkout Form States
  const [checkoutNama, setCheckoutNama] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutTelp, setCheckoutTelp] = useState('');
  const [checkoutPesan, setCheckoutPesan] = useState('');

  // Invoice states
  const [invoiceDicetak, setInvoiceDicetak] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const cekInAppBrowser = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return /Instagram|FBAN|FBAV|TikTok|Line/i.test(ua);
  };

  useEffect(() => {
    // Get template id from URL
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get('id');
    
    if (templateId) {
      const template = templates.find(t => t.id.toString() === templateId);
      if (template) {
        setSelectedTemplate(template);
        setIsCheckout(true);
        
        // Generate Invoice ID & Date
        const rand = Math.floor(100000 + Math.random() * 900000);
        setInvoiceId(`RFX-INV-${rand}`);

        const formattedDate = new Date().toLocaleDateString('id-ID', {
          day: 'numeric', month: 'long', year: 'numeric'
        });
        setInvoiceDate(formattedDate);
      }
    } else {
      setIsCheckout(false);
      setSelectedTemplate(null);
    }
  }, [templates]);

  const tanganiCetakInvoice = (e) => {
    e.preventDefault();
    if (!checkoutNama || !checkoutEmail || !checkoutTelp) {
      alert("Harap isi semua field wajib (Nama, Email, dan Telepon)!");
      return;
    }

    setInvoiceDicetak(true);

    if (cekInAppBrowser()) {
      setShowInvoiceModal(true);
      return;
    }

    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'absolute';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = 'none';
    document.body.appendChild(printIframe);

    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${invoiceId}</title>
        <style>
          body { font-family: 'Space Grotesk', -apple-system, sans-serif; background: #ffffff; color: #111111; margin: 0; padding: 40px; }
          .invoice-box { max-width: 800px; margin: auto; border: 1px solid #eee; padding: 30px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #dc2626; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: 900; font-style: italic; letter-spacing: -1px; color: #111; }
          .logo span { color: #dc2626; }
          .invoice-title { font-size: 32px; font-weight: 900; text-transform: uppercase; text-align: right; margin: 0; }
          .inv-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .inv-col { width: 48%; }
          .inv-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 4px; font-weight: bold; }
          .inv-value { font-size: 14px; margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          th { background: #f8f9fa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
          td { padding: 15px 12px; border-bottom: 1px solid #eee; font-size: 14px; }
          .total-row { font-weight: bold; font-size: 16px; border-top: 2px solid #111; }
          .total-price { color: #dc2626; font-size: 20px; font-weight: 900; }
          .payment-info { background: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 12px; padding: 20px; margin-top: 30px; }
          .payment-title { font-weight: bold; font-size: 14px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
          .payment-item { margin-bottom: 10px; font-size: 13px; }
          .payment-item strong { display: inline-block; width: 120px; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
          @media print { body { padding: 0; } .invoice-box { border: none; box-shadow: none; padding: 0; } }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div class="logo">RFX<span>.VISUAL</span></div>
            <div>
              <h1 class="invoice-title">Invoice</h1>
              <div style="font-size: 12px; text-align: right; color: #555;">No. ${invoiceId}</div>
            </div>
          </div>
          
          <div class="inv-details">
            <div class="inv-col">
              <div class="inv-label">Pelanggan</div>
              <div class="inv-value"><strong>${checkoutNama}</strong><br>Email: ${checkoutEmail}<br>Telp/WA: ${checkoutTelp}</div>
            </div>
            <div class="inv-col" style="text-align: right;">
              <div class="inv-label">Tanggal</div>
              <div class="inv-value">${invoiceDate}</div>
              <div class="inv-label" style="margin-top: 15px;">Kepada</div>
              <div class="inv-value"><strong>RFX VISUAL</strong><br>Malang, Jawa Timur</div>
            </div>
          </div>

          <table>
            <thead>
              <tr><th>Deskripsi</th><th style="text-align: right;">Total</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${selectedTemplate.title}</strong><br><span style="font-size: 11px; color: #666;">Repo: ${selectedTemplate.githubUrl}</span></td>
                <td style="text-align: right;">${selectedTemplate.price}</td>
              </tr>
              <tr class="total-row">
                <td style="text-align: right; padding-top: 20px;">Total Tagihan:</td>
                <td style="text-align: right; padding-top: 20px;" class="total-price">${selectedTemplate.price}</td>
              </tr>
            </tbody>
          </table>

          <div class="payment-info">
            <div class="payment-title">Metode Pembayaran</div>
            <div class="payment-item"><strong>Bank Mandiri</strong> : 123-456-7890 (a.n RFX VISUAL)</div>
            <div class="payment-item"><strong>SeaBank</strong> : 987-654-3210 (a.n RFX VISUAL)</div>
            <div class="payment-item"><strong>ShopeePay</strong> : 085731021469</div>
            <div class="payment-item"><strong>QRIS</strong> : Hubungi WhatsApp untuk Barcode QRIS</div>
            <p style="margin-top: 15px; font-size: 11px; color: #666;">*Harap simpan invoice ini dan sertakan bukti transfer saat konfirmasi melalui WhatsApp.</p>
          </div>

          <div class="footer">Terima kasih telah berbelanja di RFX VISUAL.<br>Invoice ini sah dan digenerate otomatis oleh sistem.</div>
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;

    const iframeDoc = printIframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(content);
    iframeDoc.close();

    // Cleanup iframe
    setTimeout(() => {
      if (document.body.contains(printIframe)) {
        document.body.removeChild(printIframe);
      }
    }, 10000);

    setInvoiceDicetak(true);
  };

  const kirimKeWhatsapp = () => {
    if (!invoiceDicetak) {
      alert("Silakan cetak/simpan invoice terlebih dahulu!");
      return;
    }
    
    // Matikan modal jika lanjut WA
    setShowInvoiceModal(false);

    const pesanFormatted = `Halo RFX VISUAL,
Saya ingin mengkonfirmasi pemesanan Web Store:

*ID INVOICE:* ${invoiceId}
*Tanggal:* ${invoiceDate}

*DETAIL PEMESAN:*
- Nama: ${checkoutNama}
- Email: ${checkoutEmail}
- No. WA: ${checkoutTelp}

*DETAIL PESANAN:*
- Produk: ${selectedTemplate?.title}
- Harga: ${selectedTemplate?.price}
- Link GitHub: ${selectedTemplate?.githubUrl}

*PESAN TAMBAHAN:*
${checkoutPesan || '-'}

Saya melampirkan file PDF Invoice dan Bukti Transfer. Mohon segera diproses. Terima kasih!`;

    const encodedText = encodeURIComponent(pesanFormatted);
    const waUrl = `https://wa.me/6285731021469?text=${encodedText}`;

    window.open(waUrl, '_blank');
  };

  // ==============================================
  // VIEW: CHECKOUT FORM
  // ==============================================
  if (isCheckout && selectedTemplate) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden pt-20 pb-10 px-6">
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
          
          {/* Header Back */}
          <button onClick={() => navigateTo('/orderweb')} className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest font-bold flex items-center gap-2 self-start">
            <ChevronLeft className="w-3 h-3" /> Kembali ke Katalog Web
          </button>

          <div className="bg-[#0d0d0d] border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="mb-8">
              <p className="text-[10px] text-red-500 uppercase tracking-widest font-semibold mb-1">Formulir Checkout</p>
              <h3 className="text-2xl font-black text-white uppercase">Order <span className="text-red-500">{selectedTemplate.title}</span></h3>
            </div>

            <form onSubmit={tanganiCetakInvoice} className="space-y-5">
              {/* Form Fields */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase font-bold">Nama Lengkap *</label>
                <input type="text" required placeholder="Masukkan nama lengkap Anda" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors" value={checkoutNama} onChange={e => setCheckoutNama(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase font-bold">Email *</label>
                <input type="email" required placeholder="contoh@email.com" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors" value={checkoutEmail} onChange={e => setCheckoutEmail(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase font-bold">Nomor WhatsApp / Telp *</label>
                <input type="tel" required placeholder="Contoh: 085731021469" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors" value={checkoutTelp} onChange={e => setCheckoutTelp(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Kategori Produk</label>
                  <input type="text" readOnly className="w-full bg-zinc-900/30 border border-zinc-800/80 rounded-xl px-4 py-3 text-zinc-500 text-xs outline-none cursor-not-allowed" value="Portfolio Statis" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Produk Pilihan</label>
                  <input type="text" readOnly className="w-full bg-zinc-900/30 border border-zinc-800/80 rounded-xl px-4 py-3 text-zinc-500 text-xs outline-none cursor-not-allowed" value={selectedTemplate.title} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase font-bold">Pesan / Catatan Tambahan</label>
                <textarea rows="3" placeholder="Tuliskan catatan tambahan jika ada..." className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors" value={checkoutPesan} onChange={e => setCheckoutPesan(e.target.value)} />
              </div>

              <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800/50 mt-6">
                <div className="flex justify-between text-xs text-zinc-400 font-medium mb-2">
                  <span>Harga Template:</span><span className="text-white font-bold">{selectedTemplate.price}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400 font-medium pb-3 border-b border-white/5 mb-3">
                  <span>Metode Pembayaran:</span><span className="text-white">Mandiri / SeaBank / ShopeePay / QRIS</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-white font-bold uppercase">Total Pembayaran:</span>
                  <span className="text-red-500 font-mono font-black text-xl">{selectedTemplate.price}</span>
                </div>
              </div>

              <button type="submit" className="w-full py-4 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4">
                Cetak Invoice (Wajib)
              </button>
            </form>

            <div className="pt-3 border-t border-white/5 mt-4">
              <button onClick={kirimKeWhatsapp} disabled={!invoiceDicetak} className={`w-full py-4 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${invoiceDicetak ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/10' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800/80'}`}>
                Kirim Pesanan ke WhatsApp
              </button>
            </div>
            {!invoiceDicetak && <p className="text-[10px] text-center text-zinc-500 italic mt-3">*Anda harus menekan "Cetak Invoice" terlebih dahulu untuk mengaktifkan tombol Kirim WhatsApp.</p>}
          </div>
        </div>

        {/* INVOICE MODAL (IN-APP BROWSER FALLBACK) */}
        {showInvoiceModal && (
          <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-md bg-white text-black p-6 md:p-8 rounded-2xl relative my-auto shadow-2xl">
              <button onClick={() => setShowInvoiceModal(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-zinc-100 rounded-full text-zinc-600 hover:bg-red-100 hover:text-red-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
              
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black italic tracking-tighter">RFX<span className="text-red-600">.VISUAL</span></h2>
                <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-widest">INVOICE: {invoiceId}</p>
              </div>

              <div className="space-y-3 text-sm mb-6 border-y border-zinc-200 py-4">
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Tanggal</p>
                  <p className="font-bold">{invoiceDate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Pelanggan</p>
                  <p className="font-bold">{checkoutNama}</p>
                  <p className="text-xs text-zinc-600">{checkoutEmail} | {checkoutTelp}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-2">Rincian Pesanan</p>
                <div className="flex justify-between font-bold text-sm">
                  <span>{selectedTemplate.title}</span>
                  <span className="text-red-600">{selectedTemplate.price}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">Portfolio Statis</p>
              </div>

              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 mb-6">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-2">Instruksi Pembayaran</p>
                <div className="text-[11px] text-zinc-700 leading-relaxed font-mono space-y-1">
                  <p><strong>Mandiri</strong> : 123-456-7890 (RFX VISUAL)</p>
                  <p><strong>SeaBank</strong> : 987-654-3210 (RFX VISUAL)</p>
                  <p><strong>ShopeePay</strong> : 085731021469</p>
                  <p><strong>QRIS</strong> : Hubungi WA untuk Barcode</p>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8 pt-4 border-t border-zinc-200">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Tagihan</span>
                <span className="text-2xl font-black text-red-600">{selectedTemplate.price}</span>
              </div>

              <div className="text-center">
                <p className="text-[11px] text-zinc-500 italic mb-4 font-medium px-4">
                  ⚠️ Silakan <b className="text-red-600">SCREENSHOT</b> invoice ini sebagai bukti pemesanan sebelum melanjutkan ke WhatsApp.
                </p>
                <button onClick={kirimKeWhatsapp} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/20">
                  Lanjut Kirim WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==============================================
  // VIEW: CATALOG WEB STORE
  // ==============================================
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden relative">

      {/* Notification Banner */}
      {showNotif && (
        <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 pt-4 animate-[slideDown_0.5s_ease-out]">
          <div className="w-full max-w-xl bg-gradient-to-r from-rose-950/90 via-zinc-900/95 to-zinc-900/95 backdrop-blur-2xl border border-rose-500/20 rounded-2xl p-5 shadow-[0_20px_60px_rgba(220,38,38,0.15)] relative overflow-hidden">
            {/* Glow */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-pink-500/10 rounded-full blur-3xl" />

            <button onClick={dismissNotif} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-zinc-800/80 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all z-10">
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-start gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-600/20">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="pr-6">
                <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1">Comingsoon: Wedding Website Templates</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                  Segera hadir koleksi template website undangan pernikahan digital yang elegan, interaktif, dan siap pakai. Nantikan rilisnya di Web Store kami!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-24 pb-28 px-6 max-w-6xl mx-auto relative z-10">
        
        {/* Header Back */}
        <button onClick={() => navigateTo('/rfx-links')} className="flex items-center gap-2 text-zinc-600 hover:text-zinc-300 transition-all text-[10px] uppercase tracking-[0.25em] font-semibold mb-8 group">
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Kembali ke Link-in-Bio
        </button>

        {/* Big title */}
        <div className="mb-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-red-500 mb-4">Web Store Katalog</p>
          <h2 className="text-[clamp(2.5rem,8vw,5rem)] font-black tracking-[-0.04em] leading-none uppercase">
            Order <span className="text-red-500">Website.</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl text-sm md:text-base font-light leading-relaxed mt-4">
            Beli template website portofolio statis (tanpa backend) premium, cepat, responsif, dan siap pakai. Cocok untuk memamerkan karya visual secara profesional.
          </p>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {templates.map((template) => (
            <div key={template.id} className="group bg-zinc-900/30 rounded-2xl overflow-hidden border border-zinc-800/60 hover:border-zinc-600 transition-all duration-500 flex flex-col h-full">
              {/* Thumbnail */}
              <div className="aspect-video bg-zinc-950 overflow-hidden relative">
                <img
                  src={template.image}
                  onError={(e) => e.target.src = 'https://placehold.co/800x450/111/222?text=Web+Template'}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                  alt={template.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 border border-white/5 text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                  Porto Statis
                </span>
              </div>

              {/* Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-white">{template.title}</h3>
                    <span className="text-red-500 font-mono font-bold text-base whitespace-nowrap">{template.price}</span>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed font-light mb-6">
                    {template.description}
                  </p>

                  {/* Features list */}
                  <div className="space-y-2 mb-6">
                    {template.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-white/5">
                  <a
                    href={template.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 rounded-xl border border-zinc-800 hover:border-zinc-600 text-center text-xs font-semibold text-zinc-400 hover:text-white transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    Demo <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => navigateTo('/orderweb?id=' + template.id)}
                    className="py-3 rounded-xl bg-red-600 hover:bg-red-500 text-center text-xs font-black text-white transition-all uppercase tracking-wider"
                  >
                    Beli
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TampilanOrderWeb;
