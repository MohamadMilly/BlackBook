import type { Post } from "@app/types";
import { formatDate } from "../../../../shared/utils/formatDate";

import { PostImagesGrid } from "./PostImagesGrid";
import { PostViews } from "./PostViews";
import { PostAuthorInfo } from "./PostAuthorInfo";
import { PostActionControls } from "./PostActionsSection";
import { memo } from "react";

type PostCardProps = {
  post: Required<Post>;
  handleImagesUrlsChange: (newImagesUrls: string[]) => void;
};

export const PostCard = memo(function PostCard({
  post,
  handleImagesUrlsChange,
}: PostCardProps) {
  const { content, title, user, createdAt } = post;
  const authorProfile = user.profile;
  const authorName = user.firstname + " " + user.lastname;
  const formattedDate = formatDate(createdAt);

  const likesCount = post.likesCount;
  const commentsCount = post.commentsCount;
  const isCurrentUserLiking = post.isLiked;

  return (
    <article className="p-4 border border-neutral-800 rounded-xl transition-all duration-200 hover:border-neutral-700/60 shadow-sm bg-neutral-950">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-4">
        <PostAuthorInfo
          userId={user.id}
          avatarUrl={authorProfile?.avatarUrl}
          name={authorName}
        />
        <span className="text-xs text-neutral-400">{formattedDate}</span>
      </div>

      <div className="space-y-2 mb-5 min-h-40 whitespace-pre-wrap">
        {title && (
          <h3
            dir="auto"
            className="text-lg font-bold text-neutral-100 tracking-tight leading-snug transition-colors"
          >
            {title}
          </h3>
        )}
        <p
          className="text-neutral-200 leading-relaxed wrap-break-word"
          dir="auto"
        >
          {content}
        </p>
        <PostImagesGrid
          images={post.images}
          handleImagesUrlsChange={handleImagesUrlsChange}
        />
      </div>
      <PostViews views={post.views} postId={post.id} />
      <PostActionControls
        commentsCount={commentsCount}
        isCurrentUserLiking={isCurrentUserLiking}
        likesCount={likesCount}
        postId={post.id}
      />
    </article>
  );
});
