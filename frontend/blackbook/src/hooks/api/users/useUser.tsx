import type { GetUserResponseBody } from "@app/types";
import { apiClient } from "../../../api/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/authContext";

const getUser = async (
  userId: number,
  currentUserId: number | undefined,
): Promise<GetUserResponseBody> => {
  const endpoint = userId === currentUserId ? "/me" : `/users/${userId}`;
  const response = await apiClient.get(endpoint);

  return response.data;
};

export function useUser(userId: number) {
  const { user: currentUser } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUser(userId, currentUser?.id),
    staleTime: 1000 * 60 * 15,
    enabled: !!userId,
  });
  const user = data?.user ?? null;
  const followersCount = data?.followersCount || 0;
  const followingCount = data?.followingCount || 0;
  const isFollowed = data?.isFollowed || false;
  const pendingFollowRequest = data?.pendingFollowRequest ?? null;
  const recentStoryId = data?.recentStoryId ?? null;
  return {
    user,
    followersCount,
    followingCount,
    isLoading,
    error,
    isFollowed,
    pendingFollowRequest,
    recentStoryId,
  };
}
