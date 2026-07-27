import type { JSX } from "react/jsx-runtime";

export function ProfileIdentitySkeleton({
  className = "",
}: {
  className?: string;
}): JSX.Element {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Top Section: Name & Button Wrapper */}
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
        {/* Name Placeholder (text-xl height equivalent) */}
        <div className="h-7 w-32 rounded bg-neutral-800" />

        {/* Button Placeholder (matches rounded-full, sizing, and vertical spacing) */}
        <div className="h-6 w-12 rounded-full bg-neutral-800/60" />
      </div>

      {/* Bottom Section: Followers & Following Stats Wrapper */}
      <div className="mt-2 flex gap-1">
        {/* Followers Count Placeholder */}
        <div className="h-5 w-20 rounded bg-neutral-800/70" />

        {/* Divider Dot Placeholder */}
        <span className="text-neutral-600">•</span>

        {/* Following Count Placeholder */}
        <div className="h-5 w-20 rounded bg-neutral-800/70" />
      </div>
    </div>
  );
}
