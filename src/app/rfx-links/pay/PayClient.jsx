'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ShoppingCart, CheckCircle2, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useData } from '@/components/DataProvider';

export default function PayClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  
  const { daftarKatalog, isDark } = useData();
  
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalHarga, setTotalHarga] = useState(0);
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [qrisData, setQrisData] = useState(null);

  // 1. Validasi Kode dan Hitung Total
  useEffect(() => {
    if (!code) {
      setError("Kode pembayaran tidak ditemukan di URL.");
      return;
    }
    
    if (!daftarKatalog || daftarKatalog.length === 0) return;

    try {
      // Decode RFX-dHBsLTAx-200000
      const parts = code.split('-');
      if (parts.length < 3) throw new Error("Kode pembayaran tidak lengkap.");
      
      const encoded = parts[1];
      const decodedStr = atob(encoded); // e.g. "tpl-01,tpl-02"
      const itemIds = decodedStr.split(',');
      const parsedTotal = parseInt(parts[2], 10);

      const items = itemIds.map(id => {
        const product = daftarKatalog.find(p => p.id === id);
        return product ? { ...product, qty: 1 } : { id, title: id, priceStr: 'Rp ?', priceInt: 0, qty: 1 };
      });

      setCartItems(items);
      setTotalHarga(parsedTotal);
    } catch (err) {
      setError("Kode pembayaran tidak valid atau rusak.");
    }
  }, [code, daftarKatalog]);

  // 2. Polling Otomatis Jika QRIS Sudah Ada
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
          router.push(`/rfx-links/download/${qrisData.orderId}`);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [qrisData, router]);

  // 3. Eksekusi Checkout
  const tanganiTampilkanQRIS = async () => {
    if (cartItems.length === 0 || !totalHarga || !code) return;
    
    setIsCheckingOut(true);
    setError(null);
    
    try {
      const response = await fetch('/api/pakasir/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payCode: code, totalHarga })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat memproses checkout.');
      }

      if (data.qris_url || data.qris_string) {
        setQrisData({
          url: data.qris_url,
          string: data.qris_string,
          orderId: data.order_id,
          amount: totalHarga
        });
      } else {
        throw new Error("Gagal mendapatkan kode QRIS dari server.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

  return (
    <div className={`min-h-screen font-sans py-16 px-6 relative overflow-x-hidden flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-white' : 'bg-[#f4fcf4] text-zinc-900'}`}>
      <div className={`w-full max-w-md rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200'}`}>
        
        {/* Dekorasi BG */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <button onClick={() => router.push('/rfx-links/templates')} className={`text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 mb-8 relative z-10 transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}>
          <ChevronLeft className="w-3 h-3" /> Batal & Kembali
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Secure Checkout</h1>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Gerbang Pembayaran RFX</p>
          </div>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-red-900'}`}>{error}</p>
            <p className="text-[10px] text-red-500 mt-2">Pastikan link yang Anda salin utuh dan tidak terpotong.</p>
          </div>
        ) : (
          <>
            <div className={`mb-8 space-y-3 ${qrisData ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className={`text-[10px] uppercase tracking-widest font-bold border-b pb-2 mb-4 ${isDark ? 'text-zinc-500 border-zinc-800' : 'text-zinc-400 border-zinc-200'}`}>Ringkasan Pesanan</h3>
              {cartItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className={`text-sm font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{item.title}</span>
                  <span className={`text-xs font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{item.priceStr}</span>
                </div>
              ))}
              <div className={`flex justify-between items-center pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                <span className={`text-xs uppercase tracking-widest font-black ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Total</span>
                <span className="text-xl font-black text-blue-600">{formatRupiah(totalHarga)}</span>
              </div>
            </div>

            {!qrisData ? (
              <button 
                onClick={tanganiTampilkanQRIS} 
                disabled={isCheckingOut || totalHarga === 0}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.2)] ${isCheckingOut || totalHarga === 0 ? 'bg-blue-800 text-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
              >
                {isCheckingOut ? (
                  <>Membuat Kode QRIS... <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full ml-2"></span></>
                ) : (
                  <>Tampilkan Kode QRIS</>
                )}
              </button>
            ) : (
              <div className="flex flex-col items-center animate-fade-in">
                <p className={`text-[10px] uppercase tracking-widest font-bold mb-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Scan untuk Membayar</p>
                <div className="w-56 h-56 bg-white rounded-2xl mb-6 p-3 flex items-center justify-center overflow-hidden border-2 border-dashed border-blue-200 shadow-inner">
                  {qrisData.url ? (
                    <img src={qrisData.url} alt="QRIS Barcode" className="w-full h-full object-contain" />
                  ) : qrisData.string ? (
                    <QRCodeSVG value={qrisData.string} size={200} level="H" includeMargin={true} />
                  ) : (
                    <p className="text-xs text-zinc-400">QR Error</p>
                  )}
                </div>
                
                <div className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/20 animate-pulse"></div>
                  <span className="relative flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Menunggu Pembayaran...
                  </span>
                </div>
                <p className="text-[9px] text-zinc-500 italic mt-4 text-center">*Mohon selesaikan pembayaran. Layar akan otomatis dialihkan ke halaman unduhan jika sudah lunas.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
