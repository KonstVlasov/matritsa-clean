import { useIsomorphicLayoutEffect } from '@krutoo/utils';
import { MouseEventHandler, ReactNode, useCallback, useEffect, useRef } from 'react';

export function useExactClick<T = Element>(
  onExactClick: VoidFunction | undefined,
  {
    onMouseDown,
    onMouseUp,
  }: {
    onMouseDown?: MouseEventHandler<T>;
    onMouseUp?: MouseEventHandler<T>;
  } = {},
): {
  onMouseDown?: MouseEventHandler<T>;
  onMouseUp?: MouseEventHandler<T>;
} {
  const callbackRef = useRef(onExactClick);

  callbackRef.current = onExactClick;

  const mouseDownTarget = useRef<EventTarget | null>(null);

  const handleMouseDown = useCallback<MouseEventHandler<T>>(
    event => {
      onMouseDown?.(event);

      mouseDownTarget.current = event.target;
    },
    [onMouseDown],
  );

  const handleMouseUp = useCallback<MouseEventHandler<T>>(
    event => {
      const fn = callbackRef.current;

      onMouseUp?.(event);

      if (
        fn &&
        event.target === event.currentTarget &&
        event.currentTarget === mouseDownTarget.current
      ) {
        fn();
      }
    },
    [onMouseUp],
  );

  return {
    onMouseUp: handleMouseUp,
    onMouseDown: handleMouseDown,
  };
}

export function useGlobalKeydown(code: string, callback: VoidFunction) {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  useEffect(() => {
    const maybeClose = (event: KeyboardEvent) => {
      if (event.code !== code) {
        return;
      }

      callbackRef.current();
    };

    window.addEventListener('keydown', maybeClose);

    return () => {
      window.removeEventListener('keydown', maybeClose);
    };
  }, [code]);
}

export function LifeCycle({
  children,
  onMount,
  onUnmount,
  onMountSync,
  onUnmountSync,
}: {
  children?: ReactNode;
  onMount?: VoidFunction;
  onUnmount?: VoidFunction;
  onMountSync?: VoidFunction;
  onUnmountSync?: VoidFunction;
}) {
  const onMountRef = useRef(onMount);
  const onUnmountRef = useRef(onUnmount);

  useEffect(() => {
    onMountRef.current?.();

    const cleanup = onUnmountRef.current;

    return () => {
      cleanup?.();
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    onMountSync?.();

    return () => {
      onUnmountSync?.();
    };
  }, []);

  return <>{children}</>;
}
