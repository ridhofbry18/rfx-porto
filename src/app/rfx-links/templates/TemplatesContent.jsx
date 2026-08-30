'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShoppingCart, Plus, Minus, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useData } from '@/components/DataProvider';

const TemplatesContent = () => {
  const router = useRouter();
  const { daftarWebsite, isDark, daftarKatalog } = useData();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const tanganiTambahKeranjang = (template) => {
    const exists = cart.find(item => item.id === template.id);
    if (!exists) {
      setCart([...cart, { ...template, qty: 1 }]);
    }
  };

  const tanganiHapusKeranjang = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalHarga = cart.reduce((total, item) => total + (item.priceInt * item.qty), 0);
  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

  const [paymentCodeData, setPaymentCodeData] = useState(null);

  const tanganiCheckoutPakasir = () => {
    if (cart.length === 0) return;
    
    // Generate stateless payment code based on cart items
    const itemIds = cart.map(item => item.id).join(',');
    // Encode to base64 to make it look like a secure payment code
    const encoded = btoa(itemIds).replace(/=/g, ''); 
    const payCode = `RFX-${encoded}-${totalHarga}`;
    
    setPaymentCodeData({
      code: payCode,
      url: `https://link.rfxvisual.my.id/pay?code=${payCode}`
    });
  };

  return (
    <div className={`min-h-screen font-sans py-16 px-6 relative overflow-x-hidden transition-colors duration-500 bg-paper text-ink ${isDark ? 'theme-dark' : ''}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => router.push('/')} className="mono-label-sm text-muted hover:text-ink flex items-center gap-2 transition-colors">
            <ChevronLeft className="w-3 h-3" /> Kembali ke Bio
          </button>
          
          <button onClick={() => setIsCartOpen(true)} className="relative flex items-center gap-2 px-4 py-2 rounded-full transition-all border border-ink text-ink hover:bg-ink hover:text-paper">
            <ShoppingCart className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Keranjang</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-ink text-paper text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-display uppercase mb-4 tracking-tighter">Katalog Template<span className="text-ink">.</span></h2>
          <p className="text-sm font-light max-w-xl mx-auto leading-relaxed text-muted">Pilih dan kumpulkan template website premium favorit Anda. Anda bisa memborong lebih dari satu template sekaligus melalui keranjang belanja.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {daftarKatalog && daftarKatalog.length === 0 ? (
            <div className="col-span-full rounded-lg border p-10 text-center bg-paper-2 border-line">
              <p className="text-sm text-muted">Belum ada katalog template. Tambahkan data melalui Admin Panel &gt; Website.</p>
            </div>
          ) : daftarKatalog?.map(tpl => {
            const inCart = cart.some(item => item.id === tpl.id);
            return (
              <div key={tpl.id} className={`border rounded-lg overflow-hidden transition-all flex flex-col group shadow-sm hover:shadow-lg ${inCart ? 'bg-paper-2 border-ink' : 'bg-paper-2 border-line hover:border-ink'}`}>
                <div className="aspect-[4/3] bg-paper-2 relative overflow-hidden">
                  <img src={tpl.image} alt={tpl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block bg-ink text-paper px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase shadow-lg mb-2">{tpl.badge}</span>
                    <h3 className="text-xl font-display uppercase tracking-wide leading-tight text-white">{tpl.title}</h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[11px] font-light leading-relaxed mb-6 line-clamp-2 text-muted">{tpl.description}</p>
                  
                  <div className="space-y-2 mb-6 flex-1">
                    {tpl.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] text-muted">
                        <CheckCircle2 className="w-3 h-3 text-ink" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                    {tpl.features.length > 3 && <div className="text-[9px] italic pl-5 text-muted">+ {tpl.features.length - 3} fitur lainnya</div>}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-line">
                    <span className="text-lg font-black">{tpl.priceStr}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => router.push(tpl.demoUrl)}
                        className="px-4 py-2 rounded-md border border-ink text-ink hover:bg-ink hover:text-paper text-[10px] font-bold uppercase tracking-widest transition-all"
                      >
                        Preview
                      </button>
                      <button 
                        onClick={() => inCart ? tanganiHapusKeranjang(tpl.id) : tanganiTambahKeranjang(tpl)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${inCart ? 'border border-ink text-ink hover:bg-ink hover:text-paper' : 'bg-ink text-paper hover:bg-ink/85'}`}
                      >
                        {inCart ? (
                          <><Minus className="w-3 h-3" /> Batal</>
                        ) : (
                          <><Plus className="w-3 h-3" /> Beli</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Drawer / Sidebar */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] border-l z-[110] shadow-2xl flex flex-col animate-slide-in-right bg-paper border-line">
            <div className="p-6 border-b flex justify-between items-center border-line bg-paper-2">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-ink" />
                <h3 className="text-sm font-display uppercase tracking-widest text-ink">Keranjang Anda</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-paper-2 text-muted hover:bg-ink hover:text-paper">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <ShoppingCart className="w-16 h-16 mb-4 text-muted" />
                  <p className="mono-label text-muted">Keranjang Kosong</p>
                  <p className="text-[10px] mt-2 text-muted">Pilih template dari katalog untuk menambahkan ke sini.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="border rounded-lg p-4 flex gap-4 relative pr-10 shadow-sm bg-paper-2 border-line">
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex flex-col justify-center">
                      <h4 className="text-xs font-bold uppercase tracking-wider mb-1 line-clamp-1 text-ink">{item.title}</h4>
                      <p className="text-[10px] font-bold text-ink">{item.priceStr}</p>
                    </div>
                    <button onClick={() => tanganiHapusKeranjang(item.id)} className="absolute top-1/2 -translate-y-1/2 right-4 transition-colors text-muted hover:text-ink">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-paper-2 border-line">
                <div className="flex justify-between items-end mb-6">
                  <span className="mono-label-sm text-muted">Total Pembayaran</span>
                  <span className="text-2xl font-black text-ink">{formatRupiah(totalHarga)}</span>
                </div>
                <button 
                  onClick={tanganiCheckoutPakasir} 
                  className="w-full py-4 rounded-md font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 bg-ink text-paper hover:bg-ink/85"
                >
                  Dapatkan Kode Pembayaran <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[9px] text-center text-muted italic mt-4">*Sistem akan memberikan Kode khusus agar sesi pembayaran Anda aman & tidak hilang.</p>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Modal Peringatan In-App Browser (Kode Pembayaran) */}
      {paymentCodeData && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-paper rounded-lg p-8 max-w-sm w-full flex flex-col items-center text-center animate-slide-in-right shadow-2xl relative">
            <button onClick={() => setPaymentCodeData(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-paper-2 flex items-center justify-center text-muted hover:text-ink transition-colors">
              <X className="w-4 h-4" />
            </button>
            
            <div className="w-16 h-16 bg-paper-2 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="w-8 h-8 text-ink" />
            </div>
            
            <h3 className="text-xl font-display uppercase text-ink mb-2">Simpan Kode Pesanan</h3>
            <p className="text-xs text-muted mb-6 font-medium leading-relaxed">
              Untuk menghindari resiko tertutupnya halaman saat Anda membuka aplikasi m-Banking, <b>tolong salin link di bawah ini dan buka di browser utama Anda (Safari / Chrome).</b>
            </p>
            
            <div className="w-full bg-paper-2 rounded-lg mb-6 p-4 border-2 border-dashed border-line text-left relative group">
               <p className="mono-label-sm text-muted mb-1">Kode Pembayaran:</p>
               <p className="font-mono text-sm font-bold text-ink break-all">{paymentCodeData.code}</p>
            </div>
            
            <button 
              onClick={() => {
                navigator.clipboard.writeText(paymentCodeData.url);
                alert("Link berhasil disalin! Silakan buka Safari/Chrome dan tempel (paste) link tersebut.");
              }} 
              className="w-full bg-ink text-paper hover:bg-ink/85 py-4 rounded-md font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all mb-3"
            >
              Salin Link Pembayaran
            </button>
            
            <button 
              onClick={() => {
                window.open(paymentCodeData.url, '_blank');
              }} 
              className="w-full bg-paper-2 text-ink hover:bg-ink hover:text-paper py-4 rounded-md font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all"
            >
              Buka di Tab Baru
            </button>
            
            <p className="text-[9px] text-muted italic mt-6 text-center">*Sistem gerbang pembayaran akan meminta scan QRIS setelah Anda membuka link tersebut di browser utama.</p>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in-right { animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
};

export default TemplatesContent;
