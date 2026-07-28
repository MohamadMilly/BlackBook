import { X } from "lucide-react";

type UploadedImagesStripProps = {
  images: string[];
  handleDeleteImage: (imageUrl: string) => void;
};

export function UploadedImagesStrip({
  images,
  handleDeleteImage,
}: UploadedImagesStripProps) {
  if (images.length === 0) return null;

  return (
    <div className="flex gap-1 my-2 p-2 bg-neutral-950 rounded-lg overflow-x-auto">
      {images.map((image) => {
        return (
          <div
            key={image}
            className="relative w-25 h-25 rounded-lg overflow-hidden shrink-0"
          >
            <img
              src={image}
              alt="post image"
              className="object-cover w-full h-full"
            />
            <button
              onClick={() => handleDeleteImage(image)}
              type="button"
              className="absolute top-1 right-1 w-6 h-6 rounded-full flex justify-center items-center text-red-600  cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
