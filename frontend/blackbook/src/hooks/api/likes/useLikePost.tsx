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
  const { user } = useAuth();
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
        if (!old?.posts) return old;

        const optimisticLike: Like = {
          id: Date.now(),
          createdAt: new Date(),
          userId: user?.id as number,
          postId: postId,
        };

        return {
          ...old,
          posts: old.posts.map((post: Required<Post>) => {
            if (post.id === postId) {
              const existingLike = post.likes.some(
                (like: Like) => like.userId === user?.id,
              );

              if (existingLike) {
                return {
                  ...post,
                  likes: post.likes.filter(
                    (like: Like) => like.userId !== user?.id,
                  ),
                };
              } else {
                return {
                  ...post,
                  likes: [...post.likes, optimisticLike],
                };
              }
            }
            return post;
          }),
        };
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
