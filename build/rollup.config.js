import babel from "rollup-plugin-babel";
import filesize from "rollup-plugin-filesize";
const resolve = require("rollup-plugin-node-resolve");

export default {
  input: "src/index.js",
  output: {
    file: "dist/index.js",
    format: "cjs",
    name: "async-react-router",
    sourcemap: true
  },
  external: ["history", "path-to-regexp", "react", "rxjs", "rxjs/operators"],
  plugins: [resolve(), babel(), filesize()]
};
