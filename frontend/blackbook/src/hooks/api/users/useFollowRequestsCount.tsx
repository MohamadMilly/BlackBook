import type { FollowRequestType } from "@app/types";
import { apiClient } from "../../../api/api";
import { useQuery } from "@tanstack/react-query";

const getFollowRequestsCount = async (
  type: FollowRequestType,
): Promise<{ count: number }> => {
  const response = await apiClient.get("/me/requests/count", {
    params: { type },
  });

  return response.data;
};

export function useFollowRequestsCount(type: FollowRequestType) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["follow_requests", "count", type],
    queryFn: () => getFollowRequestsCount(type),
    staleTime: 1000 * 60 * 2,
  });

  const count = data?.count ?? 0;

  return { isLoading, count, error };
}
