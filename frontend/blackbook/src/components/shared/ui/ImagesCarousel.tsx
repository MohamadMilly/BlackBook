import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";

type ImagesCarouselProps = {
  images: string[];
  direction: "horizontal" | "vertical";
  className?: string;
};
export function ImagesCarousel({
  images,
  direction = "horizontal",
  className = "",
}: ImagesCarouselProps) {
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  const imagesCount = images.length;
  const handleScroll = () => {
    if (!imagesContainerRef.current || isScrollingRef.current) return;
    const { scrollLeft, clientHeight } = imagesContainerRef.current;

    const index = Math.round(scrollLeft / clientHeight);
    setActiveIndex(index);
  };

  const scrollToImage = (index: number) => {
    if (!imagesContainerRef.current) return;
    const clientHeight = imagesContainerRef.current.clientWidth;
    isScrollingRef.current = true;
    imagesContainerRef.current.scrollTo({
      left: index * clientHeight,
      behavior: "smooth",
    });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 350);
  };

  return (
    <div
      onScroll={handleScroll}
      ref={imagesContainerRef}
      className={`w-full flex bg-black overflow-x-auto snap-mandatory snap-x scrollbar-none ${className} `}
    >
      {" "}
      {imagesCount > 1 && (
        <button
          onClick={() => scrollToImage(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="fixed z-100 left-0 mx-auto top-1/2 -translate-y-1/2 px-4 py-1.5 bg-white/20 text-white rounded-full disabled:opacity-30 hover:bg-white/40 transition-all font-bold"
        >
          <ArrowLeft size={18} />
        </button>
      )}
      {images.map((image, index) => {
        return (
          <img
            key={index}
            className="h-full min-w-full shrink-0 basis-full w-full snap-center object-contain"
            src={image}
            alt="Story content"
          />
        );
      })}
      {imagesCount > 1 && (
        <button
          onClick={() => scrollToImage(activeIndex + 1)}
          disabled={activeIndex === images.length - 1}
          className="fixed z-100 right-0 mx-auto top-1/2 -translate-y-1/2 px-4 py-1.5 bg-white/20 text-white rounded-full disabled:opacity-30 hover:bg-white/40 transition-all font-bold"
        >
          <ArrowRight size={18} />
        </button>
      )}
    </div>
  );
}
