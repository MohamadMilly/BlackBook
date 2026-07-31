import type { Post } from "@app/types";
import { PostCard } from "./PostCard";
import { PostSkeleton } from "../skeleton/PostSkeleton";
import { usePostImages } from "../../../../contexts/PostImagesContext";

type PostsListProps = {
  posts: Required<Post>[];
  isLoading: boolean;
  error: Error | null;
};

export function PostsList({ posts, isLoading, error }: PostsListProps) {
  const { handleImagesUrlsChange } = usePostImages();
  if (isLoading) return <PostSkeleton />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  return (
    <div className="flex flex-col gap-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            handleImagesUrlsChange={handleImagesUrlsChange}
          />
        ))
      ) : (
        <p className="text-sm text-neutral-400">No posts yet</p>
      )}
    </div>
  );
}
