import { MessageCircleMore, ThumbsUp } from "lucide-react";
import { Button } from "../../shared/ui/Button";
import { Avatar } from "../profile/Avatar";
import type { Post } from "@app/types";
import { formatDate } from "../../../shared/utils/formatDate";

export function PostCard({ post }: { post: Required<Post> }) {
  const { content, title, user, createdAt } = post;
  const authorName = user.firstname + " " + user.lastname;
  const formattedDate = formatDate(createdAt);
  return (
    <article className="p-4 border border-neutral-800 rounded-xl transition-all duration-200 hover:border-neutral-700/60 shadow-sm bg-neutral-950">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <Avatar size={32} />
          <span className="text-sm font-semibold text-neutral-200 tracking-wide hover:underline cursor-pointer">
            {authorName}
          </span>
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
        <Button className="grow rounded-r-none flex items-center gap-1">
          <ThumbsUp size={25} /> Like
        </Button>
        <Button className="grow rounded-l-none flex items-center gap-1">
          <span>
            <MessageCircleMore size={25} />
          </span>
          Comment
        </Button>
      </div>
    </article>
  );
}
