import { useIsomorphicLayoutEffect } from '@krutoo/utils';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock-upgrade';
import classNames from 'classnames';
import { HTMLAttributes, useRef } from 'react';
import CrossSVG from '#icons/cross.svg';
import { useExactClick } from '#shared/react';
import styles from './modal.m.css';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  onDismiss?: VoidFunction;
}

export function Modal({ onDismiss, children, className, ...restProps }: ModalProps) {
  const overlayClickProps = useExactClick(onDismiss);
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    disableBodyScroll(element, { reserveScrollBarGap: true });

    return () => {
      enableBodyScroll(element);
    };
  }, []);

  return (
    <div ref={ref} className={styles.overlay} {...overlayClickProps}>
      <div className={classNames(styles.modal, className)} {...restProps}>
        <div role='button' className={styles.close} onClick={() => onDismiss?.()}>
          <CrossSVG />
        </div>
        {children}
      </div>
    </div>
  );
}
