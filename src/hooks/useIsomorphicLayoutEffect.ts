import { useEffect, useLayoutEffect } from 'react';

// Fix for useLayoutEffect SSR warning
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;

