import { LandingPage } from "./pages/Landing";
import { LoginPage } from "./pages/Login";
import { SignUpPage } from "./pages/Signup";
import App from "./App";
import { Navigate } from "react-router";
import { FeedPage } from "./pages/app/Feed";
import { ProfilePage } from "./pages/app/Profile";
import { UsersPage } from "./pages/app/Users";
import { NewPostPage } from "./pages/app/NewPost";

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
  {
    element: <App />,
    path: "/me",
    children: [
      {
        element: <Navigate to={"feed"} replace />,
        index: true,
      },
      {
        element: <FeedPage />,
        path: "feed",
      },
      {
        element: <ProfilePage />,
        path: "profile",
      },
      {
        element: <UsersPage />,
        path: "users",
      },
      {
        element: <NewPostPage />,
        path: "newPost",
      },
    ],
  },
  {
    element: <ProfilePage />,
    path: "/users/:userId/profile",
  },
];
