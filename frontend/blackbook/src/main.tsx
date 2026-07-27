import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./providers/AuthProvider";
import { CommentsPanelContextProvider } from "./providers/CommentsPanelContextProvider";

const router = createBrowserRouter(routes);

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <AuthProvider>
        <CommentsPanelContextProvider>
          <RouterProvider router={router} />
        </CommentsPanelContextProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
