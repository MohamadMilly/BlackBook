import { House, LogOut, Plus, User, Users } from "lucide-react";
import { RouteLink } from "../../shared/ui/RouteLink";
import { useAuth } from "../../../contexts/authContext";
import { Button } from "../../shared/ui/Button";
import { useFollowRequestsCount } from "../../../hooks/api/users/useFollowRequestsCount";
import { NotificationCount } from "../../shared/ui/NotificationCount";

export function SideBar() {
  const { logout } = useAuth();
  const { count, isLoading } = useFollowRequestsCount("received");
  return (
    <aside className="h-[60px] md:h-full  flex items-center md:flex-col col-start-1 col-end-2 row-start-3 row-end-4 md:row-start-1 md:row-end-3  bg-neutral-900 border-r border-neutral-800 md:pt-6 p-2">
      <div className="grow flex md:flex-col gap-3 w-full">
        <nav className="w-full">
          <ul className="flex w-full md:flex-col gap-3">
            <li className="grow">
              <RouteLink
                className="w-full flex items-center gap-1 bg-neutral-800"
                route="/me/feed"
              >
                <House size={24} />
                <span className="hidden md:inline-block">Feed</span>
              </RouteLink>
            </li>
            <li className="grow">
              <RouteLink
                className=" w-full flex items-center gap-1"
                route="/me/profile"
              >
                <User size={24} />
                <span className="hidden md:inline-block">Profile</span>
              </RouteLink>
            </li>
            <li className="grow">
              <RouteLink
                className=" w-full flex items-center gap-1 relative"
                route="/me/users"
              >
                <Users size={24} />
                <span className="hidden md:inline-block">Users</span>
                {!isLoading && <NotificationCount count={count} />}
              </RouteLink>
            </li>
            <li className="grow">
              <RouteLink
                className=" w-full flex items-center gap-1"
                route="/me/newPost"
              >
                <Plus size={24} />
                <span className="hidden md:inline-block">New Post</span>
              </RouteLink>
            </li>
          </ul>
        </nav>
        <Button
          className="flex items-center gap-1 md:w-full md:mt-auto"
          onClick={logout}
        >
          <LogOut size={24} />
          <span className="hidden md:inline-block">Log out</span>
        </Button>
      </div>
    </aside>
  );
}
