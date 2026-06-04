import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/SASOLOGO.png",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
