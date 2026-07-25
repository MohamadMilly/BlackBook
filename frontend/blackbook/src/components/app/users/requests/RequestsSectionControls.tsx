import { ArrowDown, ArrowUp } from "lucide-react";
import { NotificationCount } from "../../../shared/ui/NotificationCount";
import type { FollowRequestType } from "@app/types";

type RequestsSectionControlsType = {
  handleToggleRequests: () => void;
  requestsVisible: boolean;
  isFollowRequestsCountLoading: boolean;
  requestsCount: number;
  handleToggleRequestsType: () => void;
  requestsType: FollowRequestType;
};

export function RequestsSectionControls({
  handleToggleRequests,
  requestsVisible,
  isFollowRequestsCountLoading,
  requestsCount,
  handleToggleRequestsType,
  requestsType,
}: RequestsSectionControlsType) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-2 mb-4">
      <div className="flex items-center gap-2">
        <h3 className="text-2xl md:text-3xl">Requests</h3>
        <button
          onClick={handleToggleRequests}
          className="bg-neutral-700/50 p-1 rounded-full cursor-pointer relative text-white"
        >
          {requestsVisible ? <ArrowUp size={25} /> : <ArrowDown size={25} />}
          {!requestsVisible && !isFollowRequestsCountLoading && (
            <NotificationCount count={requestsCount} />
          )}
        </button>
      </div>

      {requestsVisible && (
        <button
          onClick={handleToggleRequestsType}
          className="bg-neutral-700/50 mx-2 px-3 py-1 rounded-full text-sm font-medium tracking-wide text-white cursor-pointer capitalize transition-colors hover:bg-neutral-700"
        >
          {requestsType === "received" ? "Show Sent" : "Show Received"}
        </button>
      )}
    </div>
  );
}
