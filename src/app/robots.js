export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/admin',
      },
    ],
    sitemap: 'https://rfxvisual.my.id/sitemap.xml',
  }
}
