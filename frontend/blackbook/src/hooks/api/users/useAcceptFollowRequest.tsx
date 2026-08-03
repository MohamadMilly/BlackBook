import type { FollowRequest, ResponseError } from "@app/types";
import { apiClient } from "../../../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNotifications } from "../../../contexts/NotificationsContext";
import { useAuth } from "../../../contexts/authContext";
import { getErrorMessage } from "../../../shared/utils/getErrorMessage";

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
  const { add } = useNotifications();
  return useMutation<
    { hasAccepted: boolean },
    AxiosError<{ errors: ResponseError[] } | ResponseError>,
    number,
    {
      previousRequestsState?: { requests: FollowRequest[] };
      previousRequestsCountState?: { count: number };
    }
  >({
    mutationKey: ["accept_follow_request"],
    mutationFn: acceptRequest,

    onMutate: async (requestId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey }),
        queryClient.cancelQueries({ queryKey: queryCountKey }),
      ]);

      const previousRequestsState = queryClient.getQueryData<{ requests: FollowRequest[] }>(queryKey);
      const previousRequestsCountState =
        queryClient.getQueryData<{ count: number }>(queryCountKey);
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
    onError: (error, _requestId, context) => {
      queryClient.setQueryData(queryKey, context?.previousRequestsState);
      queryClient.setQueryData(
        queryCountKey,
        context?.previousRequestsCountState,
      );
      add(
        getErrorMessage(
          error as AxiosError<
            { errors: ResponseError[] } | ResponseError
          > | null,
        ),
        "ERROR",
      );
    },
    onSuccess: () => {
      add("Follow request accepted successfully.", "SUCCESS");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: queryCountKey });
      queryClient.invalidateQueries({ queryKey: ["users", user?.id] }); // current user invalidation to update followers count
      queryClient.invalidateQueries({
        queryKey: ["users", "followers", user?.id],
      });
    },
  });
}
