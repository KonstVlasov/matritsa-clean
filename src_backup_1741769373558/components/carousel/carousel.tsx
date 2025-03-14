import { clamp, useStableCallback } from '@krutoo/utils';
import { CSSProperties, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import styles from './carousel.m.css';

export interface CarouselProps {
  children?: ReactNode;
  targetIndex?: number;
  onTargetIndexChange?: (currentIndex: number) => void;
}

export function Carousel({ children, targetIndex }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [shift, setShift] = useState<number>(0);

  const style: CSSProperties = {
    transform: `translate3d(${shift}px, 0, 0)`,
  };

  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const move = useCallback(
    (step: number = 0) => {
      const root = rootRef.current;
      const container = containerRef.current;

      if (!root || !container) {
        return;
      }

      let nextIndex = currentIndex + step;

      if (nextIndex < 0) {
        nextIndex = 0;
      }

      if (nextIndex > container.children.length - 1) {
        nextIndex = container.children.length - 1;
      }

      const target = container.children[nextIndex];

      if (!target) {
        return;
      }

      const nextShift = -(
        target.getBoundingClientRect().left - container.getBoundingClientRect().left
      );

      const first = container.children[0];
      const last = container.children[container.children.length - 1];

      const containerWidth =
        first && last ? last.getBoundingClientRect().right - first.getBoundingClientRect().left : 0;

      const shiftLimit = -(containerWidth - root.getBoundingClientRect().width);

      if (nextShift >= shiftLimit) {
        setCurrentIndex(nextIndex);
        setShift(nextShift);
      } else {
        setShift(shiftLimit);
      }
    },
    [currentIndex],
  );

  const handleResize = useStableCallback(() => {
    const root = rootRef.current;
    const container = containerRef.current;

    if (!root || !container) {
      return;
    }

    const viewport = root.getBoundingClientRect();
    const overflow = viewport.width < container.scrollWidth;

    if (overflow) {
      move();
    } else {
      setCurrentIndex(0);
      setShift(0);
    }
  });

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    if (typeof targetIndex !== 'number') {
      return;
    }

    const nextIndex = clamp(targetIndex, 0, container.children.length);

    setCurrentIndex(nextIndex);
  }, [targetIndex]);

  useEffect(() => {
    const root = rootRef.current;
    const container = containerRef.current;

    if (!root || !container) {
      return;
    }

    const observer = new ResizeObserver(handleResize);

    observer.observe(root);

    return () => observer.disconnect();
  }, [handleResize]);

  useEffect(() => {
    move(0);
  }, [move, currentIndex]);

  return (
    <>
      <div ref={rootRef} className={styles.root}>
        <div ref={containerRef} className={styles.container} style={style}>
          {children}
        </div>
      </div>
    </>
  );
}
