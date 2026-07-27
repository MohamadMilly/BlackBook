import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../api/api";
import type { Comment, Post } from "@app/types";

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
  return useMutation({
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
        (old: { posts: Post[] }) => {
          if (!old?.posts) return old;

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
        },
      );
    },
  });
}
