import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'http://51.20.143.136:5000/:path*',
      },
    ];
  },
};

export default nextConfig;