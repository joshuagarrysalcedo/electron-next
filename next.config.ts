import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enable static HTML export for Electron and Capacitor
  distDir: 'out',
  images: {
    unoptimized: true, // Required for static export
  },
  // Disable server-side rendering as we'll use static export
  trailingSlash: true,
};

export default nextConfig;
