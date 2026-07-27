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
  const rootQueryKey = ["users"];

  return useMutation({
    mutationKey: ["send_follow_request"],
    mutationFn: sendFollowRequest,
    onMutate: async ({ receiverId }) => {
      await queryClient.cancelQueries({ queryKey: rootQueryKey });

      const previousUsersQueriesData = queryClient.getQueriesData({
        // notice the plural (queries)
        queryKey: rootQueryKey,
      });
      
      updateUserFollowStatus({
        queryClient,
        userId: receiverId,
        data: { hasPendingFollowRequest: true },
      });

      return { previousUsersQueriesData };
    },
    onError: (err, args, context) => {
      if (context?.previousUsersQueriesData) {
        context.previousUsersQueriesData.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
    onSuccess: (data) => {
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
    },
    onSettled: (data, error, args) => {
      queryClient.invalidateQueries({ queryKey: rootQueryKey });
    },
  });
}
