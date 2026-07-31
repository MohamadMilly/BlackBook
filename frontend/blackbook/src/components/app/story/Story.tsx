import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { usePost } from "../../../hooks/api/posts/usePost";
import { PostActionControls } from "../feed/posts/PostActionsSection";
import { useAuth } from "../../../contexts/authContext";
import { StoryHeader } from "./StoryHeader";
import { StoryTextContent } from "./StoryTextContent";
import { ImagesCarousel } from "../../shared/ui/ImagesCarousel";
import { PostViews } from "../feed/posts/PostViews";
import { Spinner } from "../../shared/ui/Spinner";
import { StoryWrapperLayer } from "./StoryWrapperLayer";

type StoryProps = {
  storyId: number | null;
  durationSecs: number;
};

export function Story({ storyId, durationSecs }: StoryProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: currentUser } = useAuth();
  const { post, isLoading, error } = usePost(storyId);
  const durationMs = durationSecs * 1000;
  const remaingingTimeRef = useRef<number>(durationMs);
  const startTime = useRef<number>(null);
  const [paused, setPaused] = useState<boolean>(false);

  useEffect(() => {
    if (!storyId || paused) return;

    startTime.current = Date.now();
    const timer = setTimeout(handleCloseStory, remaingingTimeRef.current);

    return () => {
      clearTimeout(timer);
      if (!paused && startTime.current) {
        const passed = Date.now() - startTime.current;
        remaingingTimeRef.current -= passed;
        if (remaingingTimeRef.current <= 0) {
          handleCloseStory();
        }
      }
    };
  }, [durationMs, storyId, paused]);

  useEffect(() => {
    if (searchParams.has("commentsFor")) {
      setPaused(true);
    } else {
      setPaused(false);
    }
  }, [searchParams]);

  const handleCloseStory = () => {
    searchParams.delete("storyId");
    searchParams.delete("commentsFor");
    setSearchParams(searchParams);
    startTime.current = null;
    remaingingTimeRef.current = durationSecs * 1000;
  };

  if (!storyId) return null;

  if (isLoading) {
    return (
      <StoryWrapperLayer>
        <Spinner size={30} />
      </StoryWrapperLayer>
    );
  }

  if (error || !post) {
    return (
      <StoryWrapperLayer>
        <p className="text-red-500">
          {error ? `Error: ${error.message}` : "No Story found."}
        </p>
      </StoryWrapperLayer>
    );
  }

  const storyImages = post?.images ?? [];
  const storyAuthor = post?.user;
  const { content, title, commentsCount, views } = post;
  const likesCount = post.likes.length;
  const isCurrentUserLiking = post.likes.some(
    (like) => like.userId === currentUser?.id,
  );
  return (
    <StoryWrapperLayer>
      <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/80 p-0 sm:p-4 backdrop-blur-sm">
        <div className="relative h-full w-full max-w-lg overflow-hidden bg-neutral-950 shadow-2xl animate-popUp sm:h-[90vh] sm:rounded-2xl sm:border sm:border-neutral-800">
          <StoryHeader
            durationSecs={durationSecs}
            paused={paused}
            author={storyAuthor}
            handleCloseStory={handleCloseStory}
          />

          <ImagesCarousel
            images={storyImages}
            className="absolute inset-0"
            direction="horizontal"
          />

          <div className="absolute bottom-0 inset-x-0 z-20 bg-linear-to-t from-black/90 via-black/50 to-transparent p-6 pt-12 text-white">
            <StoryTextContent title={title} content={content} />
            <PostViews views={views} postId={storyId} />
            <PostActionControls
              commentsCount={commentsCount}
              likesCount={likesCount}
              isCurrentUserLiking={isCurrentUserLiking}
              postId={post.id}
            />
          </div>
        </div>
      </div>
    </StoryWrapperLayer>
  );
}
