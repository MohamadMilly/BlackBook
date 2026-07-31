import type { Post, PostType } from "@app/types";
import { apiClient } from "../../../api/api";
import { useAuth } from "../../../contexts/authContext";
import { useQuery } from "@tanstack/react-query";

const getUserPosts = async (
  userId: number,
  currentUserId: number | undefined,
  type: PostType | undefined,
): Promise<{ posts: Required<Post>[] }> => {
  const endPoint =
    userId === currentUserId ? "/me/posts" : `users/${userId}/posts`;
  const response = await apiClient.get(endPoint, { params: { type } });

  return response.data;
};

export function useUserPosts(userId: number, type?: PostType | undefined) {
  const { user: currentUser } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryFn: () => getUserPosts(userId, currentUser?.id, type),
    queryKey: ["posts", userId],
    staleTime: 1000 * 60 * 2,
  });
  const posts = data?.posts ?? [];
  return { posts, isLoading, error };
}
