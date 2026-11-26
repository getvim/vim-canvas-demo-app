import { defineConfig } from "vite";
import path from "path"
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [{ src: "node_modules/pdfjs-dist/{cmaps,iccs,standard_fonts,wasm}", dest: "pdfjs" }],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
