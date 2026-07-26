import { Navigate, useNavigate, useParams } from "react-router";
import { SectionWrapper } from "../../components/app/layout/SectionWrapper";
import { ProfileHeader } from "../../components/app/profile/ProfileHeader";
import { useAuth } from "../../contexts/authContext";
import { useUser } from "../../hooks/api/users/useUser";
import { ProfileField } from "../../components/app/profile/ProfileField";
import { AtSign } from "lucide-react";
import { PostsList } from "../../components/app/feed/PostsList";
import { useUserPosts } from "../../hooks/api/posts/useUserPosts";
import type { Post } from "@app/types";
import { ProfileIdentity } from "../../components/app/profile/ProfileIdentity";
import { useEffect } from "react";

export function ProfilePage() {
  const { userId } = useParams();
  const numberUserId = userId ? JSON.parse(userId) : null;
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?.id || !numberUserId) return;
     
    if (numberUserId === currentUser?.id) {
      navigate("/me/profile", { replace: true });
    }
  }, [numberUserId, currentUser?.id, navigate]);

  const definedUserId: number = userId ? numberUserId : currentUser?.id;
  const {
    followersCount,
    followingCount,
    isFollowed,
    hasPendingFollowRequest,
    pendingFollowRequest,
    user,
    isLoading: isLoadingUser,
    error: userFetchError,
  } = useUser(definedUserId);
  const {
    posts,
    isLoading: isLoadingPosts,
    error: postsFetchError,
  } = useUserPosts(definedUserId);

  const fullname = user ? `${user.firstname} ${user.lastname}` : "";
  const profile = user?.profile;
  const isCurrentUserProfile = user ? user.id === currentUser?.id : false;
  return (
    <SectionWrapper title="Profile">
      {userFetchError ? (
        <p className="text-red-500">
          Error loading profile: {userFetchError.message || "Unknown error"}
        </p>
      ) : (
        <>
          <ProfileHeader
            avatarUrl={profile?.avatarUrl}
            bannerUrl={profile?.bannerUrl}
            followersCount={followersCount}
            followingCount={followingCount}
            isCurrentUserProfile={isCurrentUserProfile}
            isLoading={isLoadingUser}
            name={fullname}
            isFollowed={isFollowed}
            hasPendingFollowRequest={hasPendingFollowRequest}
            userId={definedUserId}
            pendingFollowRequest={pendingFollowRequest}
          />

          <ProfileIdentity
            isLoading={isLoadingUser}
            className="mt-14 flex flex-col items-center gap-1 md:hidden"
            name={fullname}
            followersCount={followersCount}
            followingCount={followingCount}
            isCurrentUserProfile={isCurrentUserProfile}
            isFollowed={isFollowed}
            hasPendingFollowRequest={hasPendingFollowRequest}
            userId={definedUserId}
            pendingFollowRequest={pendingFollowRequest}
          />
          <dl className="md:mt-18 mt-8 p-2 md:p-4">
            <ProfileField
              isLoading={isLoadingUser}
              fieldKey="Username"
              value={user?.username || ""}
              icon={<AtSign size={20} />}
            />
          </dl>
        </>
      )}
      <h3 className="text-2xl md:text-3xl mt-6">Posts</h3>
      <PostsList
        posts={posts as Required<Post>[]}
        isLoading={isLoadingPosts}
        error={postsFetchError}
      />
    </SectionWrapper>
  );
}
