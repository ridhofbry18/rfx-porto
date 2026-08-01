import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host');

  // Subdomain target untuk link-in-bio
  const linksSubdomain = 'link.rfxvisual.my.id';

  // Jika pengunjung mengakses dari link.rfxvisual.my.id atau link.localhost (untuk testing lokal)
  if (
    hostname === linksSubdomain || 
    hostname === `www.${linksSubdomain}` || 
    hostname === 'link.localhost:3000' || 
    hostname === 'link.localhost'
  ) {
    // Kita arahkan (rewrite) ke folder /rfx-links
    // Pastikan kita tidak melakukan rewrite ganda jika URL sudah mengandung /rfx-links
    if (!url.pathname.startsWith('/rfx-links')) {
      // Jika url aslinya '/' menjadi '/rfx-links'
      // Jika url aslinya '/orderweb' menjadi '/rfx-links/orderweb'
      url.pathname = `/rfx-links${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Untuk hostname lain (seperti rfx.web.id), biarkan berjalan normal
  return NextResponse.next();
}

// Konfigurasi matcher agar middleware tidak memblokir atau membebani file statis (gambar, audio, dll)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3)$).*)',
  ],
};
