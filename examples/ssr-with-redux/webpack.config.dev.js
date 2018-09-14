import webpack from "webpack";
import Merge from "webpack-merge";
import CommonConfig from "./webpack.config.common.js";

module.exports = Merge(CommonConfig, {
  mode: "development",
  devtool: "cheap-module-inline-source-map",
  entry: ["webpack-hot-middleware/client"],
  output: {
    hotUpdateChunkFilename: "static/hot/hot-update.js",
    hotUpdateMainFilename: "static/hot/hot-update.json"
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
});
