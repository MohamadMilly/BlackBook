import type { FollowRequest, FollowRequestType } from "@app/types";
import { apiClient } from "../../../api/api";
import { useQuery } from "@tanstack/react-query";

const getFollowRequests = async (
  type: FollowRequestType,
): Promise<{ requests: FollowRequest[] }> => {
  const response = await apiClient.get("/me/requests", {
    params: { type },
  });

  return response.data;
};

export function useFollowRequests(type: FollowRequestType | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["follow_requests", type],
    queryFn: () => getFollowRequests(type as FollowRequestType), // it is not going to be called if no type is passed
    staleTime: 1000 * 60 * 2,
  });

  const requests = data?.requests ?? [];

  return { requests, isLoading, error };
}
