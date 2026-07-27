import { Link } from "react-router";
import { UserRoundPlus, X } from "lucide-react";
import { useSendFollowRequest } from "../../../hooks/api/users/useSendFollowRequest";
import { useCallback } from "react";
import type { FollowRequest } from "@app/types";
import { useRejectOrCancelFollowRequest } from "../../../hooks/api/users/useRejectOrCancelFollowRequest";
import { useUnFollowUser } from "../../../hooks/api/users/useUnFollowUser";
import { ProfileIdentitySkeleton } from "./skeleton/ProfileIdentitySkeleton";

type ProfileIdentityProps = {
  name: string;
  followersCount: number;
  followingCount: number;
  className: string;
  isLoading: boolean;
  isCurrentUserProfile: boolean;
  hasPendingFollowRequest: boolean;
  isFollowed: boolean;
  userId: number;
  pendingFollowRequest: FollowRequest | null;
};

export function ProfileIdentity({
  name,
  followersCount,
  followingCount,
  className,
  isLoading,
  isCurrentUserProfile,
  hasPendingFollowRequest,
  pendingFollowRequest,
  isFollowed,
  userId,
}: ProfileIdentityProps) {
  const {
    mutate: sendRequest,
    isPending: isSendingPending,
    error: sendingRequestError,
  } = useSendFollowRequest();
  const {
    mutate: cancelRequest,
    isPending: isCancelling,
    error: cancelError,
  } = useRejectOrCancelFollowRequest();
  const {
    mutate: unFollow,
    isPending: isUnFollowing,
    error: unFollowError,
  } = useUnFollowUser();

  const handleSendRequest = useCallback(() => {
    sendRequest({ receiverId: userId });
  }, [userId]);

  const handleCancelRequest = () => {
    if (!pendingFollowRequest) return;

    cancelRequest({
      type: "sent",
      requestId: pendingFollowRequest.id,
      receiverId: userId,
    });
  };
  const handleUnFollow = () => {
    unFollow(userId);
  };
  const isProccessPending = isSendingPending || isCancelling || isUnFollowing;
  if (isLoading) return <ProfileIdentitySkeleton className={className} />;
  return (
    <div className={`mix-blend-difference ${className}`}>
      <div className="flex items-center gap-2 flex-col sm:flex-row sm:items-center">
        <p className="text-xl text-centent">{name}</p>
        {!isCurrentUserProfile &&
          (isFollowed ? (
            <button
              disabled={isProccessPending}
              onClick={handleUnFollow}
              className="bg-neutral-700/50 w-fit px-2.5 py-1 rounded-full text-xs font-medium tracking-wide text-white cursor-pointer capitalize transition-colors hover:bg-neutral-700"
            >
              Unfollow
            </button>
          ) : hasPendingFollowRequest ? (
            <button
              disabled={isProccessPending}
              onClick={handleCancelRequest}
              className="flex items-center gap-1 bg-neutral-700/50 w-fit px-2.5 py-1 rounded-full text-xs font-medium tracking-wide text-white cursor-pointer capitalize transition-colors hover:bg-neutral-700"
            >
              <X size={18} />
              <span>Cancel request</span>
            </button>
          ) : (
            <button
              disabled={isProccessPending}
              onClick={handleSendRequest}
              className="flex items-center gap-1 bg-neutral-700/50 w-fit px-2.5 py-1 rounded-full text-xs font-medium tracking-wide text-white cursor-pointer capitalize transition-colors hover:bg-neutral-700"
            >
              <UserRoundPlus size={18} />
              <span>Send request</span>
            </button>
          ))}
      </div>

      <div className="text-sm text-neutral-400 flex gap-1">
        <Link className="hover:underline" to={`/app/users/${userId}/followers`}>
          Followers: {followersCount}
        </Link>
        <span className="text-neutral-600">•</span>
        <Link
          className="hover:underline"
          to={`/app/users/${userId}/followings`}
        >
          Following: {followingCount}
        </Link>
      </div>
    </div>
  );
}
