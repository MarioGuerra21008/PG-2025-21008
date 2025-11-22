const g = globalThis;
const w = g.window;

if (!w) {
  throw new Error(
    "jsdom-global/register debe cargarse antes que setup-jsdom.cjs"
  );
}

// Sube tipos DOM al global
g.HTMLElement = g.HTMLElement || w.HTMLElement;
g.SVGElement = g.SVGElement || w.SVGElement;
g.ShadowRoot = g.ShadowRoot || w.ShadowRoot || function ShadowRoot() {};
g.Node = g.Node || w.Node;

// matchMedia que usa antd para breakpoints
if (!w.matchMedia) {
  w.matchMedia = () => ({
    matches: false,
    media: "",
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  });
}

// ResizeObserver que piden rc-resize-observer / antd
if (!w.ResizeObserver) {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  w.ResizeObserver = ResizeObserver;
  g.ResizeObserver = ResizeObserver;
}

// MutationObserver
if (!w.MutationObserver) {
  class MutationObserver {
    constructor(cb) {}
    observe() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  w.MutationObserver = MutationObserver;
  g.MutationObserver = MutationObserver;
}

// getComputedStyle y RAF
w.getComputedStyle ||= () => ({});
w.requestAnimationFrame ||= (cb) => setTimeout(cb, 0);
w.cancelAnimationFrame ||= (id) => clearTimeout(id);
