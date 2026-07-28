import { useRef, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { usePostImages } from "../../../../contexts/PostImagesContext";
import { X } from "lucide-react";

export function PostImagesPreviewLayer({
  images,
}: {
  images: string[];
}): JSX.Element | null {
  if (images.length === 0) return null;

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { handleImagesUrlsChange } = usePostImages();
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;

    const index = Math.round(scrollTop / clientHeight);
    setActiveIndex(index);
  };

  const scrollToImage = (index: number) => {
    if (!containerRef.current) return;
    const clientHeight = containerRef.current.clientHeight;

    containerRef.current.scrollTo({
      top: index * clientHeight,
      behavior: "smooth",
    });
  };
  return (
    <div
      onScroll={handleScroll}
      ref={containerRef}
      className="fixed inset-0 z-1000 bg-black/80 flex justify-center items-start overflow-y-auto p-4 snap-y snap-mandatory"
    >
      <button
        onClick={() => handleImagesUrlsChange([])}
        className="fixed z-2 md:top-4 md:right-6 top-4 right-3 mx-auto px-4 py-1.5 bg-white/20 text-white rounded-full disabled:opacity-30 hover:bg-white/40 transition-all font-bold"
      >
        <X size={24} />
      </button>
      <button
        onClick={() => scrollToImage(activeIndex - 1)}
        disabled={activeIndex === 0}
        className="fixed z-2 top-4 mx-auto px-4 py-1.5 bg-white/20 text-white rounded-full disabled:opacity-30 hover:bg-white/40 transition-all font-bold"
      >
        ↑ Previous
      </button>
      <div className="w-full max-w-3xl flex flex-col gap-4 py-8">
        {images.map((image, index) => {
          return (
            <div key={index} className="w-full h-[90vh] shrink-0 snap-center">
              <img
                src={image}
                alt="post image"
                className="w-full h-full object-contain"
              />
            </div>
          );
        })}
      </div>
      <button
        onClick={() => scrollToImage(activeIndex + 1)}
        disabled={activeIndex === images.length - 1}
        className="fixed bottom-4 mx-auto z-2 px-4 py-1.5 bg-white/20 text-white rounded-full disabled:opacity-30 hover:bg-white/40 transition-all font-bold"
      >
        ↓ Next
      </button>
    </div>
  );
}
