import type { CreatePostRequestBody, Post, ResponseError } from "@app/types";
import { apiClient } from "../../../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useAuth } from "../../../contexts/authContext";
import { useNavigate } from "react-router";
import { useNotifications } from "../../../contexts/NotificationsContext";

const createPost = async ({
  title,
  content,
  images,
  type,
}: CreatePostRequestBody): Promise<{ post: Required<Post> }> => {
  const response = await apiClient.post("/posts", {
    title,
    content,
    images,
    type,
  });
  return response.data;
};

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const { add } = useNotifications();
  const navigate = useNavigate();
  return useMutation<
    { post: Required<Post> },
    AxiosError<ResponseError>,
    CreatePostRequestBody
  >({
    mutationKey: ["createPost"],
    mutationFn: createPost,
    onSuccess: (data) => {
      queryClient.setQueryData(["posts"], (old: { posts: Post[] }) => {
        if (!old?.posts) return old;

        return {
          ...old,
          posts: [data.post, ...old.posts],
        };
      });
      queryClient.setQueryData(
        ["posts", currentUser?.id],
        (old: { posts: Post[] }) => {
          if (!old?.posts) return old;

          return {
            ...old,
            posts: [data.post, ...old.posts],
          };
        },
      );
      queryClient.setQueryData(["users", currentUser?.id], (old) => {
        if (!old) return old;
        return {
          ...old,
          recentStoryId: data.post.id,
        };
      });
      add("Post created successfully", "SUCCESS");
      if (data.post.type === "FEED") {
        navigate("/app/feed");
      } else {
        navigate("/app/me");
      }
    },
  });
}
