import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the ScribeAI server.
      // Remove the rewrite rule so that the "/api" prefix is preserved.
      '/api': {
        target: 'https://api-unique-stg-1048c00a084a.herokuapp.com',
        changeOrigin: true,
        secure: false,
        // Removed: rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}); 