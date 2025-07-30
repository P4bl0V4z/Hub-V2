import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";


const rootElement = document.getElementById("root") as HTMLElement;

if (!rootElement) {
  throw new Error("No se encontró el elemento #root en index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
