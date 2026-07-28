import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../api/api";
import type { Comment } from "@app/types";

const getPostComments = async (
  postId: number,
): Promise<{ comments: Comment[] }> => {
  const response = await apiClient.get(`/posts/${postId}/comments`);

  return response.data;
};

export function usePostComments(postId: number | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", postId, "comments"],
    queryFn: () => getPostComments(postId as number),
    enabled: !!postId,
    staleTime: 1000 * 60 * 2,
  });

  const comments = data?.comments ?? [];

  return { comments, isLoading, error };
}
