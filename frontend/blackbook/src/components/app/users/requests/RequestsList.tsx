import type { FollowRequest, FollowRequestType } from "@app/types";
import { RequestCard } from "./RequestCard";
import { Spinner } from "../../../shared/ui/Spinner";

type RequestsListProps = {
  requests: FollowRequest[];
  isLoading: boolean;
  error: Error | null;
  type: FollowRequestType;
};

export function RequestsList({
  requests,
  isLoading,
  error,
  type,
}: RequestsListProps) {
  if (isLoading)
    return (
      <Spinner size={32} className="w-full flex justify-center items-center" />
    );
  if (error) return <p>Error: {error.message}</p>;
  if (requests.length === 0)
    return (
      <p className="text-center text-sm text-neutral-400">No requests yet</p>
    );

  return (
    <ul className="flex flex-wrap md:justify-start justify-center gap-2 p-2">
      {requests.map((request) => {
        return <RequestCard key={request.id} request={request} type={type} />;
      })}
    </ul>
  );
}
