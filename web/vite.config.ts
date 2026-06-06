import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// Env vars are loaded automatically from .env / .env.local. Only `VITE_`-prefixed
// variables are exposed to client code via `import.meta.env` (see src/config/env.ts).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    // Deterministic env for tests (no reliance on a local .env.local).
    env: {
      VITE_APTOS_MODULE_ADDRESS: "0x1",
      VITE_APTOS_MODULE_NAME: "ticket_nft",
      VITE_APTOS_NETWORK: "testnet",
    },
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/test/**", "src/main.tsx"],
    },
  },
});
