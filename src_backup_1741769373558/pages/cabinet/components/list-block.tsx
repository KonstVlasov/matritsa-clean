import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import styles from './list-block.m.css';

export interface ListBlockProps extends HTMLAttributes<HTMLDivElement> {}

export function ListBlock({ className, children, ...restProps }: ListBlockProps) {
  const rootClassName = classNames(
    //
    styles.root,
    className,
  );

  return (
    <div className={rootClassName} {...restProps}>
      {children}
    </div>
  );
}

export interface ListBlockItemProps extends HTMLAttributes<HTMLDivElement> {}

export function ListBlockItem({ className, children, ...restProps }: ListBlockItemProps) {
  const rootClassName = classNames(
    //
    styles.item,
    className,
  );

  return (
    <div className={rootClassName} {...restProps}>
      {children}
    </div>
  );
}
