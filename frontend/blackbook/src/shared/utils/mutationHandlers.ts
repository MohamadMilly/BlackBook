import type { User, UserFollowDataType } from "@app/types";
import type { UsersPage } from "../../hooks/api/users/useUsers";
import type { QueryClient } from "@tanstack/react-query";
import type { FollowersPage } from "../../hooks/api/users/useUserFollowers";
import type { FollowingsPage } from "../../hooks/api/users/useUserFollowings";

export function updateUserFollowStatus({
  queryClient,
  userId,
  data,
}: {
  queryClient: QueryClient;
  userId: number;
  data: Partial<UserFollowDataType>;
}) {
  queryClient.setQueriesData({ queryKey: ["users"] }, (old: any) => {
    if (!old) return old;

    if ("pages" in old && Array.isArray(old.pages)) {
      const { pendingFollowRequest, ...usersListData } = data;
      return {
        ...old,
        pages: old.pages.map(
          (page: UsersPage | FollowersPage | FollowingsPage) => {
            if ("users" in page) {
              return {
                ...page,
                users: page["users"].map(
                  (user: Omit<User, "password"> & UserFollowDataType) =>
                    user.id === userId ? { ...user, ...usersListData } : user,
                ),
              };
            } else if ("followers" in page) {
              return {
                ...page,
                followers: page["followers"].map(
                  (user: Omit<User, "password"> & UserFollowDataType) =>
                    user.id === userId ? { ...user, ...usersListData } : user,
                ),
              };
            } else if ("followings" in page) {
              return {
                ...page,
                followings: page["followings"].map(
                  (user: Omit<User, "password"> & UserFollowDataType) =>
                    user.id === userId ? { ...user, ...usersListData } : user,
                ),
              };
            } else return page;
          },
        ),
      };
    }
    if ("user" in old && old.user && old.user.id === userId) {
      return {
        ...old,
        ...data,
      };
    }
    return old;
  });
}
