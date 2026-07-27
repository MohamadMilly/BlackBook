import { useCallback, useState, type ReactNode } from "react";
import { CommentsPanelContext } from "../contexts/commentsPanelContext";

export function CommentsPanelContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [postId, setPostId] = useState<number | null>(null);
  const handlePostIdChange = useCallback((newPostId: number | null) => {
    setPostId(newPostId);
  }, []);

  return (
    <CommentsPanelContext value={{ postId, handlePostIdChange }}>
      {children}
    </CommentsPanelContext>
  );
}
