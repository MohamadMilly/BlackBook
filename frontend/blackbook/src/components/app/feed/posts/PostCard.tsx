import { MessageCircleMore, ThumbsUp } from "lucide-react";
import { Button } from "../../../shared/ui/Button";
import { Avatar } from "../../profile/Avatar";
import type { Post } from "@app/types";
import { formatDate } from "../../../../shared/utils/formatDate";
import { useLikePost } from "../../../../hooks/api/likes/useLikePost";
import { useCallback } from "react";
import { useAuth } from "../../../../contexts/authContext";
import { Link } from "react-router";

export function PostCard({
  post,
  handlePostIdChange,
}: {
  post: Required<Post>;
  handlePostIdChange: (newPostId: number | null) => void;
}) {
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
  const { mutate: toggleLike } = useLikePost();

  const handleToggleLike = useCallback(() => {
    toggleLike({
      postId: post.id,
    });
  }, []);
  return (
    <article className="p-4 border border-neutral-800 rounded-xl transition-all duration-200 hover:border-neutral-700/60 shadow-sm bg-neutral-950">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <Avatar avatarUrl={authorProfile?.avatarUrl} size={40} />
          <Link to={`/app/users/${user.id}`}>
            <span className="text-sm font-semibold text-neutral-200 tracking-wide hover:underline cursor-pointer">
              {authorName}
            </span>
          </Link>
        </div>
        <span className="text-xs text-neutral-400">{formattedDate}</span>
      </div>

      <div className="space-y-2 mb-5 min-h-40">
        {title && (
          <h3 className="text-lg font-bold text-neutral-100 tracking-tight leading-snug hover:text-blue-500 transition-colors cursor-pointer">
            {title}
          </h3>
        )}
        <p className="text-neutral-200 leading-relaxed wrap-break-word line-clamp-4">
          {content}
        </p>
      </div>

      <div className="flex items-center border border-neutral-800 rounded-lg  divide-x divide-neutral-800">
        <Button
          onClick={handleToggleLike}
          className={`grow rounded-r-none flex items-center gap-1 ${isCurrentUserLiking ? "bg-blue-600!" : ""}`}
        >
          <ThumbsUp fill={isCurrentUserLiking ? "white" : "none"} size={25} />{" "}
          Like ( {likesCount} )
        </Button>
        <Button
          onClick={() => handlePostIdChange(post.id)}
          className="grow rounded-l-none flex items-center gap-1"
        >
          <span>
            <MessageCircleMore size={25} />
          </span>
          Comment ( {commentsCount} )
        </Button>
      </div>
    </article>
  );
}
