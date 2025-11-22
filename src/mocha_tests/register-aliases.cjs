const Module = require("module");
const path = require("path");

const originalResolveFilename = Module._resolveFilename;

// Configuración de aliases
const aliases = {
  "@": path.resolve(process.cwd(), "src"),
  "@/": path.resolve(process.cwd(), "src"),
};

Module._resolveFilename = function (request, parent, isMain, options) {
  for (const [alias, aliasPath] of Object.entries(aliases)) {
    if (request === alias || request.startsWith(alias + "/")) {
      const newRequest = request.replace(alias, aliasPath);
      try {
        return originalResolveFilename.call(
          this,
          newRequest,
          parent,
          isMain,
          options
        );
      } catch (e) {}
    }
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

module.exports = {};
