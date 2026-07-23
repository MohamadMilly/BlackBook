import { useEffect, useRef } from "react";

type TriggerFetchProps = {
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
};

export function TriggerFetch({
  fetchNextPage,
  isFetchingNextPage,
}: TriggerFetchProps) {
  const triggerElRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const triggerEl = triggerElRef.current;
    const observer = new IntersectionObserver((entries) => {
      const triggerEl = entries[0];
      if (triggerEl && triggerEl.isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    if (triggerEl) {
      observer.observe(triggerEl);
    }
  });
  return <div ref={triggerElRef} className="h-5 bg-transparent"></div>;
}
