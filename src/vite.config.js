import { fileURLToPath, URL } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);

const DEV_CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' ws: wss: http://127.0.0.1:5173 http://localhost:5173 https://santa-ana-api.onrender.com https://santaana-api-latest.onrender.com http://127.0.0.1:8081 http://localhost:8081",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "form-action 'self'",
].join("; ");

function cspHeaderPlugin() {
  return {
    name: "dev-csp-header",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader("Content-Security-Policy", DEV_CSP);
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=(), accelerometer=(), gyroscope=(), payment=()");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
        next();
      });
    },
  };
}

export default defineConfig({
  build: { sourcemap: true},
  plugins: [
    react(),
    tailwindcss(),
    cspHeaderPlugin()
  ],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://santa-ana-api.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
