import type { Comment } from "@app/types";
import { Avatar } from "../../profile/Avatar";
import { Link } from "react-router";
import { useAuth } from "../../../../contexts/authContext";

type CommentItemProps = {
  comment: Comment;
};

export function CommentItem({ comment }: CommentItemProps) {
  const author = comment.user;
  const authorProfile = author?.profile;
  const fullname: string = author?.firstname + " " + author?.lastname;
  const { user: currentUser } = useAuth();
  const isCurrentUserComment = currentUser?.id === author?.id;
  return (
    <li className="flex gap-1 items-end">
      <Avatar
        className="shrink-0"
        avatarUrl={authorProfile?.avatarUrl}
        size={40}
      />
      <article className="grow bg-neutral-900 py-1.5 px-2.5 rounded-t-xl rounded-r-xl rounded-bl-none">
        <Link
          to={`/app/users/${author?.id}`}
          className="block text-sm font-semibold text-neutral-200 tracking-wide hover:underline cursor-pointer mb-1"
        >
          {fullname}{" "}
          {isCurrentUserComment && (
            <span className="text-xs text-neutral-400">(you)</span>
          )}
        </Link>
        <p className="text-sm text-neutral-300 whitespace-pre-wrap" dir="auto">
          {comment.text}
        </p>
      </article>
    </li>
  );
}
