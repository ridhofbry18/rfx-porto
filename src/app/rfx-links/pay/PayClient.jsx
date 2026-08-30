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
    <div className={`min-h-screen font-sans py-16 px-6 relative overflow-x-hidden flex items-center justify-center transition-colors duration-500 bg-paper text-ink ${isDark ? 'theme-dark' : ''}`}>
      <div className="w-full max-w-md rounded-lg p-8 md:p-10 shadow-2xl relative overflow-hidden bg-paper-2 border border-line">
        
        {/* Dekorasi BG */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-ink rounded-full blur-[100px] opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <button onClick={() => router.push('/rfx-links/templates')} className="mono-label-sm text-muted hover:text-ink flex items-center gap-2 mb-8 relative z-10 transition-colors">
          <ChevronLeft className="w-3 h-3" /> Batal & Kembali
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-ink rounded-lg flex items-center justify-center shadow-lg">
            <ShoppingCart className="w-6 h-6 text-paper" />
          </div>
          <div>
            <h1 className="text-2xl font-display uppercase tracking-tighter">Secure Checkout</h1>
            <p className="mono-label-sm text-muted">Gerbang Pembayaran RFX</p>
          </div>
        </div>

        {error ? (
          <div className="bg-paper border border-line rounded-lg p-6 text-center">
            <AlertCircle className="w-10 h-10 text-ink mx-auto mb-3" />
            <p className="text-sm font-bold text-ink">{error}</p>
            <p className="text-[10px] text-muted mt-2">Pastikan link yang Anda salin utuh dan tidak terpotong.</p>
          </div>
        ) : (
          <>
            <div className={`mb-8 space-y-3 ${qrisData ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className="mono-label-sm text-muted border-b border-line pb-2 mb-4">Ringkasan Pesanan</h3>
              {cartItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm font-bold text-ink">{item.title}</span>
                  <span className="text-xs font-medium text-muted">{item.priceStr}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t border-line">
                <span className="mono-label-sm text-muted">Total</span>
                <span className="text-xl font-black text-ink">{formatRupiah(totalHarga)}</span>
              </div>
            </div>

            {!qrisData ? (
              <button 
                onClick={tanganiTampilkanQRIS} 
                disabled={isCheckingOut || totalHarga === 0}
                className={`w-full py-4 rounded-md font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${isCheckingOut || totalHarga === 0 ? 'bg-paper text-muted cursor-not-allowed' : 'bg-ink text-paper hover:bg-ink/85'}`}
              >
                {isCheckingOut ? (
                  <>Membuat Kode QRIS... <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full ml-2"></span></>
                ) : (
                  <>Tampilkan Kode QRIS</>
                )}
              </button>
            ) : (
              <div className="flex flex-col items-center animate-fade-in">
                <p className="mono-label-sm text-muted mb-4">Scan untuk Membayar</p>
                <div className="w-56 h-56 bg-white rounded-lg mb-6 p-3 flex items-center justify-center overflow-hidden border-2 border-dashed border-line shadow-inner">
                  {qrisData.url ? (
                    <img src={qrisData.url} alt="QRIS Barcode" className="w-full h-full object-contain" />
                  ) : qrisData.string ? (
                    <QRCodeSVG value={qrisData.string} size={200} level="H" includeMargin={true} />
                  ) : (
                    <p className="text-xs text-muted">QR Error</p>
                  )}
                </div>
                
                <div className="w-full bg-ink text-paper py-4 rounded-md font-bold uppercase tracking-widest text-[10px] flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-paper/10 animate-pulse"></div>
                  <span className="relative flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-paper/30 border-t-paper rounded-full animate-spin"></span>
                    Menunggu Pembayaran...
                  </span>
                </div>
                <p className="text-[9px] text-muted italic mt-4 text-center">*Mohon selesaikan pembayaran. Layar akan otomatis dialihkan ke halaman unduhan jika sudah lunas.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
