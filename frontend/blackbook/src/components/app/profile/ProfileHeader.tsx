import type { JSX } from "react/jsx-runtime";
import { Avatar } from "./Avatar";

export function ProfileHeader({
  bannerUrl,
  avatarUrl,
  isLoading,
  name,
}: {
  bannerUrl: string;
  avatarUrl: string;
  name: string;
  isLoading: boolean;
}): JSX.Element {
  if (isLoading) return <p>loading...</p>;
  return (
    <div
      style={{
        backgroundImage: `url(${bannerUrl})`,
        backgroundSize: "cover",
      }}
      className="w-full min-h-75 bg-neutral-900 flex items-end px-6 rounded"
    >
      <div className="translate-y-1/3 flex gap-4 items-center flex-wrap">
        <Avatar avatarUrl={avatarUrl} size={180} />
        <p className="text-xl text-centent mix-blend-difference">{name}</p>
      </div>
    </div>
  );
}
