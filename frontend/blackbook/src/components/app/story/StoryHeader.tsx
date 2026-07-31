import type { Post } from "@app/types";
import { PostAuthorInfo } from "../feed/posts/PostAuthorInfo";
import { X } from "lucide-react";

type StoryHeaderProps = {
  durationSecs: number;
  paused: boolean;
  author: Required<Post>["user"];
  handleCloseStory: () => void;
};

export function StoryHeader({
  durationSecs,
  paused,
  author,
  handleCloseStory,
}: StoryHeaderProps) {
  const authorName = author?.firstname + " " + author?.lastname;
  const authorProfile = author?.profile;
  return (
    <div className="absolute top-0 inset-x-0 z-20 bg-linear-to-b from-black/80 via-black/40 to-transparent p-4 pt-6">
      <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-white/20">
        <div
          style={{
            animationDuration: `${durationSecs}s`,
            animationPlayState: paused ? "paused" : "running",
          }}
          className="h-full bg-white animate-growWidth origin-left"
        ></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-white mix-blend-screen">
          <PostAuthorInfo
            name={authorName}
            avatarUrl={authorProfile?.avatarUrl}
            userId={author.id}
          />
        </div>

        <button
          onClick={handleCloseStory}
          className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close story"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
