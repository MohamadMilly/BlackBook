import type { JSX, ReactNode } from "react";
import { NavLink } from "react-router";

type RouteLinkProps = {
  route: string;
  children: ReactNode;
  className?: string;
};

export function RouteLink({
  route,
  children,
  className = "",
}: RouteLinkProps): JSX.Element {
  const baseClass = `inline-flex items-center justify-center px-3.5 py-1.5 text-xs sm:text-base font-semibold tracking-wide capitalize text-white bg-neutral-800 hover:bg-black border border-white/10 shadow-[0_0_0_1px_rgba(0,0,0,1),0_1px_2px_rgba(0,0,0,0.05),0_0_12px_rgba(37,99,235,0.2)] hover:shadow-[0_0_0_1px_rgba(0,0,0,1),0_1px_2px_rgba(0,0,0,0.05),0_0_20px_rgba(37,99,235,0.45)] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 focus-visible:outline-none transition-all duration-150 tracking-tight cursor-pointer select-none rounded-md

 ${className}`;
  return (
    <NavLink
      className={({ isActive }: { isActive: boolean }): string => {
        if (isActive) {
          return `bg-blue-600! text-white! ${baseClass}`;
        } else {
          return baseClass;
        }
      }}
      to={route}
    >
      {children}
    </NavLink>
  );
}
