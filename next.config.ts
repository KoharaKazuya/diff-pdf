import withBundleAnalyzerInit from "@next/bundle-analyzer";
import localesPlugin from "@react-aria/optimize-locales-plugin";
import withSerwistInit from "@serwist/next";
import { glob } from "glob";
import type { NextConfig } from "next";

const withBundleAnalyzer = withBundleAnalyzerInit({
  enabled: process.env.ANALYZE === "true",
});
const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig: NextConfig = withBundleAnalyzer(
  withSerwist({
    // @see https://react-spectrum.adobe.com/react-spectrum/ssr.html#nextjs
    transpilePackages: [
      "@adobe/react-spectrum",
      "@react-spectrum/*",
      "@spectrum-icons/*",
    ].flatMap((spec) => glob.sync(`${spec}`, { cwd: "node_modules/" })),

    // @see https://react-spectrum.adobe.com/react-spectrum/ssr.html#nextjs-app-router
    webpack(config, { isServer }) {
      if (!isServer) {
        // Don't include any locale strings in the client JS bundle.
        config.plugins.push(localesPlugin.webpack({ locales: [] }));
      }
      return config;
    },
  }),
);

export default nextConfig;
