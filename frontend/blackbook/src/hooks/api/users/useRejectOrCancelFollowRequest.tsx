import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../api/api";
import type { FollowRequest, FollowRequestType } from "@app/types";
import { updateUserFollowStatus } from "../../../shared/utils/mutationHandlers";

const rejectOrCancelFollowRequest = async ({
  requestId,
}: {
  requestId: number;
}): Promise<{ hasRemoved: boolean }> => {
  const response = await apiClient.delete(`/me/requests/${requestId}`);

  return response.data;
};

export function useRejectOrCancelFollowRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["rejectOrCancel_follow_request"],
    mutationFn: rejectOrCancelFollowRequest,

    onMutate: async ({
      type,
      requestId,
      receiverId,
    }: {
      type: FollowRequestType;
      requestId: number;
      receiverId: number;
    }) => {
      const queryKey = ["follow_requests", type];
      const queryCountKey = ["follow_requests", "count", type];
      const usersRootQueryKey = ["users"];

      await Promise.all([
        queryClient.cancelQueries({ queryKey }),
        queryClient.cancelQueries({ queryKey: queryCountKey }),
      ]);
      const previousUsersQueriesData = queryClient.getQueriesData({
        queryKey: usersRootQueryKey,
      });
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

      if (type === "sent" && previousRequestsState) {
        updateUserFollowStatus({
          queryClient,
          userId: receiverId,
          data: { hasPendingFollowRequest: false },
        });
      }

      return {
        previousRequestsCountState,
        previousRequestsState,
        previousUsersQueriesData,
      };
    },
    onError: (err, { type }, context) => {
      queryClient.setQueryData(
        ["follow_requests", type],
        context?.previousRequestsState,
      );
      queryClient.setQueryData(
        ["follow_requests", "count", type],
        context?.previousRequestsCountState,
      );
      if (context?.previousUsersQueriesData && type === "sent") {
        context.previousUsersQueriesData.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
    onSettled: (data, err, { type }, context) => {
      queryClient.invalidateQueries({ queryKey: ["follow_requests", type] });
      queryClient.invalidateQueries({
        queryKey: ["follow_requests", "count", type],
      });
      if (type === "sent") {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    },
  });
}
