export function ProfileFieldSkeleton() {
  return (
    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg animate-pulse">
      {/* Top Section: Icon & Field Key Placeholders */}
      <dt className="flex items-center gap-1.5">
        {/* Icon Placeholder */}
        <div className="h-3.5 w-3.5 rounded bg-neutral-800" />
        {/* Field Key Title Placeholder */}
        <div className="h-3 w-16 rounded bg-neutral-800/80" />
      </dt>

      {/* Bottom Section: Main Value Placeholder */}
      <dd className="mt-2">
        <div className="h-4 w-28 rounded bg-neutral-800" />
      </dd>
    </div>
  );
}
