import {
  useRef,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import type { uploadDataType } from "../../../hooks/utils/useUpload";

type FileUploaderProps = {
  upload: (
    files: File[],
    bucketName: string,
    { onSuccess }: { onSuccess?: (results: uploadDataType[]) => void },
  ) => Promise<uploadDataType[] | undefined>;
  bucketName: string;
  accept: string;
  className?: string;
  onSuccess?: (results: uploadDataType[]) => void;
  children: ReactNode;
  allowMultiple?: boolean;
} & ComponentPropsWithoutRef<"button">;

export function FileUploader({
  upload,
  bucketName,
  accept,
  className,
  onSuccess,
  children,
  allowMultiple,
  ...props
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleTriggerFileInput = () => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.click();
    }
  };
  const handleSelectAndUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.currentTarget.files
      ? Array.from(e.currentTarget.files)
      : [];

    if (selectedFiles?.length > 0) {
      upload(selectedFiles, bucketName, { onSuccess: onSuccess });
    }
  };

  return (
    <div>
      <button
        {...props}
        onClick={handleTriggerFileInput}
        type="button"
        className={`${className} cursor-pointer`}
      >
        {children}
      </button>
      <input
        type="file"
        hidden={true}
        ref={fileInputRef}
        accept={accept}
        onChange={handleSelectAndUploadFile}
        multiple={allowMultiple}
      />
    </div>
  );
}
