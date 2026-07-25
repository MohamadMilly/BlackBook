import type { User, UserFollowDataType } from "@app/types";
import type { UsersPage } from "../../hooks/api/users/useUsers";
import type { QueryClient } from "@tanstack/react-query";

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
      return {
        ...old,
        pages: old.pages.map((page: UsersPage) => ({
          ...page,
          users: page.users.map((user: User) =>
            user.id === userId ? { ...user, ...data } : user,
          ),
        })),
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
