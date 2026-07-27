import {
  ChevronsLeftRight,
  ChevronsRightLeft,
  House,
  LogOut,
  Plus,
  User,
  Users,
} from "lucide-react";
import { RouteLink } from "../../shared/ui/RouteLink";
import { useAuth } from "../../../contexts/authContext";
import { Button } from "../../shared/ui/Button";
import { useFollowRequestsCount } from "../../../hooks/api/users/useFollowRequestsCount";
import { NotificationCount } from "../../shared/ui/NotificationCount";
import { useState } from "react";

const storedIsCollapsedState = JSON.parse(
  localStorage.getItem("isSideBarCollapsed") ?? "false",
);

export function SideBar() {
  const { logout } = useAuth();
  const { count, isLoading } = useFollowRequestsCount("received");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    storedIsCollapsedState,
  );
  const handleToggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("isSideBarCollapsed", JSON.stringify(next));
  };

  const sideBarItemTitleClassName = `sr-only md:not-sr-only ${isCollapsed ? "sr-only!" : ""}`;
  return (
    <aside
      className={`w-full h-[60px] ${isCollapsed ? "md:w-18" : "md:w-37.5"} md:h-full flex items-center md:flex-col transition-all duration-300 ease-in-out col-start-1 col-end-2 row-start-3 row-end-4 md:row-start-1 md:row-end-3  bg-neutral-900 border-r border-neutral-800 md:pt-6 p-2`}
    >
      <div className="grow flex md:flex-col gap-3 w-full">
        <Button className="hidden md:flex" onClick={handleToggleCollapse}>
          {isCollapsed ? (
            <ChevronsLeftRight size={18} />
          ) : (
            <ChevronsRightLeft size={18} />
          )}
          <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"}</span>
        </Button>
        <nav className="w-full">
          <ul className="flex w-full md:flex-col gap-3">
            <li className="grow">
              <RouteLink
                className="w-full flex items-center gap-1 bg-neutral-800"
                route="/app/feed"
              >
                <House size={22} />
                <span className={sideBarItemTitleClassName}>Feed</span>
              </RouteLink>
            </li>
            <li className="grow">
              <RouteLink
                className=" w-full flex items-center gap-1"
                route="/app/me"
              >
                <User size={22} />
                <span className={sideBarItemTitleClassName}>Profile</span>
              </RouteLink>
            </li>
            <li className="grow">
              <RouteLink
                className=" w-full flex items-center gap-1 relative"
                route="/app/users"
              >
                <Users size={22} />
                <span className={sideBarItemTitleClassName}>Users</span>
                {!isLoading && <NotificationCount count={count} />}
              </RouteLink>
            </li>
            <li className="grow">
              <RouteLink
                className=" w-full flex items-center gap-1"
                route="/app/newPost"
              >
                <Plus size={22} />
                <span className={sideBarItemTitleClassName}>New Post</span>
              </RouteLink>
            </li>
          </ul>
        </nav>
        <Button
          className="flex items-center gap-1 md:w-full md:mt-auto"
          onClick={logout}
        >
          <LogOut size={22} />
          <span className={sideBarItemTitleClassName}>Log out</span>
        </Button>
      </div>
    </aside>
  );
}
