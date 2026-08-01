import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Pakasir } from 'pakasir';

export async function POST(req) {
  try {
    const { orderId, amount } = await req.json();

    if (!orderId || !amount) {
      return NextResponse.json({ error: 'Missing orderId or amount' }, { status: 400 });
    }

    const projectSlug = process.env.PAKASIR_SLUG;
    const apiKey = process.env.PAKASIR_API_KEY;

    if (!projectSlug || !apiKey) {
      return NextResponse.json({ error: 'Config missing' }, { status: 500 });
    }

    const pakasirClient = new Pakasir({
      project: projectSlug,
      api_key: apiKey
    });

    // Cek status ke server Pakasir
    const details = await pakasirClient.getTransactionDetail(orderId, amount);
    
    // Status bisa berupa 'pending', 'canceled', atau 'completed'
    const status = details.transaction.status;

    // JIKA STATUS COMPLETED LUNAS:
    // Kita set Cookie rahasia ke browser milik user yang membayar ini.
    if (status === 'completed') {
      const cookieStore = await cookies();
      
      const pendingItems = cookieStore.get(`rfx_pending_${orderId}`);
      const boughtItems = pendingItems ? pendingItems.value : 'PAID_TICKET_VALID';

      cookieStore.set(`rfx_auth_${orderId}`, boughtItems, {
        httpOnly: true, // Tidak bisa diakses oleh JavaScript (sangat aman)
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // Berlaku 1 hari (24 jam)
      });
      
      cookieStore.delete(`rfx_pending_${orderId}`);
    }

    return NextResponse.json({ status, details: details.transaction }, { status: 200 });

  } catch (error) {
    console.error('Error polling status Pakasir:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
