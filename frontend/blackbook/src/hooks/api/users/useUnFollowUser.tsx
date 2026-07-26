import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { apiClient } from "../../../api/api";
import { updateUserFollowStatus } from "../../../shared/utils/mutationHandlers";
import { useAuth } from "../../../contexts/authContext";
import type { UserWithFollowCounts } from "@app/types";
import type { FollowersPage } from "./useUserFollowers";
import type { FollowingsPage } from "./useUserFollowings";

const unFollowUser = async (
  userId: number,
): Promise<{ hasUnFollowed: boolean }> => {
  const response = await apiClient.delete(`/me/following/${userId}`);

  return response.data;
};

export function useUnFollowUser() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  return useMutation({
    mutationKey: ["unFollowUser"],
    mutationFn: unFollowUser,

    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUserQueriesData = queryClient.getQueriesData({
        queryKey: ["users"],
      });

      queryClient.setQueryData(
        ["users", currentUser?.id],
        (old: UserWithFollowCounts) => {
          if (!old) return old;
          return {
            ...old,
            followingCount: old.followingCount - 1,
          };
        },
      );

      queryClient.setQueryData(
        ["users", userId],
        (old: UserWithFollowCounts) => {
          if (!old) return old;
          return {
            ...old,
            followersCount: old.followersCount - 1,
          };
        },
      );

      queryClient.setQueriesData(
        { queryKey: ["users", "followers", userId] },

        (old: InfiniteData<FollowersPage>) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page) => {
              return {
                ...page,
                followers: page.followers.filter(
                  (follower) => follower.id !== currentUser?.id,
                ),
              };
            }),
          };
        },
      );

      queryClient.setQueriesData(
        { queryKey: ["users", "followings", currentUser?.id] },
        (old: InfiniteData<FollowingsPage>) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page) => {
              return {
                ...page,
                followings: page.followings.filter(
                  (followedUser) => followedUser.id !== currentUser?.id,
                ),
              };
            }),
          };
        },
      );

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
    onSettled: (data, err, userId) => {
      queryClient.invalidateQueries({ queryKey: ["users", currentUser?.id] });
      queryClient.invalidateQueries({
        queryKey: ["users", "followers", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
      queryClient.invalidateQueries({
        queryKey: ["users", "followings", currentUser?.id],
      });
    },
  });
}
