import type { Post } from "@app/types";
import { apiClient } from "../../../api/api";
import { useQuery } from "@tanstack/react-query";

const getPost = async (postId: number): Promise<{ post: Required<Post> }> => {
  const response = await apiClient.get(`/posts/${postId}`);

  return response.data;
};

export function usePost(postId: number | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => getPost(postId as number),
    enabled: !!postId,
  });
  const post = data?.post ?? null;

  return { post, isLoading, error };
}
