import { Navigate, useParams } from "react-router";
import { SectionWrapper } from "../../components/app/layout/SectionWrapper";
import { ProfileHeader } from "../../components/app/profile/ProfileHeader";
import { useAuth } from "../../contexts/authContext";
import { useUser } from "../../hooks/api/users/useUser";
import { ProfileField } from "../../components/app/profile/ProfileField";
import { AtSign } from "lucide-react";
import { PostsList } from "../../components/app/feed/PostsList";
import { useUserPosts } from "../../hooks/api/posts/useUserPosts";
import type { Post } from "@app/types";

export function ProfilePage() {
  const { userId } = useParams();
  const userIdNumber = userId ? JSON.parse(userId) : null;
  const { user: currentUser } = useAuth();

  if (userIdNumber === currentUser?.id) {
    return <Navigate to={"/me/profile"} />;
  }
  const definedUserId: number = userId ? userIdNumber : currentUser?.id;
  const {
    user,
    isLoading: isLoadingUser,
    error: userFetchError,
  } = useUser(definedUserId);
  const {
    posts,
    isLoading: isLoadingPosts,
    error: postsFetchError,
  } = useUserPosts(definedUserId);

  return (
    <SectionWrapper title="Profile">
      {userFetchError ? (
        <p className="text-red-500">
          Error loading profile: {userFetchError.message || "Unknown error"}
        </p>
      ) : (
        <>
          <ProfileHeader
            isLoading={isLoadingUser}
            name={user ? `${user.firstname} ${user.lastname}` : ""}
          />
          <dl className="mt-18 p-4">
            <ProfileField
              isLoading={isLoadingUser}
              fieldKey="Username"
              value={user?.username || ""}
              icon={<AtSign size={20} />}
            />
          </dl>
        </>
      )}
      <h3 className="text-2xl md:text-3xl">Posts</h3>
      <PostsList
        posts={posts as Required<Post>[]}
        isLoading={isLoadingPosts}
        error={postsFetchError}
      />
    </SectionWrapper>
  );
}
