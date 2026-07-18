import { LogIn, UserPlus } from "lucide-react";
import { RouteLink } from "../shared/ui/RouteLink";

export function LandingHeader() {
  return (
    <header className="relative max-w-4xl mx-auto mt-12 px-8 py-10 md:rounded-2xl bg-linear-155 from-neutral-950 via-black to-blue-950/40 text-center overflow-hidden">
      <h1 className="text-5xl sm:text-6xl">BlackBook</h1>
      <p className="relative max-w-xl mx-auto text-base sm:text-lg text-neutral-400 font-medium leading-relaxed">
        The top social media platform to share your ideas and communicate with
        your friends and family.
      </p>

      <ul className="flex gap-2 justify-center mt-6">
        <li>
          <RouteLink className="flex items-center gap-1" route="/log-in">
            <LogIn size={16} aria-hidden={true} />
            <span>Log in</span>
          </RouteLink>
        </li>
        <li>
          <RouteLink className="flex items-center gap-1" route="/log-in">
            <UserPlus size={16} />
            <span>Sign up</span>
          </RouteLink>
        </li>
      </ul>
    </header>
  );
}
