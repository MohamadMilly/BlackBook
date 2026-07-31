import type { JSX } from "react/jsx-runtime";
import {
  gridLayouts,
  imagesLayouts,
} from "../../../../shared/constants/postsImagesLayout";

type PostImagesGridProps = {
  images: string[];
  handleImagesUrlsChange: (newImagesUrls: string[]) => void;
};

export function PostImagesGrid({
  images,
  handleImagesUrlsChange,
}: PostImagesGridProps): JSX.Element | null {
  if (images.length === 0) return null;

  const gridLayoutIndex = images.length >= 5 ? 5 : images.length;
  const remainingImages = images.length - gridLayoutIndex;
  const gridLayoutClassName = gridLayouts[gridLayoutIndex];

  return (
    <button
      onClick={() => handleImagesUrlsChange(images)}
      className={`h-75 ${gridLayoutClassName} block w-full cursor-pointer`}
    >
      {images.slice(0, 5).map((image, index) => {
        return (
          <div
            key={image} // image url as a key :)
            className={`${imagesLayouts[gridLayoutIndex][index + 1]} rounded overflow-hidden`}
          >
            <img
              src={image}
              alt="post image"
              className={`object-cover w-full h-full`}
            />
            {index === 4 && remainingImages !== 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-lg font-semibold">
                  +{remainingImages}{" "}
                  <span className="sr-only md:not-sr-only">More</span>
                </span>
              </div>
            )}
          </div>
        );
      })}
    </button>
  );
}
