import { Eye } from "lucide-react";
import { useWatchPost } from "../../../../hooks/api/posts/useWatchPost";
import { VisibilityTrigger } from "../../../shared/utils/VisibilityTrigger";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY } from "../../../../hooks/utils/useWatchedPosts";

export function PostViews({
  views,
  postId,
}: {
  views: number;
  postId: number;
}) {
  const queryClient = useQueryClient();
   
  const { mutate: Watch, isPending, error } = useWatchPost();
  
  const handleWatch = () => {
    queryClient.setQueryData(CACHE_KEY, (old: number[] = []) => {
      if (old.includes(postId)) return old;

      Watch({ postId });

      return [...old, postId];
    });
  };
  return (
    <VisibilityTrigger
      onVisible={handleWatch}
      isActive={!isPending}
      duration={8000}
    >
      <div className="flex justify-between items-center text-xs border-y border-neutral-800 py-1 text-neutral-400">
        <span>Views</span>
        <div className="flex items-center gap-1">
          <span>{views}</span>
          <Eye size={18} />
        </div>
      </div>
    </VisibilityTrigger>
  );
}
