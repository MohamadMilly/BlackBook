/* the idea behind this hook is caching the seen posts ids in the current session (meaning the current site load) */

import { useQuery } from "@tanstack/react-query";
export const CACHE_KEY = ["sessionWatchedPosts"];

export function useWatchedPosts() {
  const { data: watchedIds = [] } = useQuery<number[]>({
    queryKey: CACHE_KEY,
    queryFn: () => [],
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return { watchedIds };
}
