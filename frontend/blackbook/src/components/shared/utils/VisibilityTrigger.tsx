import { useEffect, useRef, type ReactNode } from "react";

type VisibilityTriggerProps = {
  onVisible: () => void;
  isActive?: boolean;
  children?: ReactNode;
  duration?: number;
};

export function VisibilityTrigger({
  onVisible,
  isActive = true,
  children,
  duration = 0,
}: VisibilityTriggerProps) {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const element = triggerRef.current;
    if (!element || !isActive) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          const rect = entry.target.getBoundingClientRect();

          const isStillVisible =
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth;

          if (isStillVisible) {
            onVisible();
          }
        }, duration);
      }
    });

    observer.observe(element);
    return () => {
      observer.unobserve(element);
    };
  }, [onVisible, isActive]);

  const className = children ? "" : "h-5 w-full bg-transparent";

  return (
    <div ref={triggerRef} className={className}>
      {children}
    </div>
  );
}
