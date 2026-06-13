import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

const TampilanFormBooking = ({ daftarPricelist, navigateTo }) => {
  const [nama, setNama] = useState('');
  const [noWa, setNoWa] = useState('');
  const [sosmed, setSosmed] = useState('');
  const [alamat, setAlamat] = useState('');
  
  // Date and Time
  const [tanggalMain, setTanggalMain] = useState('');
  const [tanggalOpsional, setTanggalOpsional] = useState('');
  const [jamMulai, setJamMulai] = useState('');
  const [jamSelesai, setJamSelesai] = useState('');

  // Category & Package selection
  const [kategori, setKategori] = useState('');
  const [paket, setPaket] = useState('');
  const [hargaManual, setHargaManual] = useState('');
  
  // DP Toggle
  const [isDp50, setIsDp50] = useState(false);

  // Manual input toggles
  const [isManualKategori, setIsManualKategori] = useState(false);
  const [isManualPaket, setIsManualPaket] = useState(false);

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
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('kategori');
    if (cat) {
      setKategori(cat);
      const pkg = urlParams.get('paket');
      if (pkg) setPaket(pkg);
    }
    
    // Generate Invoice ID
    const rand = Math.floor(100000 + Math.random() * 900000);
    setInvoiceId(`RFX-BKG-${rand}`);
    
    const formattedDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    setInvoiceDate(formattedDate);
  }, []);

  // Find selected category object to get packages
  const activeCategoryObj = daftarPricelist.find(list => list.title === kategori);
  const activePackages = activeCategoryObj ? activeCategoryObj.packages : [];

  // Determine current price
  let currentPrice = "Menunggu Konfirmasi";
  if (!isManualPaket) {
    const selectedPkgObj = activePackages.find(p => p.name === paket);
    if (selectedPkgObj && selectedPkgObj.price) {
      currentPrice = selectedPkgObj.price;
    }
  } else if (hargaManual) {
    currentPrice = hargaManual;
  }

  // Calculate DP
  let dpValue = "-";
  let sisaTagihan = currentPrice;
  // Extract numbers from string
  const numMatches = currentPrice.match(/\d/g);
  if (numMatches && numMatches.length > 0) {
    // Reconstruct the number string. If it ends in 'K' or 'k', we can multiply by 1000.
    // However, just stripping non-digits is safest for standard formatted numbers like 1.500.000
    let cleanNumStr = currentPrice.replace(/[^0-9]/g, '');
    
    // Check if the original string ended with 'k' or 'K' to handle "100k" formats
    if (currentPrice.toLowerCase().endsWith('k') && cleanNumStr.length <= 4) {
      cleanNumStr = cleanNumStr + "000";
    }

    if (cleanNumStr) {
      const totalAngka = parseInt(cleanNumStr, 10);
      if (!isNaN(totalAngka) && totalAngka > 0) {
        const dpAngka = totalAngka / 2;
        dpValue = 'Rp ' + dpAngka.toLocaleString('id-ID');
        sisaTagihan = 'Rp ' + (totalAngka - dpAngka).toLocaleString('id-ID');
      } else {
        dpValue = 'Rp 0';
        sisaTagihan = 'Rp 0';
      }
    }
  }

  const tanganiCetakInvoice = (e) => {
    e.preventDefault();
    if (!nama || !noWa || !tanggalMain || !jamMulai || !jamSelesai || !kategori || !paket) {
      alert("Harap isi semua field wajib (Nama, No WA, Tanggal, Jam, Kategori, Paket)!");
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
        <title>Booking Invoice - ${invoiceId}</title>
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
              <h1 class="invoice-title">Booking</h1>
              <div style="font-size: 12px; text-align: right; color: #555;">No. ${invoiceId}</div>
            </div>
          </div>
          
          <div class="inv-details">
            <div class="inv-col">
              <div class="inv-label">Pelanggan</div>
              <div class="inv-value">
                <strong>${nama}</strong><br>
                No. WA: ${noWa}<br>
                IG/Sosmed: ${sosmed}<br>
                Lokasi: ${alamat || '-'}
              </div>
            </div>
            <div class="inv-col" style="text-align: right;">
              <div class="inv-label">Tanggal Cetak</div>
              <div class="inv-value">${invoiceDate}</div>
              <div class="inv-label" style="margin-top: 15px;">Waktu & Tanggal Acara</div>
              <div class="inv-value">
                <strong>${tanggalMain}</strong> ${tanggalOpsional ? '<br><span style="font-size:11px;color:#666;">Tambahan: ' + tanggalOpsional + '</span>' : ''}<br>
                Jam: ${jamMulai} - ${jamSelesai}
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr><th>Deskripsi Layanan</th><th style="text-align: right;">Total Harga</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${kategori}</strong><br>
                  <span style="font-size: 11px; color: #666;">Paket: ${paket}</span>
                </td>
                <td style="text-align: right;">${currentPrice}</td>
              </tr>
              ${isDp50 ? `
              <tr>
                <td style="text-align: right; padding-top: 20px; font-size: 13px;">Telah Dibayar (DP 50%):</td>
                <td style="text-align: right; padding-top: 20px; font-size: 14px; color: #16a34a; font-weight: bold;">- ${dpValue}</td>
              </tr>
              <tr class="total-row">
                <td style="text-align: right; padding-top: 15px; font-size: 16px; font-weight: bold;">Sisa Tagihan:</td>
                <td style="text-align: right; padding-top: 15px;" class="total-price">${sisaTagihan}</td>
              </tr>
              ` : `
              <tr class="total-row">
                <td style="text-align: right; padding-top: 20px;">Total Tagihan:</td>
                <td style="text-align: right; padding-top: 20px;" class="total-price">${currentPrice}</td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: right; padding-top: 10px; font-size: 13px; color: #dc2626;">*Belum ada pembayaran DP tercatat</td>
              </tr>
              `}
            </tbody>
          </table>

          <div class="payment-info">
            <div class="payment-title">Info Pembayaran</div>
            <div class="payment-item"><strong>Bank Mandiri</strong> : 123-456-7890 (a.n RFX VISUAL)</div>
            <div class="payment-item"><strong>SeaBank</strong> : 987-654-3210 (a.n RFX VISUAL)</div>
            <div class="payment-item"><strong>ShopeePay</strong> : 085731021469</div>
            <div class="payment-item"><strong>QRIS</strong> : Hubungi WhatsApp untuk Barcode QRIS</div>
            <p style="margin-top: 15px; font-size: 11px; color: #666;">*Harap simpan invoice ini dan sertakan bukti transfer saat konfirmasi melalui WhatsApp.</p>
          </div>

          <div class="footer">Terima kasih telah mempercayakan momen Anda kepada RFX VISUAL.<br>Invoice ini sah dan digenerate otomatis oleh sistem.</div>
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
Saya ingin mengkonfirmasi Form Booking Layanan:

*ID BOOKING:* ${invoiceId}
*Dicetak Pada:* ${invoiceDate}

*DATA KLIEN:*
- Nama: ${nama}
- No. WA: ${noWa}
- IG/Sosmed: ${sosmed}
- Alamat/Lokasi: ${alamat || '-'}

*WAKTU ACARA:*
- Tanggal: ${tanggalMain} ${tanggalOpsional ? '(Tambahan: ' + tanggalOpsional + ')' : ''}
- Jam: ${jamMulai} s/d ${jamSelesai}

*LAYANAN:*
- Kategori: ${kategori}
- Paket: ${paket}
- Total Harga: ${currentPrice}
${isDp50 ? `- Telah DP 50%: ${dpValue}
- Sisa Tagihan: ${sisaTagihan}
(Bukti terlampir)` : '- Status: Belum melakukan DP'}

Saya melampirkan file PDF Booking Form ini dan Bukti Transfer DP (jika ada). Mohon segera diproses. Terima kasih!`;

    const encodedText = encodeURIComponent(pesanFormatted);
    const waUrl = `https://wa.me/6285731021469?text=${encodedText}`;

    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden pt-20 pb-10 px-6">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
        
        {/* Header Back */}
        <button onClick={() => navigateTo('/rfx-links/pricelist')} className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest font-bold flex items-center gap-2 self-start">
          <ChevronLeft className="w-3 h-3" /> Kembali ke Pricelist
        </button>

        <div className="bg-[#0d0d0d] border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="mb-8">
            <p className="text-[10px] text-red-500 uppercase tracking-widest font-semibold mb-1">Formulir Booking</p>
            <h3 className="text-2xl font-black text-white uppercase">Booking <span className="text-red-500">Layanan</span></h3>
          </div>

          <form onSubmit={tanganiCetakInvoice} className="space-y-5">
            {/* Form Fields: Klien */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase font-bold">Nama Lengkap *</label>
                <input type="text" required placeholder="Nama Anda" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors" value={nama} onChange={e => setNama(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase font-bold">No. WhatsApp *</label>
                <input type="tel" required placeholder="085..." className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors" value={noWa} onChange={e => setNoWa(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Instagram / Sosmed *</label>
              <input type="text" required placeholder="@username" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors" value={sosmed} onChange={e => setSosmed(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Alamat Acara / Domisili</label>
              <input type="text" placeholder="Masukkan alamat lengkap" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors" value={alamat} onChange={e => setAlamat(e.target.value)} />
            </div>

            {/* Waktu & Tanggal */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Tanggal Acara Utama *</label>
                  <input type="date" required className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors" value={tanggalMain} onChange={e => setTanggalMain(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Tanggal Tambahan (Opsional)</label>
                  <input type="text" placeholder="Misal: 12-14 Mei (Acara 3 Hari)" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors" value={tanggalOpsional} onChange={e => setTanggalOpsional(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Jam Mulai *</label>
                  <input type="time" required className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors" value={jamMulai} onChange={e => setJamMulai(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Jam Selesai *</label>
                  <input type="time" required className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors" value={jamSelesai} onChange={e => setJamSelesai(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Kategori Field */}
            <div className="space-y-1.5 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-zinc-500 uppercase font-bold">Kategori Pricelist *</label>
                <button type="button" onClick={() => setIsManualKategori(!isManualKategori)} className="text-[9px] text-red-500 uppercase font-bold tracking-widest hover:text-white">
                  {isManualKategori ? 'Pilih dari Daftar' : 'Tulis Manual'}
                </button>
              </div>
              
              {isManualKategori ? (
                <input type="text" required placeholder="Tulis kategori (misal: Wisuda Luar Kota)" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors" value={kategori} onChange={e => {setKategori(e.target.value); setPaket('');}} />
              ) : (
                <select required className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors appearance-none" value={kategori} onChange={e => {setKategori(e.target.value); setPaket('');}}>
                  <option value="" disabled>-- Pilih Kategori --</option>
                  {daftarPricelist.map((list, idx) => (
                    <option key={idx} value={list.title}>{list.title}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Paket Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-zinc-500 uppercase font-bold">Pilihan Paket *</label>
                <button type="button" onClick={() => setIsManualPaket(!isManualPaket)} className="text-[9px] text-red-500 uppercase font-bold tracking-widest hover:text-white">
                  {isManualPaket ? 'Pilih dari Daftar' : 'Tulis Manual'}
                </button>
              </div>
              
              {isManualPaket || (!isManualKategori && activePackages.length === 0) ? (
                <div className="flex gap-2">
                  <input type="text" required placeholder="Nama paket" className="w-3/5 bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors" value={paket} onChange={e => setPaket(e.target.value)} />
                  <input type="text" placeholder="Harga (Misal: Rp 1.500.000)" className="w-2/5 bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors" value={hargaManual} onChange={e => setHargaManual(e.target.value)} />
                </div>
              ) : (
                <select required className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-red-600 transition-colors appearance-none" value={paket} onChange={e => setPaket(e.target.value)} disabled={!kategori}>
                  <option value="" disabled>-- Pilih Paket --</option>
                  {activePackages.map((pkg, idx) => (
                    <option key={idx} value={pkg.name}>{pkg.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Pricing Section Display */}
            <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800/50 mt-6 relative overflow-hidden">
              <div className="flex justify-between text-xs text-zinc-400 font-medium mb-3">
                <span>Total Harga Layanan:</span><span className="text-white font-bold">{currentPrice}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-400 font-medium pb-4 border-b border-white/5 mb-4">
                <span>Metode Pembayaran DP:</span><span className="text-white">Mandiri / SeaBank / ShopeePay / QRIS</span>
              </div>
              
              {isDp50 && dpValue !== "-" ? (
                <>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs text-green-500 font-bold uppercase">Telah Dibayar (DP 50%):</span>
                    <span className="text-green-500 font-mono font-black text-lg">- {dpValue}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-white/5">
                    <span className="text-xs text-white font-bold uppercase">Sisa Tagihan:</span>
                    <span className="text-red-500 font-mono font-black text-2xl">{sisaTagihan}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-xs text-white font-bold uppercase">Total Tagihan:</span>
                  <span className="text-red-500 font-mono font-black text-2xl">{currentPrice}</span>
                </div>
              )}
              
              {/* DP 50% Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer p-3 mt-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500/50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={isDp50} 
                  onChange={(e) => setIsDp50(e.target.checked)} 
                  className="w-4 h-4 rounded border-zinc-700 text-red-600 focus:ring-red-600 bg-black"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Cetak dengan DP 50%</span>
                  <span className="text-[10px] text-zinc-500">Centang ini jika Admin ingin mencetak invoice status DP</span>
                </div>
              </label>
            </div>

            {/* Big DP Notice */}
            <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-xl text-center">
              <h4 className="text-red-500 font-black uppercase tracking-widest text-sm mb-1">PEMBERITAHUAN PENTING</h4>
              <p className="text-xs text-red-200/80">Pembayaran DP (Down Payment) dilakukan <b>setelah</b> Anda mengirimkan form ini via WhatsApp kepada Admin.</p>
            </div>

            <button type="submit" className="w-full py-4 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-8 shadow-lg">
              Cetak Form Booking (Wajib)
            </button>
          </form>

          <div className="pt-3 border-t border-white/5 mt-4">
            <button onClick={kirimKeWhatsapp} disabled={!invoiceDicetak} className={`w-full py-4 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${invoiceDicetak ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/10' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800/80'}`}>
              Lanjut Konfirmasi ke WhatsApp
            </button>
          </div>
          {!invoiceDicetak && <p className="text-[10px] text-center text-zinc-500 italic mt-3">*Anda harus menekan "Cetak Form" terlebih dahulu untuk mengaktifkan tombol Konfirmasi WhatsApp.</p>}
        </div>

        {/* INVOICE MODAL (IN-APP BROWSER FALLBACK) */}
        {showInvoiceModal && (
          <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-md bg-white text-black p-6 md:p-8 rounded-2xl relative my-auto shadow-2xl">
              <button onClick={() => setShowInvoiceModal(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-zinc-100 rounded-full text-zinc-600 hover:bg-red-100 hover:text-red-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black italic tracking-tighter">RFX<span className="text-red-600">.VISUAL</span></h2>
                <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-widest">BOOKING: {invoiceId}</p>
              </div>

              <div className="space-y-3 text-sm mb-6 border-y border-zinc-200 py-4">
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Tanggal Cetak</p>
                  <p className="font-bold">{invoiceDate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Pelanggan</p>
                  <p className="font-bold">{nama}</p>
                  <p className="text-xs text-zinc-600">{noWa} | {sosmed}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Waktu Acara</p>
                  <p className="text-xs text-zinc-600 font-bold">{tanggalMain} {tanggalOpsional ? '(Tambahan: '+tanggalOpsional+')' : ''}</p>
                  <p className="text-xs text-zinc-600">{jamMulai} - {jamSelesai}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-2">Rincian Layanan</p>
                <div className="flex justify-between font-bold text-sm">
                  <span>{kategori} ({paket})</span>
                  <span className="text-red-600">{currentPrice}</span>
                </div>
              </div>

              {isDp50 && dpValue !== "-" && (
                <div className="mb-6">
                  <div className="flex justify-between font-bold text-sm text-green-600 mb-1">
                    <span>DP (50%)</span>
                    <span>- {dpValue}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-red-600 pt-2 border-t border-zinc-200">
                    <span>Sisa Tagihan</span>
                    <span>{sisaTagihan}</span>
                  </div>
                </div>
              )}

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
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Harga</span>
                <span className="text-2xl font-black text-red-600">{currentPrice}</span>
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
    </div>
  );
};

export default TampilanFormBooking;
