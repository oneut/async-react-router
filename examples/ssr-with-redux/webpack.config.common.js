const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin")
  .default;
const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  cache: true,
  context: __dirname,
  entry: ["./src/app/index.js"],
  output: {
    path: path.join(__dirname, "build"),
    publicPath: "/",
    filename: "static/js/[name].[hash:8].js",
    chunkFilename: "static/js/[name].[hash:8].chunk.js"
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      name: "vendors"
    },
    runtimeChunk: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "./src/view/index.html",
      filename: "./view/index.html",
      favicon: "./src/images/favicon.ico",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[hash].css",
      chunkFilename: "static/css/[id].css"
    }),
    new HTMLInlineCSSWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/(node_modules)/],
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            presets: ["@babel/preset-env", "@babel/preset-react"].map(
              require.resolve
            ),
            plugins: [
              "@babel/plugin-transform-runtime",
              "babel-plugin-syntax-dynamic-import"
            ].map(require.resolve)
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.js$/,
        exclude: [/async-react-router/, /node_modules/],
        use: {
          loader: "eslint-loader",
          options: {
            configFile: "./.eslintrc"
          }
        }
      },
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/
        ],
        loader: require.resolve("file-loader"),
        options: {
          name: "static/media/[name].[hash:8].[ext]"
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader"
        }
      }
    ]
  }
};
