import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const projectRoot = import.meta.dirname;
const clientRoot = path.resolve(projectRoot, "client");

export default defineConfig({
  root: clientRoot,
  appType: "spa",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: path.resolve(projectRoot, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: path.resolve(clientRoot, "index.html"),
        familias: path.resolve(clientRoot, "familias", "index.html"),
        empresas: path.resolve(clientRoot, "empresas", "index.html"),
        avaliacao: path.resolve(clientRoot, "avaliacao-neuropsicologica", "index.html"),
        planos: path.resolve(clientRoot, "planos", "index.html"),
        contato: path.resolve(clientRoot, "contato", "index.html"),
        obrigado: path.resolve(clientRoot, "obrigado", "index.html"),
      },
    },
  },
  server: { host: "0.0.0.0" },
});
