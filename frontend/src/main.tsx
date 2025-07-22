import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";  // Tu App.tsx que contiene BrowserRouter y las rutas
import "./index.css";    // Tailwind u otros estilos globales

// Busca el elemento root que debe estar en index.html
const rootElement = document.getElementById("root") as HTMLElement;

if (!rootElement) {
  throw new Error("No se encontró el elemento #root en index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
