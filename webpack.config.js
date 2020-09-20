const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLPlugin = require("html-webpack-plugin");
const WorkerPlugin = require("worker-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },

  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json", ".mjs", ".wasm"],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HTMLPlugin({
      template: path.join(__dirname, "src/index.html"),
    }),
    new WorkerPlugin({ globalObject: "self" }),
    new CopyPlugin({
      patterns: [{ context: "node_modules", from: "pdfjs-dist/cmaps/**/*" }],
    }),
  ],

  devServer: {
    /* /pdfjs-dist/cmaps/* にアクセスするため */
    contentBase: path.join(__dirname, "node_modules"),
  },
};
