import type { JSX } from "react/jsx-runtime";

export function CommentSkeleton(): JSX.Element {
  return (
    <div className="m-2 flex gap-1 items-end animate-pulse">
      {/* Avatar Circle Placeholder (size 40 matching) */}
      <div className="h-10 w-10 rounded-full bg-neutral-800 shrink-0" />

      {/* Comment Bubble Placeholder Container */}
      <article className="grow bg-neutral-900 py-2.5 px-3 rounded-t-xl rounded-r-xl rounded-bl-none space-y-2">
        {/* Author Fullname Header Line */}
        <div className="h-3 w-32 rounded bg-neutral-800" />

        {/* Comment Content Text Lines */}
        <div className="space-y-1">
          <div className="h-3 w-full rounded bg-neutral-800/70" />
          <div className="h-3 w-5/6 rounded bg-neutral-800/70" />
        </div>
      </article>
    </div>
  );
}
