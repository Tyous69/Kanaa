import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.scss";

// Restore dark mode on page load before React hydrates
const stored = localStorage.getItem("kanaa-store");
if (stored) {
  try {
    const parsed = JSON.parse(stored);
    if (parsed?.state?.darkMode) {
      document.documentElement.classList.add("dark");
    }
  } catch {
    // ignore parse errors
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);