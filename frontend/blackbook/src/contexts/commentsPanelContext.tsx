import { createContext, useContext } from "react";

type CommentsPanelContextType = {
  postId: number | null;
  handlePostIdChange: (newPostId: number | null) => void;
};

export const CommentsPanelContext =
  createContext<CommentsPanelContextType | null>(null);

export const useCommentsPanel = () => {
  const contextValue = useContext(CommentsPanelContext);

  if (!contextValue) {
    throw new Error(
      "Comments Panel context should be used inside its provider.",
    );
  }

  return contextValue;
};
