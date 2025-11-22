import "@testing-library/jest-dom";

import { TextDecoder, TextEncoder } from "util";

Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        BASE_URL: 'http://localhost:5173',
        VITE_API_BASE_URL: 'https://santa-ana-api.onrender.com',
        VITE_API_MOBILE_URL: 'https://santaana-api-latest.onrender.com',
        VITE_API_MOBILE_KEY: 'mF8arVnkjwqjpye6r0ZRnIyJq8yLa2_ZSqHxHbXqV24',
      },
    },
  },
  writable: true,
  configurable: true,
});

if (!(global as any).TextEncoder) (global as any).TextEncoder = TextEncoder;
if (!(global as any).TextDecoder)
  (global as any).TextDecoder = TextDecoder as any;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // legacy
    removeListener: jest.fn(),
    addEventListener: jest.fn(), // moderno
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const _getComputedStyle = window.getComputedStyle?.bind(
  window
) as typeof window.getComputedStyle;
window.getComputedStyle = ((elt: Element) => {
  return _getComputedStyle ?
      _getComputedStyle(elt)
    : ({ getPropertyValue: () => "" } as any);
}) as typeof window.getComputedStyle;

jest.mock("@ant-design/plots", () => {
  const React = require("react");
  const stub = (testId: string) => (props: any) =>
    React.createElement("div", {
      "data-testid": props?.["data-testid"] || testId,
    });

  return {
    __esModule: true,
    Line: stub("ant-plot-line"),
    Column: stub("ant-plot-column"),
    Pie: stub("ant-plot-pie"),
    Area: stub("ant-plot-area"),
  };
});

jest.mock("@/features/user-autentication/services/auth.service", () => {
  const api = {
    defaults: { headers: { common: {} as Record<string, string> } },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  return {
    api,
    loginUser: jest.fn(async () => ({ access_token: "t", refresh_token: "r", user: { nombre: "Test" } })),
    logoutUser: jest.fn(async () => ({})),
    refreshToken: jest.fn(async () => ({ access_token: "t2" })),
  };
});

jest.mock("@/features/users-list/hooks/useQrAuth", () => ({
  useQrAuth: jest.fn(() => ({
    data: null,
    loading: false,
    error: null,
    startQr: jest.fn(),
  })),
}));

// Mock de react-pdf
jest.mock("react-pdf", () => ({
  Document: ({ children, onLoadSuccess }: any) => {
    if (onLoadSuccess) {
      setTimeout(() => onLoadSuccess({ numPages: 1 }), 0);
    }
    return children || null;
  },
  Page: () => "MockPDFPage",
  pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: "",
    },
  },
}));

const originalError = console.error;
const originalWarn = console.warn;

type Filter = (msg: string, args: unknown[]) => boolean;

const toMsg = (args: unknown[]) =>
  args
    .map((a) =>
      typeof a === "string" ? a
      : a instanceof Error ? a.message
      : (() => {
          try {
            return JSON.stringify(a);
          } catch {
            return String(a);
          }
        })()
    )
    .join(" ");

const shouldIgnore = (filters: Filter[], msg: string, args: unknown[]) =>
  filters.some((f) => f(msg, args));

const errorFilters: Filter[] = [
  (m) => m.includes("[antd: Modal] `visible` is deprecated"),
  (m) => /Not implemented:\s*window\.getComputedStyle/i.test(m),
  (m) => /Each child in a list should have a unique "key" prop/i.test(m),
  (m) =>
    /not wrapped in act/i.test(m) &&
    /(rc-menu|antd[\/\\]lib[\/\\]menu)/i.test(m),
];

const warnFilters: Filter[] = [
  (m) => /A function to advance timers was called/i.test(m),
  (m) => /^paginas:\s*/i.test(m),
];

const SHOW_IGNORED = process.env.SHOW_IGNORED_LOGS === "1";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
    const msg = toMsg(args);
    if (shouldIgnore(errorFilters, msg, args)) {
      if (SHOW_IGNORED) originalError("[IGNORED error]", ...(args as any));
      return;
    }
    originalError(...(args as any));
  });

  jest.spyOn(console, "warn").mockImplementation((...args: unknown[]) => {
    const msg = toMsg(args);
    if (shouldIgnore(warnFilters, msg, args)) {
      if (SHOW_IGNORED) originalWarn("[IGNORED warn]", ...(args as any));
      return;
    }
    originalWarn(...(args as any));
  });
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
  (console.warn as jest.Mock).mockRestore();
});