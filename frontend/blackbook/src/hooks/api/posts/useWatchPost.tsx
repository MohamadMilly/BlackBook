import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { apiClient } from "../../../api/api";
import type { Post, ResponseError } from "@app/types";

const watchPost = async ({
  postId,
}: {
  postId: number;
}): Promise<{ hasBeenWatched: boolean }> => {
  const response = await apiClient.post(`/posts/${postId}/views`);

  return response.data;
};

export function useWatchPost() {
  const queryClient = useQueryClient();

  return useMutation<
    { hasBeenWatched: boolean },
    AxiosError<{ errors: ResponseError[] } | ResponseError>,
    { postId: number }
  >({
    mutationKey: ["watchPost"],
    mutationFn: watchPost,
    onSuccess: (_data, args) => {
      queryClient.setQueriesData(
        { queryKey: ["posts"] },
        (old: { posts: Required<Post>[] }) => {
          if (!old?.posts) return old;

          return {
            ...old,
            posts: old.posts.map((post) => {
              if (post.id === args.postId) {
                return {
                  ...post,
                  views: post.views + 1,
                  isWatched: true,
                };
              } else return post;
            }),
          };
        },
      );
    },
  });
}
