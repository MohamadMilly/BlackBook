import { Navigate, Outlet, useLocation } from "react-router";
import { SideBar } from "./components/app/layout/SideBar";
import { Header } from "./components/app/layout/Header";
import { useAuth } from "./contexts/authContext";
import { InlinePanel } from "./components/shared/ui/InlinePanel";
import { useCommentsPanel } from "./contexts/commentsPanelContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CommentsPanelContent } from "./components/app/feed/comments/CommentsPanelContent";
import { PostImagesContext } from "./contexts/PostImagesContext";
import { PostImagesPreviewLayer } from "./components/app/feed/posts/PostImagesPreviewLayer";

function App() {
  const { user } = useAuth();
  const { postId, handlePostIdChange } = useCommentsPanel();
  const location = useLocation();
  const [previewImagesUrls, setPreviewImagesUrls] = useState<string[]>([]); // if the images are too much you should fetch them independently okay !
   
  // when the pathname location changes close the panel
  useEffect(() => {
    handlePostIdChange(null);
  }, [location.pathname]);

  if (!user) {
    return <Navigate to={"/"} replace={true} />;
  }

  const handleImagesUrlsChange = useCallback((newImagesUrls: string[]) => {
    setPreviewImagesUrls(newImagesUrls);
  }, []);

  const PostImagesContextValue = useMemo(
    () => ({
      handleImagesUrlsChange,
      previewImagesUrls,
    }),
    [handleImagesUrlsChange, previewImagesUrls],
  );
  return (
    <PostImagesContext value={PostImagesContextValue}>
      <div className="grid grid-cols-1 grid-rows-[50px_1fr_60px] md:grid-cols-[auto_1fr_auto] md:grid-rows-[50px_1fr] h-full">
        <SideBar />
        <Header />
        <Outlet />
        <InlinePanel isOpen={!!postId}>
          {" "}
          {/* Reset the state by changing keys */}
          <CommentsPanelContent key={postId ?? 0} postId={postId} />
        </InlinePanel>
        <PostImagesPreviewLayer images={previewImagesUrls} />
      </div>
    </PostImagesContext>
  );
}

export default App;
