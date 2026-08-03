import type { Post, ResponseError, ToggleLikeResponseBody } from "@app/types";
import { apiClient } from "../../../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNotifications } from "../../../contexts/NotificationsContext";
import { getErrorMessage } from "../../../shared/utils/getErrorMessage";

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
  const { add } = useNotifications();

  return useMutation<
    ToggleLikeResponseBody,
    AxiosError<{ errors: ResponseError[] } | ResponseError>,
    { postId: number },
    { previousQueriesState?: Array<[readonly unknown[], unknown]> }
  >({
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
    onError: (error, _variables, context) => {
      if (context?.previousQueriesState) {
        context.previousQueriesState.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      add(
        getErrorMessage(
          error as AxiosError<
            { errors: ResponseError[] } | ResponseError
          > | null,
        ),
        "ERROR",
      );
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
