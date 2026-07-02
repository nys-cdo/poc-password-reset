import { Navigate, type RouteObject } from "react-router-dom";

import { AppLayout } from "./layout/AppLayout";
import { DEFAULT_LOCALE } from "./i18n/locales";
import { Home } from "./pages/Home";
import { Faq } from "./pages/Faq";
import { KnowledgeBase } from "./pages/KnowledgeBase";
import { Article } from "./pages/Article";
import { Accessibility } from "./pages/Accessibility";
import { PasswordRecovery } from "./pages/PasswordRecovery";
import { Privacy } from "./pages/Privacy";
import { Tickets } from "./pages/Tickets";
import { NotFound } from "./pages/NotFound";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to={`/${DEFAULT_LOCALE}`} replace />,
  },
  {
    path: "/:lang",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "faq", element: <Faq /> },
      { path: "resident/knowledge", element: <KnowledgeBase /> },
      { path: "resident/knowledge/:id", element: <Article /> },
      { path: "accessibility", element: <Accessibility /> },
      { path: "resident/password-reset/forgot", element: <PasswordRecovery /> },
      { path: "privacy", element: <Privacy /> },
      { path: "resident/a/tickets", element: <Tickets /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
