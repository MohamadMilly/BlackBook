import { House, LogOut, Plus, User, Users } from "lucide-react";
import { RouteLink } from "../../shared/ui/RouteLink";
import { useAuth } from "../../../contexts/authContext";
import { Button } from "../../shared/ui/Button";

export function SideBar() {
  const { logout } = useAuth();
  return (
    <aside className="flex flex-col col-start-1 col-end-2 row-start-1 row-end-3 bg-neutral-900 border-r border-neutral-800 pt-6 p-2">
      <nav>
        <ul className="flex flex-col gap-3">
          <li>
            <RouteLink
              className="w-full flex items-center gap-1 bg-neutral-800"
              route="/me/feed"
            >
              <House size={24} />
              <span>Feed</span>
            </RouteLink>
          </li>
          <li>
            <RouteLink
              className="w-full flex items-center gap-1"
              route="/me/profile"
            >
              <User size={24} />
              <span>Profile</span>
            </RouteLink>
          </li>
          <li>
            <RouteLink
              className="w-full flex items-center gap-1"
              route="/me/users"
            >
              <Users size={24} />
              <span>Users</span>
            </RouteLink>
          </li>
          <li>
            <RouteLink
              className="w-full flex items-center gap-1"
              route="/me/newPost"
            >
              <Plus size={24} />
              <span>New Post</span>
            </RouteLink>
          </li>
        </ul>
      </nav>
      <Button
        className="flex items-center gap-1 w-full mt-auto"
        onClick={logout}
      >
        <LogOut size={24} />
        <span>Log out</span>
      </Button>
    </aside>
  );
}
