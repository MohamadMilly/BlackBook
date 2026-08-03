import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { apiClient } from "../../../api/api";
import { useNotifications } from "../../../contexts/NotificationsContext";
import { getErrorMessage } from "../../../shared/utils/getErrorMessage";
import type { Comment, Post, ResponseError } from "@app/types";

const createComment = async ({
  postId,
  text,
}: {
  postId: number;
  text: string;
}): Promise<{ comment: Comment }> => {
  const response = await apiClient.post(`/posts/${postId}/comments`, {
    text,
  });

  return response.data;
};

export function useCreateComment() {
  const queryClient = useQueryClient();
  const { add } = useNotifications();
  return useMutation<
    { comment: Comment },
    AxiosError<{ errors: ResponseError[] } | ResponseError>,
    { postId: number; text: string }
  >({
    mutationKey: ["createComment"],
    mutationFn: createComment,
    onSuccess: (data, args) => {
      queryClient.setQueryData(
        ["posts", args.postId, "comments"],
        (old: { comments: Comment[] }) => {
          if (!old?.comments) return;

          return {
            ...old,
            comments: [data.comment, ...old.comments],
          };
        },
      );
      queryClient.setQueriesData(
        { queryKey: ["posts"] },
        (old: { posts: Required<Post>[] } | { post: Required<Post> }) => {
          if (!old) return old;
          if ("posts" in old) {
            return {
              ...old,
              posts: old.posts.map((post) => {
                if (post.id === args.postId) {
                  return {
                    ...post,
                    commentsCount: (post?.commentsCount ?? 0) + 1,
                  };
                } else return post;
              }),
            };
          }
          if ("post" in old) {
            return {
              ...old,
              post: {
                ...old.post,
                commentsCount: (old.post?.commentsCount ?? 0) + 1,
              },
            };
          }
        },
      );
      add("Comment posted successfully.", "SUCCESS");
    },
    onError: (error) => {
      add(
        getErrorMessage(
          error as AxiosError<
            { errors: ResponseError[] } | ResponseError
          > | null,
        ),
        "ERROR",
      );
    },
  });
}
