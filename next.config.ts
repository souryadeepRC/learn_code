import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Don't mark Prisma as external - let Next.js bundle it
  serverExternalPackages: [],
};

export default nextConfig;
