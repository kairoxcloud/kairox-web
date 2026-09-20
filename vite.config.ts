import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  plugins: [react(), tailwindcss(), imagetools()],
  resolve: {
    alias: { "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)) },
  },
  server: { port: 5174, strictPort: true },
  preview: { port: 4174, strictPort: true },
});
