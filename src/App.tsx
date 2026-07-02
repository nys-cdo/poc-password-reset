import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { routes } from "./routes";

// Keep routing correct under a sub-path deploy (GitHub Pages) as well as at root:
// Vite injects the configured `base` as BASE_URL ("/" in dev, "/poc-password-reset/"
// in the production build). React Router wants no trailing slash except for root.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

const router = createBrowserRouter(routes, { basename });

export function App() {
  return <RouterProvider router={router} />;
}
