import { NextResponse } from 'next/server';
// import { supabase } from '@/supabaseClient'; // Sesuaikan path ini jika perlu

export async function POST(req) {
  try {
    // 1. Baca payload dari Pakasir
    const payload = await req.json();
    console.log('Webhook Pakasir Diterima:', payload);

    const {
      order_id,
      status,      // misalnya 'success', 'pending', 'failed'
      amount,
      customer_name,
      // tambahkan field lain yang dikirim oleh Pakasir sesuai dokumentasi mereka
    } = payload;

    // 2. (Opsional) Validasi Signature / Token Pakasir untuk keamanan
    // const signature = req.headers.get('x-pakasir-signature');
    // if (!isValidSignature(payload, signature)) return NextResponse.json({ error: 'Invalid Signature' }, { status: 401 });

    // 3. Update Database (Supabase) berdasarkan status
    if (status === 'success') {
      // Contoh query update ke Supabase:
      /*
      const { data, error } = await supabase
        .from('orders')
        .update({ status: 'PAID' })
        .eq('order_id', order_id);
      
      if (error) throw error;
      */
      console.log(`Order ${order_id} berhasil dibayar sejumlah ${amount}`);
    }

    // 4. Berikan response 200 OK ke server Pakasir agar mereka tahu webhook berhasil diterima
    return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing Pakasir Webhook:', error);
    // Return 500 jika terjadi error di sisi server kita
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
