const jsdomGlobal = require("jsdom-global");

// Inicializa jsdom antes de cargar polyfills y stubs
const cleanup = jsdomGlobal("", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});

const localStorageMock = {
  getItem: (key) => {
    return localStorageMock[key] || null;
  },
  setItem: (key, value) => {
    localStorageMock[key] = String(value);
  },
  removeItem: (key) => {
    delete localStorageMock[key];
  },
  clear: () => {
    Object.keys(localStorageMock).forEach((key) => {
      if (!['getItem', 'setItem', 'removeItem', 'clear'].includes(key)) {
        delete localStorageMock[key];
      }
    });
  },
};

global.localStorage = localStorageMock;
global.sessionStorage = localStorageMock;

if (global.window) {
  global.window.localStorage = localStorageMock;
  global.window.sessionStorage = localStorageMock;
}

// Stubs/registries de assets y polyfills
require("./register-assets.cjs"); // .png/.css/etc
require("./setup-jsdom.cjs");

module.exports = {
  mochaHooks: {
    afterAll() {
      try {
        if (global.window && Array.isArray(global.window.___mqls)) {
          for (const mql of global.window.___mqls) {
            try {
              mql.removeEventListener?.("change", () => {});
            } catch {}
            try {
              mql.removeListener?.(() => {});
            } catch {}
          }
          global.window.___mqls = [];
        }
      } catch {}

      try {
        cleanup();
      } catch {}
    },
  },
};
