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

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [qrisData, setQrisData] = useState(null);

  // Efek Polling Otomatis untuk mengecek status lunas
  useEffect(() => {
    if (!qrisData) return;

    const intervalId = setInterval(async () => {
      try {
        const response = await fetch('/api/pakasir/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: qrisData.orderId, amount: qrisData.amount })
        });
        const data = await response.json();
        
        if (data.status === 'completed') {
          clearInterval(intervalId);
          setQrisData(null);
          setCart([]);
          setIsCartOpen(false);
          router.push(`/download/${qrisData.orderId}`);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [qrisData, router]);

  const tanganiCheckoutPakasir = async () => {
    if (cart.length === 0) return;
    
    setIsCheckingOut(true);
    
    try {
      const response = await fetch('/api/pakasir/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart,
          totalHarga
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat memproses checkout.');
      }

      if (data.qris_url || data.qris_string) {
        // Tampilkan Modal QRIS In-App
        setQrisData({
          url: data.qris_url,
          string: data.qris_string,
          orderId: data.order_id || 'UNKNOWN',
          amount: totalHarga
        });
      } else {
        alert("Gagal mendapatkan kode QRIS dari server.");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans py-16 px-6 relative overflow-x-hidden transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-white' : 'bg-[#f4fcf4] text-zinc-900'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => router.push('/')} className={`text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}>
            <ChevronLeft className="w-3 h-3" /> Kembali ke Bio
          </button>
          
          <button onClick={() => setIsCartOpen(true)} className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all border ${isDark ? 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border-blue-500/20' : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200'}`}>
            <ShoppingCart className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Keranjang</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-red-900/50">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tighter">Katalog Template<span className="text-blue-500">.</span></h2>
          <p className={`text-sm font-light max-w-xl mx-auto leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Pilih dan kumpulkan template website premium favorit Anda. Anda bisa memborong lebih dari satu template sekaligus melalui keranjang belanja.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {daftarKatalog && daftarKatalog.length === 0 ? (
            <div className={`col-span-full rounded-[2rem] border p-10 text-center ${isDark ? 'bg-zinc-900/40 border-white/10' : 'bg-white border-zinc-200'}`}>
              <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Belum ada katalog template. Tambahkan data melalui Admin Panel &gt; Website.</p>
            </div>
          ) : daftarKatalog?.map(tpl => {
            const inCart = cart.some(item => item.id === tpl.id);
            return (
              <div key={tpl.id} className={`border rounded-[2rem] overflow-hidden transition-all flex flex-col group shadow-sm hover:shadow-xl ${isDark ? (inCart ? 'bg-zinc-900/40 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.1)]' : 'bg-zinc-900/40 border-white/5 hover:border-white/15') : (inCart ? 'bg-blue-50/50 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'bg-white border-zinc-200 hover:border-zinc-300')}`}>
                <div className="aspect-[4/3] bg-zinc-800 relative overflow-hidden">
                  <img src={tpl.image} alt={tpl.title} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${isDark ? 'opacity-80' : 'opacity-100'}`} />
                  <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-transparent' : 'bg-gradient-to-t from-black/80 via-black/20 to-transparent'}`}></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block bg-blue-600 text-white px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase shadow-lg mb-2">{tpl.badge}</span>
                    <h3 className="text-xl font-black uppercase tracking-wide leading-tight text-white">{tpl.title}</h3>
                  </div>
                </div>

                <div className={`p-6 flex-1 flex flex-col ${isDark ? 'bg-zinc-950' : 'bg-transparent'}`}>
                  <p className={`text-[11px] font-light leading-relaxed mb-6 line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{tpl.description}</p>
                  
                  <div className="space-y-2 mb-6 flex-1">
                    {tpl.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className={`flex items-center gap-2 text-[10px] ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        <CheckCircle2 className="w-3 h-3 text-blue-500/70" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                    {tpl.features.length > 3 && <div className={`text-[9px] italic pl-5 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>+ {tpl.features.length - 3} fitur lainnya</div>}
                  </div>

                  <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-white/5' : 'border-zinc-200'}`}>
                    <span className="text-lg font-black">{tpl.priceStr}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => router.push(tpl.demoUrl)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isDark ? 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:text-black hover:bg-zinc-200'}`}
                      >
                        Preview
                      </button>
                      <button 
                        onClick={() => inCart ? tanganiHapusKeranjang(tpl.id) : tanganiTambahKeranjang(tpl)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${inCart ? (isDark ? 'bg-red-600/10 text-red-500 hover:bg-red-600/20' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200') : (isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-blue-600 text-white hover:bg-blue-700')}`}
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
          <div className={`fixed top-0 right-0 bottom-0 w-full sm:w-[400px] border-l z-[110] shadow-2xl flex flex-col animate-slide-in-right ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-white/10 bg-zinc-900/50' : 'border-zinc-100 bg-zinc-50'}`}>
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
                <h3 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-zinc-900'}`}>Keranjang Anda</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white' : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-500 hover:text-zinc-800'}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <ShoppingCart className={`w-16 h-16 mb-4 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`} />
                  <p className={`text-xs uppercase tracking-widest font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Keranjang Kosong</p>
                  <p className={`text-[10px] mt-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Pilih template dari katalog untuk menambahkan ke sini.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className={`border rounded-2xl p-4 flex gap-4 relative pr-10 shadow-sm ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-zinc-200'}`}>
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover opacity-80" />
                    <div className="flex flex-col justify-center">
                      <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 line-clamp-1 ${isDark ? 'text-white' : 'text-zinc-800'}`}>{item.title}</h4>
                      <p className="text-[10px] font-bold text-blue-500">{item.priceStr}</p>
                    </div>
                    <button onClick={() => tanganiHapusKeranjang(item.id)} className={`absolute top-1/2 -translate-y-1/2 right-4 transition-colors ${isDark ? 'text-zinc-500 hover:text-red-500' : 'text-zinc-400 hover:text-red-500'}`}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className={`p-6 border-t ${isDark ? 'bg-zinc-900/80 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className="flex justify-between items-end mb-6">
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Total Pembayaran</span>
                  <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>{formatRupiah(totalHarga)}</span>
                </div>
                <button 
                  onClick={tanganiCheckoutPakasir} 
                  disabled={isCheckingOut}
                  className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.2)] ${isCheckingOut ? 'bg-blue-800 text-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                >
                  {isCheckingOut ? (
                    <>Memproses Pembayaran... <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full ml-2"></span></>
                  ) : (
                    <>Checkout via Pakasir <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
                <p className="text-[9px] text-center text-zinc-500 italic mt-4">*Kode QRIS akan langsung muncul di layar Anda. Kode API dinamis sedang aktif.</p>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Modal QRIS In-App */}
      {qrisData && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full flex flex-col items-center text-center animate-slide-in-right shadow-[0_0_50px_rgba(37,99,235,0.2)] relative">
            <button onClick={() => setQrisData(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="text-xl font-black uppercase text-black mb-1">Scan QRIS</h3>
            <p className="text-xs text-zinc-500 mb-6 font-medium">Order ID: {qrisData.orderId}</p>
            
            <div className="w-56 h-56 bg-white rounded-2xl mb-6 p-3 flex items-center justify-center overflow-hidden border-2 border-dashed border-blue-200 shadow-inner">
              {/* Render QRIS dari URL atau String */}
              {qrisData.url ? (
                <img src={qrisData.url} alt="QRIS Barcode" className="w-full h-full object-contain" />
              ) : qrisData.string ? (
                <QRCodeSVG value={qrisData.string} size={200} level="H" includeMargin={true} />
              ) : (
                <p className="text-xs text-zinc-400">QR Error</p>
              )}
            </div>
            
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Total Tagihan</p>
            <p className="text-3xl font-black text-blue-600 mb-8">{formatRupiah(qrisData.amount)}</p>
            
            <div className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] flex flex-col items-center justify-center gap-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/20 animate-pulse"></div>
              <span className="relative flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Menunggu Pembayaran...
              </span>
            </div>
            <p className="text-[9px] text-zinc-400 italic mt-4 text-center">*Mohon selesaikan pembayaran di aplikasi Bank/E-Wallet Anda.<br/>Layar ini akan otomatis mengarahkan Anda ke file download jika sudah lunas.</p>
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
