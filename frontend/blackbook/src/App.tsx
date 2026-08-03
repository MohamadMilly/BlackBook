import { Navigate, Outlet, useSearchParams } from "react-router";
import { SideBar } from "./components/app/layout/SideBar";
import { Header } from "./components/app/layout/Header";
import { useAuth } from "./contexts/authContext";
import { InlinePanel } from "./components/shared/ui/InlinePanel";
import { useCallback, useMemo, useState } from "react";
import { CommentsPanelContent } from "./components/app/feed/comments/CommentsPanelContent";
import { PostImagesContext } from "./contexts/PostImagesContext";
import { PostImagesPreviewLayer } from "./components/app/feed/posts/PostImagesPreviewLayer";
import { Story } from "./components/app/story/Story";
import { ToastNotificationsList } from "./components/shared/ui/ToastNotificationList";

function App() {
  const { user } = useAuth();

  const [previewImagesUrls, setPreviewImagesUrls] = useState<string[]>([]); // if the images are too much you should fetch them independently okay !

  // when the pathname location changes close the panel

  const [searchParams] = useSearchParams();
  const currentPostId = Number(searchParams.get("commentsFor"));
  const currentStoryId = Number(searchParams.get("storyId"));

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

  if (!user) {
    return <Navigate to={"/"} replace={true} />;
  }

  return (
    <PostImagesContext value={PostImagesContextValue}>
      <div className="grid grid-cols-1 grid-rows-[50px_1fr_60px] md:grid-cols-[auto_1fr_auto] md:grid-rows-[50px_1fr] h-full">
        <SideBar />
        <Header />
        <Outlet />
        <InlinePanel
          isOpen={!!currentPostId}
          float={currentStoryId ? true : false}
        >
          {/* Reset the state by changing keys */}
          <CommentsPanelContent
            key={currentPostId ?? 0}
            postId={currentPostId}
          />
        </InlinePanel>
        <PostImagesPreviewLayer images={previewImagesUrls} />
        <Story storyId={currentStoryId} durationSecs={20} />
        <ToastNotificationsList />
      </div>
    </PostImagesContext>
  );
}

export default App;
