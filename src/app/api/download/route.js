import { NextResponse } from 'next/server';
import { Pakasir } from 'pakasir';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const templateId = searchParams.get('templateId');

    if (!orderId || !templateId) {
      return NextResponse.json({ error: 'Parameter tidak lengkap.' }, { status: 400 });
    }

    // 1. Ekstrak data dari Order ID (Stateless)
    // Format: RFX-[encodedTemplateIds]-[amount]-[Timestamp]
    const parts = orderId.split('-');
    if (parts.length < 4 || parts[0] !== 'RFX') {
      return NextResponse.json({ error: 'Format Order ID tidak valid.' }, { status: 400 });
    }

    const encodedItems = parts[1];
    const amount = parseInt(parts[2], 10);
    const timestamp = parseInt(parts[3], 10);
    
    // Validasi Kedaluwarsa 24 Jam
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (now - timestamp > twentyFourHours) {
      return NextResponse.json({ error: 'Link unduhan ini sudah kedaluwarsa (melewati batas 1x24 jam).' }, { status: 403 });
    }
    
    // Decode template IDs
    const decodedStr = atob(encodedItems);
    const itemIds = decodedStr.split(',');

    if (!itemIds.includes(templateId)) {
      return NextResponse.json({ error: 'Anda tidak memiliki akses ke file ini.' }, { status: 403 });
    }

    // 2. Validasi ke Pakasir secara Real-Time
    const projectSlug = process.env.PAKASIR_SLUG;
    const apiKey = process.env.PAKASIR_API_KEY;
    if (!projectSlug || !apiKey) {
      return NextResponse.json({ error: 'Konfigurasi Server tidak lengkap.' }, { status: 500 });
    }

    const pakasirClient = new Pakasir({ project: projectSlug, api_key: apiKey });
    
    try {
      const details = await pakasirClient.getTransactionDetail(orderId, amount);
      if (details.transaction.status !== 'completed') {
        return NextResponse.json({ error: 'Akses ditolak. Pembayaran belum lunas atau tidak ditemukan.' }, { status: 403 });
      }
    } catch (e) {
      return NextResponse.json({ error: 'Gagal memvalidasi pembayaran ke Pakasir.' }, { status: 500 });
    }

    const fs = require('fs');
    const path = require('path');
    
    const filePath = path.resolve(process.cwd(), `private/templates/${templateId}.zip`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File ZIP tidak ditemukan di server.' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${templateId}-rfx.zip"`,
      },
    });

  } catch (error) {
    console.error('Download Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
