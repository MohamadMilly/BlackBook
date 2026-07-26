import type { FollowRequest, FollowRequestType } from "@app/types";
import { Avatar } from "../../profile/Avatar";
import { formatDate } from "../../../../shared/utils/formatDate";
import type { JSX } from "react/jsx-runtime";
import { Button } from "../../../shared/ui/Button";
import { useAcceptFollowRequest } from "../../../../hooks/api/users/useAcceptFollowRequest";
import { useCallback } from "react";
import { useRejectOrCancelFollowRequest } from "../../../../hooks/api/users/useRejectOrCancelFollowRequest";
import { X } from "lucide-react";

export function RequestCard({
  request,
  type,
}: {
  request: FollowRequest;
  type: FollowRequestType;
}): JSX.Element {
  const {
    mutate: accept,
    isPending: isAcceptPending,
    error: acceptError,
  } = useAcceptFollowRequest();
  const {
    mutate: rejectOrCancel,
    isPending: isRemovingPending,
    error: removeError,
  } = useRejectOrCancelFollowRequest();

  const handleAccept = useCallback(() => {
    accept(request.id);
  }, [request.id]);

  const handleRejectOrCancel = useCallback(() => {
    rejectOrCancel({
      type,
      requestId: request.id,
      receiverId: request.receiverId,
    });
  }, [type, request.id, rejectOrCancel]);

  const userToDisplay = type === "received" ? request.sender : request.receiver;
  const userToDisplayProfile = userToDisplay?.profile;
  const fullname = userToDisplay?.firstname + " " + userToDisplay?.lastname;
  const formattedCreatedAt = formatDate(request.createdAt);
  return (
    <li className="flex flex-col overflow-hidden min-h-65 w-55 bg-neutral-950 border border-neutral-800 rounded-xl transition-all duration-200 hover:border-neutral-700/60 shadow-sm">
      <div
        style={{
          backgroundImage: `url(${userToDisplayProfile?.bannerUrl})`,
          backgroundSize: "cover",
        }}
        className="bg-neutral-900 h-27 flex justify-center items-end"
      >
        <Avatar
          avatarUrl={userToDisplayProfile?.avatarUrl}
          size={80}
          className="translate-y-1/3"
        />
      </div>
      <div className="mt-8 flex flex-col items-center px-2">
        <p className="font-medium tracking-tight">{fullname}</p>
        <span className="text-sm text-neutral-400">
          @{userToDisplay?.username}
        </span>
        <span className="text-sm text-neutral-400">
          Sent at: {formattedCreatedAt}
        </span>
      </div>
      <div className="flex px-2 pb-1.5 mt-auto">
        {type === "received" ? (
          <>
            <Button onClick={handleAccept} className="grow rounded-r-none">
              Accept
            </Button>
            <Button
              onClick={handleRejectOrCancel}
              className="grow rounded-l-none"
            >
              Reject
            </Button>{" "}
          </>
        ) : (
          <Button
            onClick={handleRejectOrCancel}
            className="flex items-center gap-1 grow"
          >
            <X size={18} />
            <span>Cancel</span>
          </Button>
        )}
      </div>
    </li>
  );
}
