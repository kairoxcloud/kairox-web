import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app";
import "./styles/globals.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("missing #root element");
}

async function render() {
  if (import.meta.env.DEV && window.location.search.includes("scratch")) {
    const { Scratch } = await import("./components/scratch");
    createRoot(root!).render(
      <StrictMode>
        <Scratch />
      </StrictMode>,
    );
    return;
  }
  createRoot(root!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void render();
