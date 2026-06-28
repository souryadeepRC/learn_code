import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Don't mark Prisma as external - let Next.js bundle it
  serverExternalPackages: [],
  allowedDevOrigins: ['192.168.1.8'],
};

export default nextConfig;
