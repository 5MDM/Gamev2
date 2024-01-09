import {defineConfig} from "vite"
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  build: {
    target: "es2022",
    assetsInlineLimit: 0
  },
  plugins: [
    react({
      devTarget: "es2022",
    }),
  ],
  base: "/Gamev2/"
})