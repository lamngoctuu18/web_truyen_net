import { useEffect, useRef, useState } from 'react';

export interface UseIntersectionObserverProps {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/**
 * Hook for Intersection Observer API - useful for lazy loading images
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverProps = {}
) {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '50px',
    freezeOnceVisible = false,
  } = options;

  const elementRef = useRef<HTMLDivElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // If frozen and already visible, don't create new observer
    if (freezeOnceVisible && isIntersecting) return;

    observer.current = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);

        // If freezeOnceVisible is true and element became visible, disconnect observer
        if (freezeOnceVisible && isVisible && observer.current) {
          observer.current.disconnect();
        }
      },
      { threshold, root, rootMargin }
    );

    observer.current.observe(element);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [threshold, root, rootMargin, freezeOnceVisible, isIntersecting]);

  return { ref: elementRef, isIntersecting };
}

/**
 * Hook for lazy loading images with intersection observer
 */
export function useLazyImage(src: string, placeholder?: string) {
  const { ref: imgRef, isIntersecting: isVisible } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  const imageSrc = isVisible ? src : placeholder || '';
  
  return {
    imgRef,
    src: imageSrc,
    isVisible,
    isLoaded: isVisible,
  };
}

/**
 * Hook for infinite scrolling
 */
export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean = true,
  rootMargin: string = '100px'
) {
  const { ref: triggerRef, isIntersecting: isVisible } = useIntersectionObserver({
    threshold: 0,
    rootMargin,
  });

  useEffect(() => {
    if (isVisible && hasMore) {
      callback();
    }
  }, [isVisible, hasMore, callback]);

  return triggerRef;
}