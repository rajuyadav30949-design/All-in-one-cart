import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  server: { host: "0.0.0.0" },
  build: { outDir: "dist", sourcemap: false }
});
