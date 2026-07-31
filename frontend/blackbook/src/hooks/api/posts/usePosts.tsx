import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../api/api";
import type { Post } from "@app/types";

const getPosts = async (): Promise<{ posts: Required<Post>[] }> => {
  const response = await apiClient.get("/posts");
  
  return response.data;
};

export function usePosts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    staleTime: 1000 * 60 * 2,
   
  });
  const posts = data?.posts ?? [];

  return { posts, isLoading, error };
}
