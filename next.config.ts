import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  /* config options here */
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
