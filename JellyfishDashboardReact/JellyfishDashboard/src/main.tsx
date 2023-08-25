import React from "react";
import ReactDOM from "react-dom/client";
import { App, JellyfishContextProvider } from "./components/App";
import "./styles.css";

// Create a Membrane client instance

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <JellyfishContextProvider>
      <App />
    </JellyfishContextProvider>
  </React.StrictMode>
);
