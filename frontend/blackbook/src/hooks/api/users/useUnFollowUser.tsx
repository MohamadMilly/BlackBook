import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { apiClient } from "../../../api/api";
import type { AxiosError } from "axios";
import { updateUserFollowStatus } from "../../../shared/utils/mutationHandlers";
import { useAuth } from "../../../contexts/authContext";
import { useNotifications } from "../../../contexts/NotificationsContext";
import type { ResponseError, UserWithFollowCounts } from "@app/types";
import type { FollowersPage } from "./useUserFollowers";
import type { FollowingsPage } from "./useUserFollowings";
import { getErrorMessage } from "../../../shared/utils/getErrorMessage";

const unFollowUser = async (
  userId: number,
): Promise<{ hasUnFollowed: boolean }> => {
  const response = await apiClient.delete(`/me/following/${userId}`);

  return response.data;
};

export function useUnFollowUser() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const { add } = useNotifications();
  return useMutation<
    { hasUnFollowed: boolean },
    AxiosError<{ errors: ResponseError[] } | ResponseError>,
    number,
    { previousUserQueriesData?: Array<[readonly unknown[], unknown]> }
  >({
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
    onError: (error, _userId, context) => {
      if (context?.previousUserQueriesData) {
        context.previousUserQueriesData.forEach(([queryKey, oldData]) => {
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
    onSuccess: () => {
      add("User unfollowed successfully.", "SUCCESS");
    },
    onSettled: (_data, _error, userId) => {
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
