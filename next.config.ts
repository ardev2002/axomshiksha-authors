import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  cacheComponents: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "axomshiksha.s3.ap-south-1.amazonaws.com"
      }
    ]
  }
};
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
})
export default withMDX(nextConfig);
