import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n.js";
import { Suspense } from "react";
createRoot(document.getElementById("root")).render(
  <Suspense fallback="loading">
    <App />
  </Suspense>,
);
