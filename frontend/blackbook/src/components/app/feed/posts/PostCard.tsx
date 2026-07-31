import { Eye, MessageCircleMore, ThumbsUp } from "lucide-react";
import { Button } from "../../../shared/ui/Button";
import { Avatar } from "../../profile/Avatar";
import type { Post } from "@app/types";
import { formatDate } from "../../../../shared/utils/formatDate";
import { useLikePost } from "../../../../hooks/api/likes/useLikePost";
import { memo, useCallback } from "react";
import { useAuth } from "../../../../contexts/authContext";
import { Link, useSearchParams } from "react-router";
import { PostImagesGrid } from "./PostImagesGrid";
import { PostViews } from "./PostViews";
import { PostAuthorInfo } from "./PostAuthorInfo";
import { PostActionControls } from "./PostActionsSection";

type PostCardProps = {
  post: Required<Post> & { isWatched?: boolean };
  handleImagesUrlsChange: (newImagesUrls: string[]) => void;
};

export const PostCard = memo(function PostCard({
  post,
  handleImagesUrlsChange,
}: PostCardProps) {
  const { user: currentUser } = useAuth();

  const { content, title, user, createdAt } = post;
  const authorProfile = user.profile;
  const authorName = user.firstname + " " + user.lastname;
  const formattedDate = formatDate(createdAt);
  const likes = post.likes;
  const likesCount = likes.length;
  const commentsCount = post.commentsCount;
  const isCurrentUserLiking = likes.some(
    (like) => like.userId === currentUser?.id,
  );

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
