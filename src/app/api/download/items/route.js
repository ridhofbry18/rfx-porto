import { NextResponse } from 'next/server';
import { Pakasir } from 'pakasir';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID tidak valid.' }, { status: 400 });
    }

    const parts = orderId.split('-');
    if (parts.length < 4 || parts[0] !== 'RFX') {
      return NextResponse.json({ error: 'Order ID tidak valid.' }, { status: 400 });
    }

    const encodedItems = parts[1];
    const amount = parseInt(parts[2], 10);
    const timestamp = parseInt(parts[3], 10);
    
    // Validasi Kedaluwarsa 24 Jam
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (now - timestamp > twentyFourHours) {
      return NextResponse.json({ error: 'Link unduhan ini sudah kedaluwarsa (melewati batas 1x24 jam). Silakan hubungi admin.' }, { status: 403 });
    }
    
    // Validasi ke Pakasir
    const projectSlug = process.env.PAKASIR_SLUG;
    const apiKey = process.env.PAKASIR_API_KEY;
    if (projectSlug && apiKey) {
      const pakasirClient = new Pakasir({ project: projectSlug, api_key: apiKey });
      try {
        const details = await pakasirClient.getTransactionDetail(orderId, amount);
        if (details.transaction.status !== 'completed') {
          return NextResponse.json({ error: 'Akses ditolak. Transaksi belum lunas.' }, { status: 403 });
        }
      } catch (e) {
        return NextResponse.json({ error: 'Gagal memvalidasi status transaksi.' }, { status: 500 });
      }
    }

    // Decode items
    const itemIds = atob(encodedItems).split(',').filter(Boolean);
    
    // We can also fetch the real names of the templates from DataProvider or hardcode for now
    const catalog = {
      'tpl-01': 'Tema Artistik (Neubrutalism)',
      'tpl-02': 'Tema Visual (Glassmorphism)',
      'tpl-03': 'Tema Tech (Developer)'
    };
    
    const itemsData = itemIds.map(id => ({
      id,
      name: catalog[id] || id
    }));

    return NextResponse.json({ items: itemsData }, { status: 200 });

  } catch (error) {
    console.error('Items fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
