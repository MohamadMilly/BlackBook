import { createContext, useContext } from "react";

type PostImagesContextType = {
  previewImagesUrls: string[];
  handleImagesUrlsChange: (newImagesUrls: string[]) => void;
};

export const PostImagesContext = createContext<PostImagesContextType | null>(
  null,
);

export const usePostImages = () => {
  const contextValue = useContext(PostImagesContext);

  if (!contextValue) {
    throw new Error("Post images context should be used inside its provider.");
  }

  return contextValue;
};
