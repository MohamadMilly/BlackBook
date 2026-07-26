import { useNavigate, useParams, useSearchParams } from "react-router";
import { useAuth } from "../../contexts/authContext";
import { SectionWrapper } from "../../components/app/layout/SectionWrapper";
import { Input } from "../../components/shared/ui/Input";
import { useEffect, type ChangeEvent } from "react";
import { UsersList } from "../../components/app/users/UsersList";
import { TriggerFetch } from "../../components/shared/utils/TriggerFetch";
import { useUserFollowings } from "../../hooks/api/users/useUserFollowings";

export function FollowingsPage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const numberUserId = Number(userId);
  const finalUserId = numberUserId ? numberUserId : (currentUser?.id as number);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const navigate = useNavigate();
  const {
    followings,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    isFetchNextPageError,
    hasNextPage,
    error,
  } = useUserFollowings(finalUserId, query);

  useEffect(() => {
    if (!currentUser?.id || !numberUserId) return;

    if (numberUserId === currentUser?.id) {
      navigate("/me/followings", { replace: true });
    }
  }, [numberUserId, currentUser?.id, navigate]);

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

  return (
    <SectionWrapper title="Followings">
      <form method="GET">
        <div>
          <label
            className="font-medium tracking-wide mb-1 block"
            htmlFor="search"
          >
            Search for Followings
          </label>
          <Input
            id="search"
            value={query}
            onChange={handleQueryChange}
            name="search"
            placeholder="Enter a name..."
          />
        </div>
      </form>
      <div className="mt-6">
        <UsersList isLoading={isLoading} error={error} users={followings} />
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
