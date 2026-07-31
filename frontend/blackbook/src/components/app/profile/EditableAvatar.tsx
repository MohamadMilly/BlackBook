import { Camera } from "lucide-react";
import { Spinner } from "../../shared/ui/Spinner";
import { FileUploader } from "../../shared/utils/FileUploader";
import { Avatar } from "./Avatar";
import { useUpload, type uploadDataType } from "../../../hooks/utils/useUpload";
import { usePatchProfile } from "../../../hooks/api/me/usePatchProfile";
import { useSearchParams } from "react-router";

export interface EditableAvatarProps {
  avatarUrl: string | null | undefined;
  isCurrentUserProfile: boolean;
  className?: string;
  recentStoryId: number | null;
}

export function EditableAvatar({
  avatarUrl,
  isCurrentUserProfile,
  className = "",
  recentStoryId,
}: EditableAvatarProps) {
  const { isUploading, upload } = useUpload();
  const [searchParams, setSearchParams] = useSearchParams();

  const { mutate: patchProfile, isPending: isPendingProfilePatch } =
    usePatchProfile();
  const onSuccessUploadAvatar = (results: uploadDataType[]) => {
    const successUploadData = results.find((result) => result.success);

    if (!successUploadData) {
      console.error("No Upload succeeded to patch profile avatar");
      return;
    }
    patchProfile({ avatarUrl: successUploadData.url });
  };

  const showLoadingState = isUploading || isPendingProfilePatch;
  const setStoryQueryParam = () => {
    setSearchParams((prev) => ({ ...prev, storyId: recentStoryId }));
  };
  return (
    <div className={`relative rounded-full ${className}`}>
      <button disabled={!recentStoryId} onClick={setStoryQueryParam}>
        <Avatar
          avatarUrl={avatarUrl}
          size={130}
          className={`md:w-45! md:h-45! border-4 border-neutral-900 ${recentStoryId ? "shadow-[0_0_0_2px_#0a0a0a,0_0_0_5px_#2563eb] cursor-pointer" : ""}`}
        />
      </button>

      {isCurrentUserProfile && (
        <FileUploader
          disabled={isUploading}
          accept="image/*"
          upload={upload}
          bucketName="images"
          onSuccess={onSuccessUploadAvatar}
          className="absolute md:bottom-4 md:right-4 bottom-2 right-2 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center transition-colors hover:bg-blue-700 cursor-pointer"
        >
          {showLoadingState ? (
            <Spinner className="text-white!" size={20} />
          ) : (
            <Camera size={20} className="text-white" />
          )}
        </FileUploader>
      )}
      <span className="sr-only">Update avatar image</span>
    </div>
  );
}
