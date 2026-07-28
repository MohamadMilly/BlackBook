import { Camera } from "lucide-react";
import { Spinner } from "../../shared/ui/Spinner";
import { FileUploader } from "../../shared/utils/FileUploader";
import { Avatar } from "./Avatar";
import { useUpload, type uploadDataType } from "../../../hooks/utils/useUpload";
import { usePatchProfile } from "../../../hooks/api/me/usePatchProfile";

export interface EditableAvatarProps {
  avatarUrl: string | null | undefined;
  isCurrentUserProfile: boolean;
  className?: string;
}

export function EditableAvatar({
  avatarUrl,
  isCurrentUserProfile,
  className = "",
}: EditableAvatarProps) {
  const { isUploading, upload } = useUpload();
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

  return (
    <div className={`relative rounded-full ${className}`}>
      <Avatar
        avatarUrl={avatarUrl}
        size={130}
        className="md:w-45! md:h-45! border-4 border-neutral-900"
      />

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
