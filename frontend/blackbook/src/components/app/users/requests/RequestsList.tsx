import type { FollowRequest, FollowRequestType } from "@app/types";
import { RequestCard } from "./RequestCard";

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
  if (isLoading) return <p>Loading...</p>;
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
