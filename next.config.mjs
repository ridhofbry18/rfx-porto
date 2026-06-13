/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'cdn-icons-png.flaticon.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/orderweb',
        destination: '/rfx-links/orderweb',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
