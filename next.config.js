const withPlugins = require("next-compose-plugins");
const withCSS = require("@zeit/next-css");
const withTM = require("next-transpile-modules")([
  "@adobe/react-spectrum",
  "@spectrum-icons/.*",
  "@react-spectrum/.*",
]);
const WorkerPlugin = require("worker-plugin");

module.exports = withPlugins([withCSS, withTM], {
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

  reactStrictMode: true,
});
