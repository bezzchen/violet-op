import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [45, 60, 65, 70, 75, 78, 85],
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
        hostname: "wiki.leagueoflegends.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
