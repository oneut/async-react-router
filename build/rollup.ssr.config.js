import { createRollupConfig } from "./createRollupConfig";

export default createRollupConfig({
  input: "src/ssr/index.js",
  output: {
    file: "ssr/index.js",
    format: "cjs",
    name: "async-react-router-ssr",
    sourcemap: true
  }
});
