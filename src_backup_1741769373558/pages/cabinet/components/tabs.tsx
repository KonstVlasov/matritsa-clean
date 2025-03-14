import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import styles from './tabs.m.css';

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {}

export interface TabProps extends HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
}

export function Tabs({ className, children, ...restProps }: TabsProps) {
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

export function Tab({ checked, className, children, ...restProps }: TabProps) {
  const rootClassName = classNames(
    //
    styles.tab,
    checked && styles.tabChecked,
    className,
  );

  return (
    <div className={rootClassName} {...restProps}>
      {children}
    </div>
  );
}
