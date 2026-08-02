import { NextResponse } from 'next/server';

import { Pakasir } from 'pakasir';
// import { supabase } from '@/supabaseClient'; // Buka komentar ini saat database siap

export async function POST(req) {
  try {
    const body = await req.json();
    const { payCode, totalHarga } = body;

    if (!payCode || !totalHarga) {
      return NextResponse.json({ error: 'Kode pembayaran tidak valid' }, { status: 400 });
    }

    // Buat ID Pesanan Unik yang STAFELESS (mengandung data template)
    // Format: RFX-[encodedTemplateIds]-[Timestamp]
    // Contoh payCode input: RFX-dHBsLTAx
    // Hasil orderId: RFX-dHBsLTAx-1785600684096
    const orderId = `${payCode}-${Date.now()}`;

    // 2. (Opsional tapi Direkomendasikan) Simpan Data Pesanan Sementara ke Supabase
    /*
    const { error: dbError } = await supabase.from('orders').insert([{
      order_id: orderId,
      items: JSON.stringify(cart),
      total_amount: totalHarga,
      status: 'PENDING'
    }]);
    
    if (dbError) throw dbError;
    */

    // 3. Konfigurasi SDK Pakasir menggunakan credentials dari .env.local
    const projectSlug = process.env.PAKASIR_SLUG || 'rfx-visual-store';
    const apiKey = process.env.PAKASIR_API_KEY || '3gJdIUjvSw8c37AQhPHV9BG63gpQqR7p';

    if (!projectSlug || !apiKey) {
      return NextResponse.json({ error: 'Konfigurasi Pakasir belum lengkap di .env.local' }, { status: 500 });
    }

    const pakasirClient = new Pakasir({
      project: projectSlug,
      api_key: apiKey
    });

    // 4. Buat Transaksi ke Server Pakasir API
    // method: 'QRIS', onlyQris: true
    const transaction = await pakasirClient.createTransaction(
      orderId, 
      'QRIS', 
      totalHarga, 
      true
    );

    console.log("Pakasir API Response:", transaction);

    // 5. Kembalikan raw QRIS string (payment_number) untuk di-render In-App
    // dan URL checkout sebagai fallback
    return NextResponse.json({ 
      qris_string: transaction.payment.payment_number,
      checkout_url: transaction.payment.payment_url,
      order_id: transaction.order_id
    }, { status: 200 });

  } catch (error) {
    console.error('Error saat proses checkout Pakasir:', error);
    
    // Tangkap error message dari Pakasir jika ada
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan pada server saat menghubungi Pakasir';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
