import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['promodernistic-distensible-kieth.ngrok-free.dev'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-portofolio.mzn.my.id',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
