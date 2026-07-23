import { type ChangeEvent } from "react";
import { SectionWrapper } from "../../components/app/layout/SectionWrapper";
import { Input } from "../../components/shared/ui/Input";
import { useSearchParams } from "react-router";
import { useUsers } from "../../hooks/api/users/useUsers";
import { UsersList } from "../../components/app/users/UsersList";
import { TriggerFetch } from "../../components/shared/utils/TriggerFetch";
import { useDebounce } from "../../hooks/utils/useDebounce";

export function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query");
  const debouncedQuery = useDebounce(query);
  const {
    users,
    isFetchingNextPage,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useUsers(debouncedQuery ?? "");

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ query: e.target.value }, { replace: true });
  };
  return (
    <SectionWrapper title="Users">
      <form method="POST" className="sticky top-0 bg-black py-2">
        <div>
          <label
            className="font-medium tracking-wide mb-1 block"
            htmlFor="search"
          >
            Search For Users
          </label>
          <Input
            value={query ?? ""}
            onChange={handleQueryChange}
            type="search"
            name="query"
            id="search"
            placeholder="Mohammed Milly..."
          />
        </div>
      </form>
      <div className="mt-6">
        <UsersList isLoading={isLoading} error={error} users={users} />
        {hasNextPage && (
          <TriggerFetch
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
        {isFetchingNextPage && (
          <p className="text-sm text-center text-neutral-400">
            Loading more users...
          </p>
        )}
      </div>
    </SectionWrapper>
  );
}
