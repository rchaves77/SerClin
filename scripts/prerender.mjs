import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientRoot = path.join(projectRoot, "client");
const routes = [
  ["/", "index.html"],
  ["/familias", "familias/index.html"],
  ["/empresas", "empresas/index.html"],
  ["/avaliacao-neuropsicologica", "avaliacao-neuropsicologica/index.html"],
  ["/planos", "planos/index.html"],
  ["/contato", "contato/index.html"],
  ["/obrigado", "obrigado/index.html"],
];

const vite = await createServer({
  configFile: path.join(projectRoot, "vite.config.ts"),
  root: clientRoot,
  appType: "custom",
  server: { middlewareMode: true },
});

try {
  const { default: App } = await vite.ssrLoadModule("/src/App.tsx");

  for (const [route, relativePath] of routes) {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { location: { pathname: route } },
      writable: true,
    });

    const content = renderToString(React.createElement(App));
    const filePath = path.join(clientRoot, relativePath);
    const template = await readFile(filePath, "utf8");

    if (!template.includes("<!-- SERCLIN_SSR_START -->") || !template.includes("<!-- SERCLIN_SSR_END -->")) {
      throw new Error(`Marcadores SSR não encontrados em ${relativePath}`);
    }

    const prerendered = template.replace(
      /<!-- SERCLIN_SSR_START -->[\s\S]*?<!-- SERCLIN_SSR_END -->/,
      `<!-- SERCLIN_SSR_START -->${content}<!-- SERCLIN_SSR_END -->`,
    );
    await writeFile(filePath, prerendered, "utf8");
    console.log(`Pré-renderizado ${route} → ${relativePath}`);
  }
} finally {
  delete globalThis.window;
  await vite.close();
}
