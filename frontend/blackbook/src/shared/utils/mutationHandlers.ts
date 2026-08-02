import type {
  FollowRequest,
  GetUserResponseBody,
  GetUsersResponseBody,
} from "@app/types";
import { QueryClient, type InfiniteData } from "@tanstack/react-query";

export function updateUserFollowStatus({
  queryClient,
  userId,
  data,
}: {
  queryClient: QueryClient;
  userId: number;
  data: { pendingFollowRequest?: FollowRequest | null; isFollowed?: boolean };
}) {
  queryClient.setQueriesData<any>(
    { queryKey: ["users"] },
    (
      old:
        | InfiniteData<GetUsersResponseBody>
        | { user: GetUserResponseBody["user"] },
    ) => {
      if (!old) return old;

      if ("pages" in old && Array.isArray(old.pages)) {
        return {
          ...old,
          pages: old.pages.map((page: any) => {
            if ("users" in page && Array.isArray(page.users)) {
              return {
                ...page,
                users: page.users.map((item: GetUserResponseBody) =>
                  item.user.id === userId ? { ...item, ...data } : item,
                ),
              };
            }
            if ("followers" in page && Array.isArray(page.followers)) {
              return {
                ...page,
                followers: page.followers.map((item: GetUserResponseBody) =>
                  item.user.id === userId ? { ...item, ...data } : item,
                ),
              };
            }
            if ("followings" in page && Array.isArray(page.followings)) {
              return {
                ...page,
                followings: page.followings.map((item: GetUserResponseBody) =>
                  item.user.id === userId ? { ...item, ...data } : item,
                ),
              };
            }
            return page;
          }),
        };
      }

      if ("user" in old && old.user && old.user.id === userId) {
        return {
          ...old,
          ...data,
        };
      }

      return old;
    },
  );
}
