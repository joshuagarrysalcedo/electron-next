import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enable static HTML export for Electron and Capacitor
  distDir: 'out',
  images: {
    unoptimized: true, // Required for static export
  },
  // Disable server-side rendering as we'll use static export
  trailingSlash: true,
  
  // Exclude demo and example components from the build
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Exclude directories from the client build
      const excludePaths = [
        '/components/demo/',
        '/components/examples/'
      ];
      
      // Modify the module rules to exclude paths
      // config.module.rules.forEach((rule: { oneOf: any[]; }) => {
      //   if (rule.oneOf) {
      //     rule.oneOf.forEach((oneOfRule: { include: any; issuer: undefined; exclude: RegExp[]; }) => {
      //       if (oneOfRule.include && oneOfRule.issuer === undefined) {
      //         // Exclude the paths from being processed
      //         if (!oneOfRule.exclude) {
      //           oneOfRule.exclude = [];
      //         }
              
      //         if (Array.isArray(oneOfRule.exclude)) {
      //           oneOfRule.exclude.push(...excludePaths.map(path => new RegExp(path)));
      //         }
      //       }
      //     });
      //   }
      // });
    }
    
    return config;
  },
};

export default nextConfig;
