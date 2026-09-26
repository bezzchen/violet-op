import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [45, 60, 65, 70, 75, 78, 82, 84, 85, 92],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.valorant-api.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
