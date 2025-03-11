import { defineConfig } from "vite";
import path from "path"
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env.SCRIBEAI_API_KEY': JSON.stringify(process.env.SCRIBEAI_API_KEY),
    'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL),
    'process.env.VITE_SCRIBEAI_API_KEY': JSON.stringify(process.env.VITE_SCRIBEAI_API_KEY),
    'process.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL),
  }
});
