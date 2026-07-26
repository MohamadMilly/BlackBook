import type { User, UserFollowDataType } from "@app/types";
import { apiClient } from "../../../api/api";
import { useInfiniteQuery } from "@tanstack/react-query";

export type FollowersPage = {
  followers: (Omit<User, "password"> & UserFollowDataType)[];
  nextCursor: number | undefined;
};

const getUserFollowers = async (
  userId: number,
  query: string,
  cursor: number | undefined,
): Promise<{
  followers: (Omit<User, "password"> & UserFollowDataType)[];
  nextCursor: number | undefined;
}> => {
  const response = await apiClient.get(`/users/${userId}/followers`, {
    params: { search: query, cursor: cursor },
  });

  return response.data;
};

export function useUserFollowers(userId: number, query: string) {
  const {
    data,
    isFetchingNextPage,
    isFetchNextPageError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["users", "followers", userId, query],
    initialPageParam: undefined,
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      getUserFollowers(userId, query, pageParam),
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    staleTime: 1000 * 60 * 2,
  });
  const followers = data?.pages.flatMap((page) => page.followers) ?? [];

  return {
    followers,
    isFetchNextPageError,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    hasNextPage,
    error,
  };
}
