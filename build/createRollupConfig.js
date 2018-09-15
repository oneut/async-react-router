import babel from "rollup-plugin-babel";
import filesize from "rollup-plugin-filesize";

export function createRollupConfig(config) {
  return {
    input: config.input,
    output: config.output,
    external: ["history", "path-to-regexp", "react", "rxjs", "rxjs/operators"],
    plugins: [babel(), filesize()]
  };
}
