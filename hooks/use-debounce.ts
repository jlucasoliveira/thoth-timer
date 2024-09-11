import { useRef } from 'react';

type Fn<P = void, R = void> = (params: P) => R;

export function useDebounce<T, R>(fn: Fn<T, R>, delay = 100) {
  const timeoutRef = useRef<NodeJS.Timeout | null>();

  function debouncedFn(params: T) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => fn(params), delay);
  }

  return debouncedFn;
}
