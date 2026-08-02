import type { FollowRequest } from "@app/types";
import { apiClient } from "../../../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserFollowStatus } from "../../../shared/utils/mutationHandlers";

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

  return useMutation({
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
    },
  });
}
