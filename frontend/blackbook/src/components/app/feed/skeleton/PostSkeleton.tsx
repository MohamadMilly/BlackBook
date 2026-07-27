import type { JSX } from "react/jsx-runtime";

export function PostSkeleton(): JSX.Element {
  return (
    <article className="p-4 border border-neutral-800 rounded-xl shadow-sm bg-neutral-950 animate-pulse">
      {/* Header Section: Avatar, Name & Date */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          {/* Avatar Circle Placeholder (size 40) */}
          <div className="h-10 w-10 rounded-full bg-neutral-800" />
          {/* Author Name Placeholder */}
          <div className="h-4 w-28 rounded bg-neutral-800" />
        </div>
        {/* Date Placeholder */}
        <div className="h-3 w-16 rounded bg-neutral-800/60" />
      </div>

      {/* Body Content Section: Title & Paragraph Content */}
      <div className="space-y-3 mb-5 min-h-40">
        {/* Title Placeholder */}
        <div className="h-6 w-3/4 rounded-md bg-neutral-800" />

        {/* Multi-line Content Placeholders */}
        <div className="space-y-2 pt-2">
          <div className="h-4 w-5/6 rounded bg-neutral-800/70" />
          <div className="h-4 w-5/6 rounded bg-neutral-800/70" />
          <div className="h-4 w-5/6 rounded bg-neutral-800/70" />
        </div>
      </div>

      {/* Footer Action Buttons Section */}
      <div className="flex items-center border border-neutral-800 rounded-lg divide-x divide-neutral-800 h-10 bg-neutral-900/30">
        {/* Like Button Placeholder */}
        <div className="grow h-full flex items-center justify-center gap-2">
          <div className="h-5 w-5 rounded bg-neutral-800/60" />
          <div className="h-3 w-14 rounded bg-neutral-800/60" />
        </div>
        {/* Comment Button Placeholder */}
        <div className="grow h-full flex items-center justify-center gap-2">
          <div className="h-5 w-5 rounded bg-neutral-800/60" />
          <div className="h-3 w-20 rounded bg-neutral-800/60" />
        </div>
      </div>
    </article>
  );
}
