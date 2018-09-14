const Merge = require("webpack-merge");
const CommonConfig = require("./webpack.config.common.js");

module.exports = Merge(CommonConfig, {
  mode: "production"
});
