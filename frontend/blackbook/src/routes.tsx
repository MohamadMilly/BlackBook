import { LandingPage } from "./pages/Landing";
import { LoginPage } from "./pages/Login";
import { SignUpPage } from "./pages/Signup";

export const routes = [
  {
    element: <LandingPage />,
    path: "/",
  },
  {
    element: <LoginPage />,
    path: "/log-in",
  },
  {
    element: <SignUpPage />,
    path: "/sign-up",
  },
];
