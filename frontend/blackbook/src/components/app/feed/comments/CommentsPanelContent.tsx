import { X } from "lucide-react";
import { useCommentsPanel } from "../../../../contexts/commentsPanelContext";
import { usePostComments } from "../../../../hooks/api/comments/usePostComments";
import { Button } from "../../../shared/ui/Button";
import { CommentsList } from "./CommentsList";
import { TextArea } from "../../../shared/ui/TextArea";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useCreateComment } from "../../../../hooks/api/comments/useCreateComment";

export function CommentsPanelContent({ postId }: { postId: number | null }) {
  const [commentData, setCommentData] = useState<{ text: string }>({
    text: "",
  });
  const {
    mutate: createComment,
    isPending: isCommentPending,
    error: commentError,
  } = useCreateComment();
  const handleCommentDataChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCommentData((prev) => ({ ...prev, [name]: value }));
  };
  const onSubmitComment = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (postId) {
      createComment({ postId, ...commentData });
    }
  };
  const { comments, isLoading, error } = usePostComments(postId);
  const { handlePostIdChange } = useCommentsPanel();
  return (
    <div className="flex flex-col h-full" aria-label="Post comments">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h4 className="text-xl mb-0!">Comments</h4>
        <Button onClick={() => handlePostIdChange(null)}>
          <X size={18} />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-custom">
        <CommentsList comments={comments} isLoading={isLoading} error={error} />
      </div>
      <form
        onSubmit={onSubmitComment}
        className="mt-auto shrink-0"
        method="POST"
      >
        <div>
          <TextArea
            style={{
              maxHeight: "150px",
            }}
            placeholder="Your comment..."
            name="text"
            id="text"
            onChange={handleCommentDataChange}
          />
        </div>
        <Button
          disabled={!commentData.text || isCommentPending}
          className="text-sm"
        >
          {isCommentPending ? "Publishing..." : "Publish"}
        </Button>
      </form>
    </div>
  );
}
