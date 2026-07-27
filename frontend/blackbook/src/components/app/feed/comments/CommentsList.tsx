import type { Comment } from "@app/types";
import { CommentItem } from "./CommentItem";
import { CommentSkeleton } from "../skeleton/CommentSkeleton";

type CommentsListProps = {
  comments: Comment[];
  isLoading: boolean;
  error: Error | null;
};

export function CommentsList({
  comments,
  isLoading,
  error,
}: CommentsListProps) {
  if (isLoading) return <CommentSkeleton />;
  if (error) return <p>Error: {error.message}</p>;
  if (comments.length === 0)
    return (
      <p className="text-neutral-400 text-center text-sm">No comments yet.</p>
    );

  return (
    <ul className="p-2 min-h-0 flex flex-col gap-2">
      {comments.map((comment) => {
        return <CommentItem key={comment.id} comment={comment} />;
      })}
    </ul>
  );
}
