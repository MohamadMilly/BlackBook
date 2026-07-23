import { useEffect, useState } from "react";

export function useDebounce(value: any, duration: number = 500) {
  const [debounced, setDebounced] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, duration);

    return () => clearTimeout(timer);
  }, [value]);

  return debounced;
}
