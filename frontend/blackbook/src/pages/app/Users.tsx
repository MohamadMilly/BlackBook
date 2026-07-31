import { useEffect, useState, type ChangeEvent } from "react";
import { SectionWrapper } from "../../components/app/layout/SectionWrapper";
import { Input } from "../../components/shared/ui/Input";
import { useSearchParams } from "react-router";
import { useUsers } from "../../hooks/api/users/useUsers";
import { UsersList } from "../../components/app/users/UsersList";
import { VisibilityTrigger } from "../../components/shared/utils/VisibilityTrigger";
import { useDebounce } from "../../hooks/utils/useDebounce";
import { useFollowRequests } from "../../hooks/api/users/useFollowRequests";
import type { FollowRequestType } from "@app/types";
import { RequestsList } from "../../components/app/users/requests/RequestsList";
import { useFollowRequestsCount } from "../../hooks/api/users/useFollowRequestsCount";
import { RequestsSectionControls } from "../../components/app/users/requests/RequestsSectionControls";


export function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [requestsVisible, setRequestsVisible] = useState(true);
  const requestsType =
    (searchParams.get("requestsType") as FollowRequestType) || "received";
  const debouncedQuery = useDebounce(query);

  const { count, isLoading: isFollowRequestsCountLoading } =
    useFollowRequestsCount(requestsType);

  const {
    users,
    isFetchingNextPage,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useUsers(debouncedQuery ?? "");

  const {
    requests,
    isLoading: isLoadingRequests,
    error: fetchRequestsError,
  } = useFollowRequests(requestsType);

  useEffect(() => {
    if (!searchParams.get("requestsType")) {
      setSearchParams((prev) => {
        prev.set("requestsType", "received");
        return prev;
      });
    }
  }, []);

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchParams(
      (prev) => {
        prev.set("query", e.target.value);
        return prev;
      },
      {
        replace: true,
      },
    );
  };

  const handleToggleRequests = () => {
    setRequestsVisible(!requestsVisible);
  };

  const handleToggleRequestsType = () => {
    setSearchParams((prev) => {
      const nextType = requestsType === "received" ? "sent" : "received";
      prev.set("requestsType", nextType);
      return prev;
    });
  };

  return (
    <SectionWrapper title="Users">
      <div>
        <RequestsSectionControls
          handleToggleRequests={handleToggleRequests}
          requestsVisible={requestsVisible}
          isFollowRequestsCountLoading={isFollowRequestsCountLoading}
          requestsCount={count}
          handleToggleRequestsType={handleToggleRequestsType}
          requestsType={requestsType}
        />

        {requestsVisible && (
          <RequestsList
            requests={requests}
            isLoading={isLoadingRequests}
            error={fetchRequestsError}
            type={requestsType}
          />
        )}
      </div>

      <form method="POST" className="sticky top-0 bg-black py-2 mt-4 z-100">
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
          <VisibilityTrigger
            onVisible={fetchNextPage}
            isActive={!isFetchingNextPage}
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
