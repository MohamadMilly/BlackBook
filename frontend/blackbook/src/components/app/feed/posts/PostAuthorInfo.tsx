import { Link } from "react-router";
import { Avatar } from "../../profile/Avatar";

type PostAuthorProps = {
  avatarUrl: string | null | undefined;
  name: string;
  userId: number;
};

export function PostAuthorInfo({ avatarUrl, name, userId }: PostAuthorProps) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar avatarUrl={avatarUrl} size={40} />
      <Link to={`/app/users/${userId}`}>
        <span className="text-sm font-semibold text-neutral-200 tracking-wide hover:underline cursor-pointer">
          {name}
        </span>
      </Link>
    </div>
  );
}
