import { useMemo, useState, type ChangeEvent, type SubmitEvent } from "react";
import { SectionWrapper } from "../../components/app/layout/SectionWrapper";
import { Input } from "../../components/shared/ui/Input";
import { TextArea } from "../../components/shared/ui/TextArea";
import { Button } from "../../components/shared/ui/Button";
import type { CreatePostRequestBody, ResponseError } from "@app/types";
import { useCreatePost } from "../../hooks/api/posts/useCreatePost";
import { useMarkFieldsInValid } from "../../hooks/utils/useMarkFieldsInvalid";
import { useNavigate } from "react-router";
import { getServerAndValidationErrors } from "../../shared/utils/getServerAndValidationError";
import { ErrorsList } from "../../components/form/ErrorsList";

export function NewPostPage() {
  const [postData, setPostData] = useState<CreatePostRequestBody>({
    title: "",
    content: "",
    images: [],
  });
  const navigate = useNavigate();
  const {
    mutate: createPost,
    isPending: isCreatingPostPending,
    error: postCreationError,
  } = useCreatePost();

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
    createPost(postData, {
      onSuccess: () => {
        navigate("/app/feed");
      },
    });
  };
  return (
    <SectionWrapper title="New Post">
      <form onSubmit={handleSubmit} method="POST">
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
        <Button disabled={isCreatingPostPending} type="submit">
          {isCreatingPostPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </SectionWrapper>
  );
}
