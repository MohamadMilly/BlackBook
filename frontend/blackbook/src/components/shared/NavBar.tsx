import { LogIn, Menu, UserPlus } from "lucide-react";
import { RouteLink } from "./ui/RouteLink";
import { SideDrawer } from "./ui/SideDrawer";

export function NavBar() {
  return (
    <nav className="sticky top-0 md:top-4 z-10 animate-slideDown max-w-250 w-full mx-auto flex justify-between items-center md:shadow-inner md:shadow-white/30 shadow-none md:rounded-full border-b border-neutral-700/80 md:border-none md:mt-4 px-3 md:px-6 backdrop-blur-sm py-3">
      <div className="w-12 h-12 flex justify-center items-center">
        <img
          className="object-cover"
          src="/BlackBook_logo.png"
          alt="BlackBook Logo"
        />
      </div>
      <ul className=" gap-2 hidden md:flex">
        <li>
          <RouteLink className="flex items-center gap-1" route="/log-in">
            <LogIn size={16} aria-hidden={true} />
            <span>Log in</span>
          </RouteLink>
        </li>
        <li>
          <RouteLink className="flex items-center gap-1" route="/sign-up">
            <UserPlus size={16} />
            <span>Sign up</span>
          </RouteLink>
        </li>
      </ul>
      <SideDrawer
        toggleButtonChildren={<Menu size={20} />}
        children={
          <ul className="flex flex-col w-full gap-2">
            <li>
              <RouteLink
                className="flex items-center gap-1 w-full"
                route="/log-in"
              >
                <LogIn size={16} aria-hidden={true} />
                <span>Log in</span>
              </RouteLink>
            </li>
            <li>
              <RouteLink
                className="flex items-center gap-1 w-full"
                route="/sign-up"
              >
                <UserPlus size={16} />
                <span>Sign up</span>
              </RouteLink>
            </li>
          </ul>
        }
        panelTitle="Main Menu"
      />
    </nav>
  );
}
