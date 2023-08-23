import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./components/App";

// Create a Membrane client instance

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
