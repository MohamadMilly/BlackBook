import type { User, UserFollowDataType } from "@app/types";
import { UserItem } from "./UserItem";
import { Spinner } from "../../shared/ui/Spinner";

type UsersList = {
  isLoading: boolean;
  error: Error | null;
  users: (Omit<User, "password"> & UserFollowDataType)[];
};

export function UsersList({ isLoading, error, users }: UsersList) {
  if (isLoading)
    return (
      <Spinner size={32} className="w-full flex justify-center items-center" />
    );
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (users.length === 0)
    return (
      <p className="text-sm text-center text-neutral-400">
        No users available.
      </p>
    );

  return (
    <ul className="flex flex-col gap-2 divide-y-2 divide-neutral-800 rounded">
      {users.map((user) => {
        return <UserItem key={user.id} user={user} />;
      })}
    </ul>
  );
}
