import type { User, UserFollowDataType } from "@app/types";
import { apiClient } from "../../../api/api";
import { useInfiniteQuery } from "@tanstack/react-query";

export type FollowingsPage = {
  followings: (Omit<User, "password"> & UserFollowDataType)[];
  nextCursor: number | undefined;
};

const getUserFollowings = async (
  userId: number,
  query: string,
  cursor: number | undefined,
): Promise<{
  followings: (Omit<User, "password"> & UserFollowDataType)[];
  nextCursor: number | undefined;
}> => {
  const response = await apiClient.get(`/users/${userId}/followings`, {
    params: { search: query, cursor: cursor },
  });

  return response.data;
};

export function useUserFollowings(userId: number, query: string) {
  const {
    data,
    isFetchingNextPage,
    isFetchNextPageError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["users", "followings", userId, query],
    initialPageParam: undefined,
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      getUserFollowings(userId, query, pageParam),
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    staleTime: 1000 * 60 * 2,
  });
  const followings = data?.pages.flatMap((page) => page.followings) ?? [];

  return {
    followings,
    isFetchNextPageError,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    hasNextPage,
    error,
  };
}
