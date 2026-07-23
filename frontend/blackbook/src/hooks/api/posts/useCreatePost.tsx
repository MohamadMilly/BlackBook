import type { CreatePostRequestBody, Post, ResponseError } from "@app/types";
import { apiClient } from "../../../api/api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const createPost = async ({
  title,
  content,
  images,
}: CreatePostRequestBody): Promise<{ post: Required<Post> }> => {
  const response = await apiClient.post("/posts", {
    title,
    content,
    images,
  });
  return response.data;
};

export function useCreatePost() {
  return useMutation<
    { post: Required<Post> },
    AxiosError<ResponseError>,
    CreatePostRequestBody
  >({
    mutationKey: ["createPost"],
    mutationFn: createPost,
  });
}
