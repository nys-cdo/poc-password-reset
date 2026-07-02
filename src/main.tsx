import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Load the NYSDS full stylesheet exactly once (reset + typography + tokens + utilities).
// Default theme is state-blue. `@nysds/styles/full` is the package-sanctioned
// specifier for dist/nysds-full.min.css (its exports map blocks the deep path).
import "@nysds/styles/full";

import "./i18n";
import "./styles/tokens.css";
import "./styles/components.css";
import { App } from "./App";
import { setupIcons } from "./setupIcons";

setupIcons();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
