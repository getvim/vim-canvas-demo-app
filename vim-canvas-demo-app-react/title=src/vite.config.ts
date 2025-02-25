import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// Add a flag to disable the API proxy based on an env variable
const disableApiProxy = process.env.VITE_DISABLE_API_PROXY === "true";

export default defineConfig({
  plugins: [react()],
  server: {
    // Only enable the proxy if we're not disabling it
    proxy: disableApiProxy
      ? {}
      : {
          '/api': {
            target: 'https://api-devs-8a32c93f7e2d.herokuapp.com',
            changeOrigin: true,
            secure: false,
          },
        },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}); 