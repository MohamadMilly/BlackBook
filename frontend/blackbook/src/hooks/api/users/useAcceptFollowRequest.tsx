import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../api/api";
import type { FollowRequest } from "@app/types";
import { useAuth } from "../../../contexts/authContext";

export const acceptRequest = async (
  requestId: number,
): Promise<{ hasAccepted: boolean }> => {
  const response = await apiClient.post(`/me/requests/${requestId}`);
  return response.data;
};

export function useAcceptFollowRequest() {
  const queryClient = useQueryClient();
  const queryKey = ["follow_requests", "received"];
  const queryCountKey = ["follow_requests", "count", "received"];
  const { user } = useAuth();
  return useMutation({
    mutationKey: ["accept_follow_request"],
    mutationFn: acceptRequest,

    onMutate: async (requestId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey }),
        queryClient.cancelQueries({ queryKey: queryCountKey }),
      ]);

      const previousRequestsState = queryClient.getQueryData(queryKey);
      const previousRequestsCountState =
        queryClient.getQueryData(queryCountKey);
      queryClient.setQueryData(
        queryKey,
        (old: { requests: FollowRequest[] }) => {
          if (!old?.requests) return old;

          return {
            ...old,
            requests: old.requests.filter(
              (request) => request.id !== requestId,
            ),
          };
        },
      );
      queryClient.setQueryData(queryCountKey, (old: { count: number }) => {
        if (!old?.count) return old;

        return {
          ...old,
          count: old.count - 1,
        };
      });

      return { previousRequestsCountState, previousRequestsState };
    },
    onError: (err, requestId, context) => {
      queryClient.setQueryData(queryKey, context?.previousRequestsState);
      queryClient.setQueryData(
        queryCountKey,
        context?.previousRequestsCountState,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: queryCountKey });
      queryClient.invalidateQueries({ queryKey: ["users", user?.id] }); // current user invalidation to update followers count
    },
  });
}
