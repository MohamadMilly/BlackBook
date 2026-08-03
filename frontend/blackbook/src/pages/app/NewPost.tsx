import { useMemo, useState, type ChangeEvent, type SubmitEvent } from "react";
import { SectionWrapper } from "../../components/app/layout/SectionWrapper";
import { Input } from "../../components/shared/ui/Input";
import { TextArea } from "../../components/shared/ui/TextArea";
import { Button } from "../../components/shared/ui/Button";
import type { CreatePostRequestBody, ResponseError } from "@app/types";
import { useCreatePost } from "../../hooks/api/posts/useCreatePost";
import { useMarkFieldsInValid } from "../../hooks/utils/useMarkFieldsInvalid";
import { getServerAndValidationErrors } from "../../shared/utils/getServerAndValidationError";
import { ErrorsList } from "../../components/form/ErrorsList";
import { useUpload, type uploadDataType } from "../../hooks/utils/useUpload";
import { FileUploader } from "../../components/shared/utils/FileUploader";
import { Upload } from "lucide-react";
import { UploadedImagesStrip } from "../../components/app/newPost/UploadedImagesStrip";
import { Checkbox } from "../../components/shared/ui/CheckBox";

export function NewPostPage() {
  const [postData, setPostData] = useState<CreatePostRequestBody>({
    title: "",
    content: "",
    images: [],
    type: "FEED",
  });

  const {
    mutate: createPost,
    isPending: isCreatingPostPending,
    error: postCreationError,
  } = useCreatePost();

  const { isUploading, upload } = useUpload();
  
  const errors: ResponseError[] = useMemo(
    () => getServerAndValidationErrors(postCreationError),
    [postCreationError],
  );

  useMarkFieldsInValid(errors);
  const handlePostDataChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target; // better than passing the key manually for performance
    setPostData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPost(postData);
  };
  const onUploadingImagesSuccess = (results: uploadDataType[]) => {
    const successUploadData = results.filter((result) => result.success);
    if (successUploadData.length === 0) {
      console.error("failed uploading all images for post");
      return;
    }
    const urls = successUploadData.map((result) => result.url);
    setPostData((prev) => ({
      ...prev,
      images: [...prev.images, ...urls],
    }));
  };
  
  const handleDeleteImage = (imageUrl: string): void => {
    if (postData.images.includes(imageUrl)) {
      const nextImages = postData.images.filter((image) => image !== imageUrl);
      setPostData((prev) => ({ ...prev, images: nextImages }));
    }
  };
  return (
    <SectionWrapper title="New Post">
      <form className="px-2" onSubmit={handleSubmit} method="POST">
        <ErrorsList errors={errors} />
        <div className="my-4">
          <label
            className="tracking-wide font-medium optional-label"
            htmlFor="title"
          >
            Title
          </label>
          <Input
            onChange={handlePostDataChange}
            name="title"
            id="title"
            type="text"
            placeholder="post title..."
          />
        </div>
        <div className="my-4">
          <label
            className="tracking-wide font-medium required-label"
            htmlFor="content"
          >
            Content
          </label>
          <TextArea
            onChange={handlePostDataChange}
            style={{
              maxHeight: "400px",
              height: "100px",
            }}
            placeholder="Content..."
            className="user-invalid:border-red-600"
            name="content"
            id="content"
            required
          />
        </div>
        <div className="my-4">
          <label
            htmlFor="files"
            className="optional-label tracking-wide font-medium"
          >
            Files
          </label>
          <UploadedImagesStrip
            images={postData.images}
            handleDeleteImage={handleDeleteImage}
          />
          <FileUploader
            accept="image/*"
            bucketName="images"
            id="files"
            disabled={isUploading}
            upload={upload}
            onSuccess={onUploadingImagesSuccess}
            allowMultiple={true}
            className="flex hover:bg-neutral-900 text-neutral-400 disabled:brightness-50 flex-col gap-1 justify-center items-center min-h-40  w-full rounded-lg bg-neutral-950 border border-dashed border-neutral-800"
          >
            <Upload size={30} />
            {isUploading ? (
              <p>Uploading...</p>
            ) : (
              <p>Append Images to the post</p>
            )}
          </FileUploader>
        </div>
        <div className="my-4">
          <Checkbox
            onChange={(e) =>
              setPostData((prev) => ({
                ...prev,
                type: e.target.checked ? "STORY" : "FEED",
              }))
            }
            name="type"
            label="Post as a story."
          />
        </div>
        <Button className="mt-6" disabled={isCreatingPostPending} type="submit">
          {isCreatingPostPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </SectionWrapper>
  );
}
