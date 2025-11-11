/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable source maps in production for smaller builds
  productionBrowserSourceMaps: false,

  // Enable compression
  compress: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['framer-motion', '@react-three/drei', '@react-three/fiber', 'three', 'gsap'],
  },

  // Webpack optimization
  webpack: (config, { isServer }) => {
    // Optimize for production
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
};

export default nextConfig;
