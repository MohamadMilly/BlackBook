import type { JSX } from "react/jsx-runtime";
import { ProfileIdentity } from "./ProfileIdentity";
import type { FollowRequest } from "@app/types";
import { ProfileHeaderSkeleton } from "./skeleton/ProfileHeaderSkeleton";
import { FileUploader } from "../../shared/utils/FileUploader";
import { useUpload, type uploadDataType } from "../../../hooks/utils/useUpload";
import { usePatchProfile } from "../../../hooks/api/me/usePatchProfile";
import { Camera } from "lucide-react";
import { Spinner } from "../../shared/ui/Spinner";
import { EditableAvatar } from "./EditableAvatar";

type ProfileHeaderProps = {
  bannerUrl: string | null | undefined;
  avatarUrl: string | null | undefined;
  name: string;
  isLoading: boolean;
  followersCount: number;
  followingCount: number;
  isCurrentUserProfile: boolean;
  hasPendingFollowRequest: boolean;
  pendingFollowRequest: FollowRequest | null;
  isFollowed: boolean;
  userId: number;
};

export function ProfileHeader({
  bannerUrl,
  avatarUrl,
  isLoading,
  name,
  followersCount,
  followingCount,
  isCurrentUserProfile,
  hasPendingFollowRequest,
  pendingFollowRequest,
  isFollowed,
  userId,
}: ProfileHeaderProps): JSX.Element {
  if (isLoading) return <ProfileHeaderSkeleton />;
  const { isUploading, upload } = useUpload();
  const { mutate: patchProfile, isPending: isPendingProfilePatch } =
    usePatchProfile();

  const handleSuccessUploadBanner = (results: uploadDataType[]) => {
    const successUploadData = results.find((result) => result.success);

    if (!successUploadData) {
      console.error("No Upload succeed to patch profile banner");
      return;
    }
    patchProfile({ bannerUrl: successUploadData.url });
  };
  return (
    <div
      style={{
        backgroundImage: `url(${bannerUrl})`,
        backgroundSize: "cover",
      }}
      className="relative w-full min-h-48 md:min-h-75 bg-neutral-900 flex items-end px-6 rounded"
    >
      <div className="w-full translate-y-1/3 flex gap-4 items-center justify-end md:justify-start md:flex-row flex-col">
        <EditableAvatar
          avatarUrl={avatarUrl}
          isCurrentUserProfile={isCurrentUserProfile}
        />

        <ProfileIdentity
          isLoading={isLoading}
          className="hidden md:block"
          followersCount={followersCount}
          name={name}
          followingCount={followingCount}
          isCurrentUserProfile={isCurrentUserProfile}
          hasPendingFollowRequest={hasPendingFollowRequest}
          isFollowed={isFollowed}
          userId={userId}
          pendingFollowRequest={pendingFollowRequest}
        />
      </div>

      {isCurrentUserProfile && (
        <FileUploader
          disabled={isUploading}
          accept="image/*"
          upload={upload}
          bucketName="images"
          onSuccess={handleSuccessUploadBanner}
          className="absolute md:top-4 md:right-4 top-2 right-2 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center transition-colors hover:bg-blue-700 cursor-pointer"
        >
          {isUploading || isPendingProfilePatch ? (
            <Spinner className="text-white!" size={20} />
          ) : (
            <Camera size={20} />
          )}
          <span className="sr-only">Update Banner image</span>
        </FileUploader>
      )}
    </div>
  );
}
