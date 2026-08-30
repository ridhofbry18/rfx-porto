'use client'

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Download, Home, MessageCircle } from 'lucide-react';
import { useData } from '@/components/DataProvider';

export default function DownloadPage({ params }) {
  const { isDark } = useData();
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;
  const router = useRouter();

  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  // Hitung Waktu Kedaluwarsa dari Order ID (Timestamp ada di bagian akhir)
  const orderParts = orderId.split('-');
  const timestamp = parseInt(orderParts[orderParts.length - 1], 10);
  const expirationDate = new Date(timestamp + 24 * 60 * 60 * 1000);
  const isExpired = Date.now() > expirationDate.getTime();
  
  const formatDate = (date) => {
    if (isNaN(date.getTime())) return '24 Jam';
    return date.toLocaleString('id-ID', { 
      day: 'numeric', month: 'long', year: 'numeric', 
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleWhatsApp = () => {
    const adminWA = '6285731021469';
    const text = `Halo Admin RFX Visual, saya ada kendala terkait pesanan dengan Order ID: ${orderId}. Mohon bantuannya ya!`;
    window.open(`https://wa.me/${adminWA}?text=${encodeURIComponent(text)}`, '_blank');
  };

  React.useEffect(() => {
    fetch(`/api/download/items?orderId=${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [orderId]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 font-sans transition-colors duration-500 bg-paper text-ink ${isDark ? 'theme-dark' : ''}`}>
      <div className="max-w-md w-full border border-line rounded-lg p-10 text-center shadow-2xl bg-paper-2">
        <div className="w-20 h-20 bg-ink text-paper rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-display uppercase tracking-tight mb-2">Pembayaran Berhasil!</h1>
        <p className="text-sm mb-6 text-muted">Order ID: <span className="font-mono text-ink">{orderId}</span></p>
        
        <div className="p-4 border border-line rounded-lg mb-8 bg-paper">
          <p className="text-xs leading-relaxed mb-3 text-muted">
            Terima kasih telah berbelanja di RFX Visual. File template website Anda telah siap untuk diunduh.
          </p>
          <div className="bg-paper-2 border border-line rounded-lg p-3 text-left">
            <p className="mono-label-sm text-ink mb-1">Peringatan Akses</p>
            <p className="text-[10px] leading-relaxed text-muted">
              Sistem keamanan membatasi akses unduhan ini selama <b>1x24 jam</b>. Link ini akan kedaluwarsa pada: <br/>
              <span className="font-bold">{formatDate(expirationDate)}</span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="w-full py-4 text-xs uppercase tracking-widest animate-pulse">Menyiapkan File...</div>
        ) : error ? (
          <div className="w-full py-4 text-xs font-bold text-ink">{error}</div>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {items.map(item => (
              <a 
                key={item.id}
                href={`/api/download?orderId=${orderId}&templateId=${item.id}`}
                className="w-full flex items-center justify-between px-4 py-4 rounded-md font-black uppercase tracking-widest text-[10px] transition-all bg-ink text-paper hover:bg-ink/85"
              >
                <span className="truncate max-w-[200px] text-left">{item.name}</span>
                <span className="flex items-center gap-2"><Download className="w-4 h-4" /> Unduh ZIP</span>
              </a>
            ))}
          </div>
        )}

        <button 
          onClick={() => router.push('/')}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-md font-bold uppercase tracking-widest text-[10px] transition-all mb-3 bg-paper text-ink border border-line hover:bg-ink hover:text-paper"
        >
          <Home className="w-4 h-4" /> Kembali ke Beranda
        </button>

        <button 
          onClick={handleWhatsApp}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-md font-bold uppercase tracking-widest text-[10px] transition-all border border-ink text-ink hover:bg-ink hover:text-paper"
        >
          <MessageCircle className="w-4 h-4" /> Ada Kendala? Hubungi Admin
        </button>
      </div>

      <p className="text-[10px] mt-8 max-w-sm text-center text-muted">
        *Link download ini dilindungi oleh keamanan sesi. Jangan bagikan link halaman ini karena tidak akan bisa dibuka di perangkat lain.
      </p>
    </div>
  );
}
