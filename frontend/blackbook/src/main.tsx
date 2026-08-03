import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./providers/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NotificationsProvider } from "./providers/NotificationsProvider";

const router = createBrowserRouter(routes);

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <AuthProvider>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
          locale="en"
        >
          <NotificationsProvider>
            <RouterProvider router={router} />
          </NotificationsProvider>
        </GoogleOAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
