import { useRef, type ChangeEvent } from "react";
/* under development */
export function FileUploader({
  upload,
  isUploading,
  bucketName,
  accept,
  className,
}: {
  upload: (files: File[], bucketName: string) => void;
  isUploading: boolean;
  bucketName: string;
  accept: string;
  className?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleTriggerFileInput = () => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.click();
    }
  };
  const handleSelectAndUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.currentTarget.files ?? [];
    if (selected?.length > 0) {
      const file = selected[0];
      upload([file], bucketName);
    }
  };

  return (
    <form method="POST" onSubmit={(e) => e.preventDefault()}>
      <button
        onClick={handleTriggerFileInput}
        type="button"
        className={className}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      <input
        type="file"
        hidden={true}
        ref={fileInputRef}
        accept={accept}
        onChange={handleSelectAndUploadFile}
      />
    </form>
  );
}
