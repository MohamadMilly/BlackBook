import type {
  FollowRequest,
  FollowRequestType,
  ResponseError,
} from "@app/types";
import { apiClient } from "../../../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNotifications } from "../../../contexts/NotificationsContext";
import { updateUserFollowStatus } from "../../../shared/utils/mutationHandlers";
import { getErrorMessage } from "../../../shared/utils/getErrorMessage";

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
  const { add } = useNotifications();
  return useMutation<
    { hasRemoved: boolean },
    AxiosError<{ errors: ResponseError[] } | ResponseError>,
    {
      type: FollowRequestType;
      requestId: number;
      receiverId: number;
    },
    {
      previousRequestsCountState?: { count: number };
      previousRequestsState?: { requests: FollowRequest[] };
      previousUsersQueriesData?: Array<[readonly unknown[], unknown]>;
    }
  >({
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
      const previousRequestsState = queryClient.getQueryData<{
        requests: FollowRequest[];
      }>(queryKey);
      const previousRequestsCountState = queryClient.getQueryData<{
        count: number;
      }>(queryCountKey);

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

      if (type === "sent") {
        updateUserFollowStatus({
          queryClient,
          userId: receiverId,
          data: { pendingFollowRequest: null },
        });
      }

      return {
        previousRequestsCountState,
        previousRequestsState,
        previousUsersQueriesData,
      };
    },
    onError: (error, { type }, context) => {
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
      add(
        getErrorMessage(
          error as AxiosError<
            { errors: ResponseError[] } | ResponseError
          > | null,
        ),
        "ERROR",
      );
    },
    onSuccess: (_data, { type }) => {
      add(
        type === "sent"
          ? "Follow request canceled successfully."
          : "Follow request rejected successfully.",
        "SUCCESS",
      );
    },
    onSettled: (_data, _error, { type }) => {
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
