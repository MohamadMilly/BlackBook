import { useState, type ChangeEvent, type JSX, type SubmitEvent } from "react";
import { Button } from "../../../shared/ui/Button";
import { TextArea } from "../../../shared/ui/TextArea";
import { useCreateComment } from "../../../../hooks/api/comments/useCreateComment";

export function CreateCommentForm({
  postId,
}: {
  postId: number | null;
}): JSX.Element {
  const [commentData, setCommentData] = useState<{ text: string }>({
    text: "",
  });
  const { mutate: createComment, isPending: isCommentPending } =
    useCreateComment();
  const handleCommentDataChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCommentData((prev) => ({ ...prev, [name]: value }));
  };
  const onSubmitComment = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (postId) {
      createComment({ postId, ...commentData });
      setCommentData({ text: "" });
    }
  };
  return (
    <form onSubmit={onSubmitComment} className="mt-auto shrink-0" method="POST">
      <div>
        <TextArea
          style={{
            maxHeight: "150px",
          }}
          placeholder="Your comment..."
          name="text"
          id="text"
          onChange={handleCommentDataChange}
          required
          value={commentData.text}
        />
      </div>
      <Button
        disabled={!commentData.text || isCommentPending}
        className="text-sm"
      >
        {isCommentPending ? "Publishing..." : "Publish"}
      </Button>
    </form>
  );
}
