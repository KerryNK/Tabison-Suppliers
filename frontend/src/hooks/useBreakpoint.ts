import { useEffect, useState } from 'react';

// Breakpoints matching Tailwind's default breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export type Breakpoint = keyof typeof breakpoints;

export const useBreakpoint = (breakpoint: Breakpoint) => {
  const [isAbove, setIsAbove] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsAbove(window.innerWidth >= breakpoints[breakpoint]);
    };

    // Check on mount and add listener
    checkSize();
    window.addEventListener('resize', checkSize);

    // Clean up
    return () => window.removeEventListener('resize', checkSize);
  }, [breakpoint]);

  return isAbove;
};

export const useIsMobile = () => {
  return !useBreakpoint('md');
};

// Helper for conditional classes based on breakpoint
export const getResponsiveClasses = (
  base: string,
  responsive: Partial<Record<Breakpoint, string>>
) => {
  return Object.entries(responsive).reduce(
    (acc, [breakpoint, classes]) => `${acc} ${breakpoint}:${classes}`,
    base
  );
};
