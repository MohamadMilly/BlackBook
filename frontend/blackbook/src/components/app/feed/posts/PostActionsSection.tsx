import { useCallback } from "react";
import { useLikePost } from "../../../../hooks/api/likes/useLikePost";
import { MessageCircleMore, ThumbsUp } from "lucide-react";
import { Button } from "../../../shared/ui/Button";
import { useSearchParams } from "react-router";

export function PostActionControls({
  postId,
  isCurrentUserLiking,
  likesCount,
  commentsCount,
}: {
  postId: number;
  isCurrentUserLiking: boolean;
  likesCount: number;
  commentsCount: number;
}) {
  const { mutate: toggleLike } = useLikePost();
  const [searchParams, setSearchParams] = useSearchParams();
  const handleToggleLike = useCallback(() => {
    toggleLike({
      postId: postId,
    });
  }, [postId]);

  const handleOpenComments = () => {
    searchParams.set("commentsFor", String(postId));
    setSearchParams(searchParams);
  };
  return (
    <div className="flex items-center border border-neutral-800 rounded-lg  divide-x divide-neutral-800 mt-2">
      <Button
        onClick={handleToggleLike}
        className={`basis-1/2 rounded-r-none flex items-center gap-1 ${isCurrentUserLiking ? "bg-blue-600!" : ""}`}
      >
        <ThumbsUp fill={isCurrentUserLiking ? "white" : "none"} size={25} />{" "}
        Like ( {likesCount} )
      </Button>
      <Button
        onClick={handleOpenComments}
        className="basis-1/2 rounded-l-none flex items-center gap-1"
      >
        <span>
          <MessageCircleMore size={25} />
        </span>
        Comments ( {commentsCount} )
      </Button>
    </div>
  );
}
