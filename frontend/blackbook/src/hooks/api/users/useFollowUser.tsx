import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../api/api";
import { updateUserFollowStatus } from "../../../shared/utils/mutationHandlers";

const unFollowUser = async (
  userId: number,
): Promise<{ hasUnFollowed: boolean }> => {
  const response = await apiClient.delete(`/me/following/${userId}`);

  return response.data;
};

export function useUnFollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["unFollowUser"],
    mutationFn: unFollowUser,

    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUserQueriesData = queryClient.getQueriesData({
        queryKey: ["users"],
      });

      updateUserFollowStatus({
        queryClient,
        userId,
        data: { isFollowed: false },
      });

      return { previousUserQueriesData };
    },
    onError: (err, userId, context) => {
      if (context?.previousUserQueriesData) {
        context.previousUserQueriesData.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
