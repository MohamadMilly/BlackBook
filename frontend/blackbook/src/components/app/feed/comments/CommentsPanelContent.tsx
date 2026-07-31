import { X } from "lucide-react";
import { usePostComments } from "../../../../hooks/api/comments/usePostComments";
import { Button } from "../../../shared/ui/Button";
import { CommentsList } from "./CommentsList";
import { CreateCommentForm } from "./CreateCommentForm";
import { useSearchParams } from "react-router";

export function CommentsPanelContent({ postId }: { postId: number | null }) {
  const { comments, isLoading, error } = usePostComments(postId);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCloseComments = () => {
    searchParams.delete("commentsFor");
    setSearchParams(searchParams);
  };
  return (
    <div className="flex flex-col h-full" aria-label="Post comments">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h4 className="text-xl mb-0!">Comments</h4>
        <Button onClick={handleCloseComments}>
          <X size={18} />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-custom">
        <CommentsList comments={comments} isLoading={isLoading} error={error} />
      </div>
      <CreateCommentForm postId={postId} />
    </div>
  );
}
