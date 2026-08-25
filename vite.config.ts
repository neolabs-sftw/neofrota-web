import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      workbox: { maximumFileSizeToCacheInBytes: 6 * 1024 * 1024 },
      manifest: {
        name: "NeoFrota WebSistema",
        short_name: "NeoFrota",
        description: "Sistema de Voucher Digital",
        theme_color: "#f4f4f4",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        background_color: "#f4f4f4",
      },
    }),
  ],
  base: "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
            if (id.includes("lottie-web") || id.includes("pdfmake")) {
              return "vendor-heavy";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
