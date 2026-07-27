import { LandingPage } from "./pages/Landing";
import { LoginPage } from "./pages/Login";
import { SignUpPage } from "./pages/Signup";
import App from "./App";
import { Navigate } from "react-router";
import { FeedPage } from "./pages/app/Feed";
import { ProfilePage } from "./pages/app/Profile";
import { UsersPage } from "./pages/app/Users";
import { NewPostPage } from "./pages/app/NewPost";
import { FollowersPage } from "./pages/app/Followers";
import { FollowingsPage } from "./pages/app/Followings";

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
    path: "/app",
    children: [
      {
        element: <Navigate to={"feed"} replace={true} />,
        index: true,
      },
      {
        element: <FeedPage />,
        path: "feed",
      },
      {
        element: <ProfilePage />,
        path: "me",
      },
      { element: <FollowersPage />, path: "me/followers" },
      { element: <FollowingsPage />, path: "me/followings" },
      {
        element: <UsersPage />,
        path: "users",
      },
      {
        element: <NewPostPage />,
        path: "newPost",
      },

      {
        element: <ProfilePage />,
        path: "users/:userId",
      },
      {
        element: <FollowersPage />,
        path: "users/:userId/followers",
      },
      {
        element: <FollowingsPage />,
        path: "users/:userId/followings",
      },
    ],
  },
];
