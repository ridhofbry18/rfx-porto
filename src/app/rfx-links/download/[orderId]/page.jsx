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
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 font-sans transition-colors duration-500 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#f4fcf4] text-zinc-900'}`}>
      <div className={`max-w-md w-full border rounded-3xl p-10 text-center shadow-2xl ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Pembayaran Berhasil!</h1>
        <p className={`text-sm mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Order ID: <span className={`font-mono ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{orderId}</span></p>
        
        <div className={`p-4 border rounded-2xl mb-8 ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
          <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
            Terima kasih telah berbelanja di RFX Visual. File template website Anda telah siap untuk diunduh.
          </p>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-left">
            <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest mb-1">Peringatan Akses</p>
            <p className={`text-[10px] leading-relaxed ${isDark ? 'text-orange-400' : 'text-orange-600/80'}`}>
              Sistem keamanan membatasi akses unduhan ini selama <b>1x24 jam</b>. Link ini akan kedaluwarsa pada: <br/>
              <span className="font-bold">{formatDate(expirationDate)}</span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="w-full py-4 text-xs uppercase tracking-widest animate-pulse">Menyiapkan File...</div>
        ) : error ? (
          <div className="w-full py-4 text-xs font-bold text-red-500">{error}</div>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {items.map(item => (
              <a 
                key={item.id}
                href={`/api/download?orderId=${orderId}&templateId=${item.id}`}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${isDark ? 'bg-white hover:bg-zinc-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]'}`}
              >
                <span className="truncate max-w-[200px] text-left">{item.name}</span>
                <span className="flex items-center gap-2"><Download className="w-4 h-4" /> Unduh ZIP</span>
              </a>
            ))}
          </div>
        )}

        <button 
          onClick={() => router.push('/')}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all mb-3 ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'}`}
        >
          <Home className="w-4 h-4" /> Kembali ke Beranda
        </button>

        <button 
          onClick={handleWhatsApp}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20`}
        >
          <MessageCircle className="w-4 h-4" /> Ada Kendala? Hubungi Admin
        </button>
      </div>

      <p className={`text-[10px] mt-8 max-w-sm text-center ${isDark ? 'text-zinc-600' : 'text-zinc-500'}`}>
        *Link download ini dilindungi oleh keamanan sesi. Jangan bagikan link halaman ini karena tidak akan bisa dibuka di perangkat lain.
      </p>
    </div>
  );
}
