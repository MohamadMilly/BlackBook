import type { User } from "@app/types";
import { UserItem } from "./UserItem";

type UsersList = {
  isLoading: boolean;
  error: Error | null;
  users: Omit<User, "password">[];
};

export function UsersList({ isLoading, error, users }: UsersList) {
  if (isLoading) return <p>Loading...</p>;
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
