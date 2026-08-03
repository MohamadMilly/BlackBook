import type { FollowRequest, ResponseError } from "@app/types";
import { apiClient } from "../../../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNotifications } from "../../../contexts/NotificationsContext";
import { updateUserFollowStatus } from "../../../shared/utils/mutationHandlers";
import { getErrorMessage } from "../../../shared/utils/getErrorMessage";

const sendFollowRequest = async ({
  receiverId,
}: {
  receiverId: number;
}): Promise<{ request: FollowRequest }> => {
  const response = await apiClient.post("/me/requests", {
    receiverId,
  });

  return response.data;
};

export function useSendFollowRequest() {
  const queryClient = useQueryClient();
  const { add } = useNotifications();

  return useMutation<
    { request: FollowRequest },
    AxiosError<{ errors: ResponseError[] } | ResponseError>,
    { receiverId: number }
  >({
    mutationKey: ["send_follow_request"],
    mutationFn: sendFollowRequest,

    onSuccess: (data, args) => {
      queryClient.setQueryData(
        ["follow_requests", "sent"],
        (old: { requests: FollowRequest[] }) => {
          if (!old?.requests) return old;
          return {
            ...old,
            requests: [...old.requests, data.request],
          };
        },
      );
      queryClient.setQueryData(
        ["follow_requests", "count", "sent"],
        (old: { count: number }) => {
          if (!old?.count) return;

          return {
            ...old,
            count: old.count + 1,
          };
        },
      );
      updateUserFollowStatus({
        queryClient,
        userId: args.receiverId,
        data: { pendingFollowRequest: data.request },
      });
      add("Follow request sent successfully.", "SUCCESS");
    },
    onError: (error) => {
      add(
        getErrorMessage(
          error as AxiosError<{ errors: ResponseError[] } | ResponseError> | null,
        ),
        "ERROR",
      );
    },
  });
}
