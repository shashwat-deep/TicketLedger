import { defineConfig } from "vite";
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
});
