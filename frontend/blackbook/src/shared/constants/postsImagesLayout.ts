export const gridLayouts: Record<number, string> = {
  1: "grid grid-cols-1 grid-rows-1 gap-1",
  2: "grid grid-cols-2 grid-rows-1 gap-1",
  3: "grid grid-cols-2 grid-rows-2 gap-1", // Changed to 2x2 grid for standard layout
  4: "grid grid-cols-2 grid-rows-2 gap-1",
  5: "grid grid-cols-6 grid-rows-2 gap-1", // 5+ uses a 6-column grid for standard Facebook layout
};

export const imagesLayouts: Record<number, Record<number, string>> = {
  1: {
    1: "col-span-1 row-span-1 w-full h-full",
  },
  2: {
    1: "col-span-1 row-span-1 w-full h-full",
    2: "col-span-1 row-span-1 w-full h-full",
  },
  3: {
    1: "col-span-2 row-span-1 w-full h-full", // Big feature image on top
    2: "col-span-1 row-span-1 w-full h-full", // Left bottom image
    3: "col-span-1 row-span-1 w-full h-full", // Right bottom image
  },
  4: {
    1: "col-span-1 row-span-1 w-full h-full",
    2: "col-span-1 row-span-1 w-full h-full",
    3: "col-span-1 row-span-1 w-full h-full",
    4: "col-span-1 row-span-1 w-full h-full",
  },
  5: {
    1: "col-span-3 row-span-2 w-full h-full", // Left half big feature image
    2: "col-span-3 row-span-1 w-full h-full", // Right column top
    3: "col-span-1 row-span-1 w-full h-full", // Bottom row item 1
    4: "col-span-1 row-span-1 w-full h-full", // Bottom row item 2
    5: "col-span-1 row-span-1 w-full h-full relative", // Bottom row item 3 (The one that gets the +X overlay)
  },
};
