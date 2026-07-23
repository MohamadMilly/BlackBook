import type { Post } from "@app/types";
import { apiClient } from "../../../api/api";
import { useAuth } from "../../../contexts/authContext";
import { useQuery } from "@tanstack/react-query";

const getUserPosts = async (
  userId: number,
  currentUserId: number | undefined,
): Promise<{ posts: Required<Post> }> => {
  const endPoint =
    userId === currentUserId ? "/me/posts" : `users/${userId}/posts`;
  const response = await apiClient.get(endPoint);

  return response.data;
};

export function useUserPosts(userId: number) {
  const { user: currentUser } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryFn: () => getUserPosts(userId, currentUser?.id),
    queryKey: ["posts", "users", userId],
  });
  const posts = data?.posts ?? [];
  return { posts, isLoading, error };
}
