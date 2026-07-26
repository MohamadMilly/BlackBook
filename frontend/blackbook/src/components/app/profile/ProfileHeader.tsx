import type { JSX } from "react/jsx-runtime";
import { Avatar } from "./Avatar";
import { ProfileIdentity } from "./ProfileIdentity";
import type { FollowRequest } from "@app/types";

type ProfileHeaderProps = {
  bannerUrl: string | null | undefined;
  avatarUrl: string | null | undefined;
  name: string;
  isLoading: boolean;
  followersCount: number;
  followingCount: number;
  isCurrentUserProfile: boolean;
  hasPendingFollowRequest: boolean;
  pendingFollowRequest: FollowRequest | undefined;
  isFollowed: boolean;
  userId: number;
};

export function ProfileHeader({
  bannerUrl,
  avatarUrl,
  isLoading,
  name,
  followersCount,
  followingCount,
  isCurrentUserProfile,
  hasPendingFollowRequest,
  pendingFollowRequest,
  isFollowed,
  userId,
}: ProfileHeaderProps): JSX.Element {
  if (isLoading) return <p>loading...</p>;

  return (
    <div
      style={{
        backgroundImage: `url(${bannerUrl})`,
        backgroundSize: "cover",
      }}
      className="w-full min-h-48 md:min-h-75 bg-neutral-900 flex items-end px-6 rounded"
    >  
      <div className="w-full translate-y-1/3 flex gap-4 items-center justify-end md:justify-start md:flex-row flex-col">
        <Avatar
          avatarUrl={avatarUrl}
          size={130}
          className="md:w-45! md:h-45!"
        />
        <ProfileIdentity
          isLoading={isLoading}
          className="hidden md:block"
          followersCount={followersCount}
          name={name}
          followingCount={followingCount}
          isCurrentUserProfile={isCurrentUserProfile}
          hasPendingFollowRequest={hasPendingFollowRequest}
          isFollowed={isFollowed}
          userId={userId}
          pendingFollowRequest={pendingFollowRequest}
        />
      </div>
    </div>
  );
}
