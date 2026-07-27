import { PostsList } from "../../components/app/feed/posts/PostsList";
import { SectionWrapper } from "../../components/app/layout/SectionWrapper";
import { usePosts } from "../../hooks/api/posts/usePosts";

export function FeedPage() {
  const { posts, isLoading, error } = usePosts();
  return (
    <SectionWrapper title="Feed">
      <PostsList isLoading={isLoading} error={error} posts={posts} />
    
    </SectionWrapper>
  );
}
