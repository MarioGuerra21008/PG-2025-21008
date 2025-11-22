require("@swc/register")({
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: true,
      dynamicImport: true,
      decorators: false,
    },
    transform: {
      react: {
        runtime: "automatic",
        development: false,
      },
    },
    target: "es2020",
  },
  module: {
    type: "commonjs",
    strict: false,
    strictMode: false,
    lazy: false,
    noInterop: false,
  },
  ignore: [/node_modules/],
  extensions: [".ts", ".tsx", ".js", ".jsx"],
});

module.exports = {};
