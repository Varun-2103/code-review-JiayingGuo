import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// In development, send /api requests to the Express server so the app and
// the API share one origin, the same as in production.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
