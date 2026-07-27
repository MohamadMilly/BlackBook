import type { User, UserFollowDataType } from "@app/types";
import { Avatar } from "../profile/Avatar";
import { formatDate } from "../../../shared/utils/formatDate";
import { Button } from "../../shared/ui/Button";
import { Check, Clock, UserPlus } from "lucide-react";
import { useSendFollowRequest } from "../../../hooks/api/users/useSendFollowRequest";
import { useCallback } from "react";
import { Link } from "react-router";
import { useAuth } from "../../../contexts/authContext";

export function UserItem({
  user,
}: {
  user: Omit<User, "password"> & UserFollowDataType;
}) {
  const { user: currentUser } = useAuth();
  const fullname = user.firstname + " " + user.lastname;
  const formattedJoinedAtDate = formatDate(user.createdAt);
  const isCurrentUserFollowing = user.isFollowed;
  const hasPendingFollowRequestByMe = user.hasPendingFollowRequest;
  const profile = user.profile;
  const avatarUrl = profile?.avatarUrl;
  const bannerUrl = profile?.bannerUrl;
  const {
    mutate: sendFollowRequest,
    isPending: isSendingRequestPending,
    error: sendingRequestError,
  } = useSendFollowRequest();

  const handleSendFollowRequest = useCallback(() => {
    sendFollowRequest({ receiverId: user.id });
  }, []);

  return (
    <li
      style={{
        backgroundImage: `url(${bannerUrl})`,
      }}
      className="bg-linear-to-r from-transparent via-transparent to-neutral-900 via-20% bg-cover bg-center bg-neutral-900 flex items-center justify-between rounded-lg p-4"
    >
      <div className="flex items-start gap-2 mix-blend-difference">
        <Avatar className="shrink-0" size={45} avatarUrl={avatarUrl} />
        <div className="grow flex flex-col justify-start">
          <p className="font-bold tracking-tight">
            <Link to={`/app/users/${user.id}`} className="hover:underline">
              {fullname}
            </Link>
          </p>
          <span className="text-neutral-400 text-xs">
            Joined at: {formattedJoinedAtDate}
          </span>
        </div>
      </div>
      {currentUser?.id !== user.id &&
        (isCurrentUserFollowing ? (
          <p className="flex items-center gap-1">
            <Check size={18} className="text-blue-600" />
            <span className="text-sm text-neutral-400">Following</span>
          </p>
        ) : hasPendingFollowRequestByMe ? (
          <p className="flex items-center gap-1 text-neutral-400 ">
            <Clock size={18} />
            <span className="text-sm">Pending</span>
          </p>
        ) : (
          <Button
            disabled={isSendingRequestPending}
            onClick={handleSendFollowRequest}
            className={`flex items-center gap-1 grow-0 p-1.5! ${isSendingRequestPending ? "animate-pulse" : ""}`}
          >
            <UserPlus size={18} />
            <span className="text-sm sr-only sm:not-sr-only">
              {isSendingRequestPending ? "Sending..." : "Send request"}
            </span>
          </Button>
        ))}
    </li>
  );
}
