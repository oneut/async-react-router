import { createRollupConfig } from "./createRollupConfig";

export default createRollupConfig({
  input: "src/lib/index.js",
  output: {
    file: "lib/index.js",
    format: "cjs",
    name: "async-react-router",
    sourcemap: true
  }
});
