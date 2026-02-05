var path = require("path");
var webpack = require("webpack");

var ESLintPlugin = require("eslint-webpack-plugin");
var TerserPlugin = require("terser-webpack-plugin");
var NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const entryFile = fs.existsSync(path.resolve(__dirname, "../src/index.ts"))
  ? path.resolve(__dirname, "../src/index.ts")
  : path.resolve(__dirname, "../src/index.js");

const config = {
  target: "web",
  // https://stackoverflow.com/a/34018909
  entry: {
    "stellar-base": entryFile,
    "stellar-base.min": entryFile
  },
  resolve: {
    fallback: {
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer")
    },
    extensions: [".ts", ".js"]
  },
  output: {
    clean: true,
    library: {
      name: "StellarBase",
      type: "umd",
      umdNamedDefine: true
    },
    path: path.resolve(__dirname, "../dist")
  },
  mode: process.env.NODE_ENV ?? "development",
  devtool: process.env.NODE_ENV === "production" ? false : "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: ["@babel/preset-env", "@babel/preset-typescript"]
          }
        }
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules\/(?!(js-xdr))/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/,
        terserOptions: {
          format: {
            ascii_only: true
          }
        }
      })
    ]
  },
  plugins: [
    // this must be first for karma to work (see line 5 of karma.conf.js)
    new ESLintPlugin({
      overrideConfigFile: path.resolve(__dirname, "./.eslintrc.js")
    }),
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"]
    })
  ],
  watchOptions: {
    ignored: /(node_modules|coverage|lib|dist)/
  }
};

module.exports = config;
