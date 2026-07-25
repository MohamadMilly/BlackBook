import type { User, UserFollowDataType } from "@app/types";
import { apiClient } from "../../../api/api";
import { useInfiniteQuery } from "@tanstack/react-query";


export type UsersPage = {
  users: User[];
  nextCursor: number | undefined;
};

const getUsers = async (
  query: string,
  cursor?: number | undefined,
): Promise<{
  users: (Omit<User, "password"> & UserFollowDataType)[];
  nextCursor: number | undefined;
}> => {
  const response = await apiClient.get("/users", {
    params: { search: query, cursor: cursor },
  });

  return response.data;
};

export function useUsers(query: string) {
  const {
    data,
    isFetchingNextPage,
    isFetchNextPageError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["users", query],
    initialPageParam: undefined,
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      getUsers(query, pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
  });

  const users = data ? data.pages.flatMap((page) => page.users) : [];
  return {
    users,
    isFetchingNextPage,
    isFetchNextPageError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    error,
  };
}
