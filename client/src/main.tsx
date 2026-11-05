import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Elemento #root não encontrado.");
}

const application = <App />;

if (container.firstElementChild && !import.meta.env.DEV) {
  hydrateRoot(container, application);
} else {
  createRoot(container).render(application);
}
