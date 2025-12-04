import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import Sitemap from "vite-plugin-sitemap";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    target: "esnext",
    minify: "esbuild",
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    Sitemap({
      hostname: "https://eclat-toolkit.lovable.app",
      dynamicRoutes: ["/", "/auth"],
      exclude: ["/onboarding", "/dashboard", "/catalogue", "/simulations", "/settings", "/tools/*"],
      changefreq: "weekly",
      priority: 0.8,
      outDir: "dist",
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
