import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const templateId = searchParams.get('templateId');

    if (!orderId || !templateId) {
      return NextResponse.json({ error: 'Parameter tidak lengkap.' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const authCookie = cookieStore.get(`rfx_auth_${orderId}`);

    if (!authCookie) {
      return NextResponse.json({ 
        error: 'Akses Ditolak.',
        message: 'Link unduhan tidak valid atau sudah kedaluwarsa.' 
      }, { status: 403 });
    }

    const itemIds = authCookie.value.split(',');
    
    if (!itemIds.includes(templateId)) {
      return NextResponse.json({ error: 'Anda tidak memiliki akses ke file ini.' }, { status: 403 });
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
