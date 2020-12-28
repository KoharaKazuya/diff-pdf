const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withPWA = require("next-pwa");
const withCSS = require("@zeit/next-css");
const withTM = require("next-transpile-modules")([
  "@adobe/react-spectrum",
  "@spectrum-icons/.*",
  "@react-spectrum/.*",
]);
const WorkerPlugin = require("worker-plugin");

module.exports = withPlugins([withBundleAnalyzer, withPWA, withCSS, withTM], {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      config.plugins.push(
        new WorkerPlugin({
          // use "self" as the global object when receiving hot updates.
          globalObject: "self",
        })
      );
    }
    return config;
  },

  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
  },

  reactStrictMode: true,
});
