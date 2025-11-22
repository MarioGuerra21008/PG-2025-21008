process.env.VITE_API_BASE_URL =
  process.env.VITE_API_BASE_URL || "http://localhost:5173";
process.env.NODE_ENV = process.env.NODE_ENV || "test";

// Hook para transformar código en tiempo de carga
let hookInstalled = false;

function installHook() {
  if (hookInstalled) return;

  try {
    const { addHook } = require("pirates");

    addHook(
      (code, filename) => {
        if (filename.includes("node_modules")) return code;
        if (filename.includes("mocha_tests")) return code;

        let transformed = code.replace(
          /import\.meta\.env\.(\w+)/g,
          "process.env.$1"
        );

        transformed = transformed.replace(
          /import\.meta\.env(?!\.)/g,
          "process.env"
        );

        return transformed;
      },
      {
        exts: [".ts", ".tsx", ".js", ".jsx"],
        ignoreNodeModules: true,
      }
    );

    hookInstalled = true;
  } catch (e) {}
}

installHook();

module.exports = {};
