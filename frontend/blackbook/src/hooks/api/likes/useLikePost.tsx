import type { Like, Post, ToggleLikeResponseBody } from "@app/types";
import { apiClient } from "../../../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/authContext";

const toggleLike = async ({
  postId,
}: {
  postId: number;
}): Promise<ToggleLikeResponseBody> => {
  const response = await apiClient.post(`/posts/${postId}/likes`);

  return response.data;
};

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["ToggleLikePost"],
    mutationFn: toggleLike,

    onMutate: async ({ postId }) => {
      const rootQueryKey = ["posts"];

      await queryClient.cancelQueries({ queryKey: rootQueryKey });

      const previousQueriesState = queryClient.getQueriesData({
        queryKey: rootQueryKey,
      });

      queryClient.setQueriesData({ queryKey: rootQueryKey }, (old: any) => {
        if (!old) return old;
        if ("posts" in old) {
          return {
            ...old,
            posts: old.posts.map((post: Required<Post>) => {
              if (post.id === postId) {
                return {
                  ...post,
                  likesCount: post.isLiked
                    ? post.likesCount - 1
                    : post.likesCount + 1,
                  isLiked: !post.isLiked,
                };
              } else {
                return post;
              }
            }),
          };
        }
        if ("post" in old) {
          return {
            ...old,
            likesCount: old.post.isLiked
              ? old.post.likesCount - 1
              : old.post.likesCount + 1,
            isLiked: !old.post.isLiked,
          };
        }
      });

      return { previousQueriesState };
    },
    onError: (error, { postId }, context) => {
      if (context?.previousQueriesState) {
        context.previousQueriesState.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        predicate: (query) => {
          const queryKey = query.queryKey;
          const isCommentsQuery = queryKey.includes("comments");

          return !isCommentsQuery;
        },
      });
    },
  });
}
