import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID tidak valid.' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const authCookie = cookieStore.get(`rfx_auth_${orderId}`);

    if (!authCookie) {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    // items is a comma separated string
    const itemIds = authCookie.value.split(',').filter(Boolean);
    
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
