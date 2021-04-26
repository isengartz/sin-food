import { useEffect, useRef } from 'react';

/**
 * Hook that only re-renders on deps updates and not on initial mount
 * @param effect
 * @param deps
 */
export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (!isFirstMount.current) effect();
    else isFirstMount.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
