import type { User } from "@app/types";
import { Avatar } from "../profile/Avatar";
import { formatDate } from "../../../shared/utils/formatDate";

export function UserItem({ user }: { user: Omit<User, "password"> }) {
  const fullname = user.firstname + " " + user.lastname;
  const formattedJoinedAtDate = formatDate(user.createdAt);
  return (
    <li className="flex items-start gap-2 bg-neutral-950 rounded-lg p-4">
      <Avatar className="shrink-0" size={45} />
      <div className="grow flex flex-col justify-start">
        <p className="font-bold tracking-tight">{fullname}</p>
        <span className="text-neutral-400 text-xs">
          Joined at: {formattedJoinedAtDate}
        </span>
      </div>
    </li>
  );
}
