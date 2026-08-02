import type { GetUsersResponseBody } from "@app/types";
import { UserItem } from "./UserItem";
import { Spinner } from "../../shared/ui/Spinner";

type UsersList = {
  isLoading: boolean;
  error: Error | null;
  items: GetUsersResponseBody["users"];
};

export function UsersList({ isLoading, error, items }: UsersList) {
  if (isLoading)
    return (
      <Spinner size={32} className="w-full flex justify-center items-center" />
    );
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (items.length === 0)
    return (
      <p className="text-sm text-center text-neutral-400">
        No users available.
      </p>
    );

  return (
    <ul className="flex flex-col gap-2 divide-y-2 divide-neutral-800 rounded">
      {items.map((item) => {
        return <UserItem key={item.user.id} item={item} />;
      })}
    </ul>
  );
}
