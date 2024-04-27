import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  // @ts-ignore
  base: process.env.GH_PAGES ? "/bvote-react/" : "./",
  server: {
    fs: {
      allow: ["../sdk", "./"],
    },
  },
});
