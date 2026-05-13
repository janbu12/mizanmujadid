import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['promodernistic-distensible-kieth.ngrok-free.dev'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-portofolio.mzn.my.id',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Aturan ini berlaku untuk semua halaman
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=1, stale-while-revalidate=59',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
