import type { JSX } from "react/jsx-runtime";
import { ProfileIdentitySkeleton } from "./ProfileIdentitySkeleton";

export function ProfileHeaderSkeleton(): JSX.Element {
  return (
    <div className="w-full min-h-48 md:min-h-75 bg-neutral-900 flex items-end px-6 rounded animate-pulse">
      <div className="w-full translate-y-1/3 flex gap-4 items-center justify-end md:justify-start md:flex-row flex-col">
        {/* Avatar Skeleton Placeholder */}
        <div className="w-[130px] h-[130px] md:w-[180px] md:h-[180px] rounded-full bg-neutral-800 border-4 border-neutral-900" />

        <ProfileIdentitySkeleton className="hidden md:block" />
      </div>
    </div>
  );
}
