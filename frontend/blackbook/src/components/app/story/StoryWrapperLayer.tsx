import type { ReactNode } from "react";

export function StoryWrapperLayer({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/80 p-0 sm:p-4 backdrop-blur-sm">
      {children}
    </div>
  );
}
