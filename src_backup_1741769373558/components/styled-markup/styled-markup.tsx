import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import styles from './styled-markup.m.css';

export function StyledMarkup({
  children,
  className,
  ...restProps
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={classNames(styles.root, className)} {...restProps}>
      {children}
    </div>
  );
}
