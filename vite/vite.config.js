import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 設定 @ 符號指向 src 資料夾
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssMinify: false,
  },
  base: "./", // 設為相對路徑
});
