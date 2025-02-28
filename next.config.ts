import withBundleAnalyzerInit from '@next/bundle-analyzer';
import withSerwistInit from "@serwist/next";
import { glob } from 'glob';
import type { NextConfig } from 'next';

const withBundleAnalyzer = withBundleAnalyzerInit({
  enabled: process.env.ANALYZE === "true",
});
const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig: NextConfig = withBundleAnalyzer(withSerwist({
  reactStrictMode: true, // TODO: app router に移行して削除

  // @see https://react-spectrum.adobe.com/react-spectrum/ssr.html#nextjs
  transpilePackages: [
    '@adobe/react-spectrum',
    '@react-spectrum/*',
    '@spectrum-icons/*'
  ].flatMap((spec) => glob.sync(`${spec}`, { cwd: 'node_modules/' }))
}));

export default nextConfig;
