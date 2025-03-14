import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import styles from './page-root.m.css';

export interface PageRootProps extends HTMLAttributes<HTMLDivElement> {
  display?: 'flexColumn';
}

export function PageRoot({ display, children, className, ...restProps }: PageRootProps) {
  const rootClassName = classNames(
    styles.root,
    display === 'flexColumn' && styles.flexColumn,
    className,
  );

  return (
    <div className={rootClassName} {...restProps}>
      {children}
    </div>
  );
}
