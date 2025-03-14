import classNames from 'classnames';
import { type AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { Logo } from '#components/logo';
import DownSVG from '#icons/down.svg';
import styles from './page-header.m.css';

export interface PageHeaderProps extends HTMLAttributes<HTMLElement> {
  endContent?: ReactNode;
}

export function PageHeader({ children, endContent, className, ...restProps }: PageHeaderProps) {
  return (
    <header className={classNames(styles.header, className)} {...restProps}>
      <a href='/' className={styles.link}>
        <Logo />
      </a>

      <div className={styles.menu}>{children}</div>

      {endContent}
    </header>
  );
}

export function MenuItem({ children, className, ...restProps }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={classNames(styles.MenuItem, className)} {...restProps}>
      {children}
    </div>
  );
}

export function MenuItemBody({
  href,
  children,
  endIcon,
  onClick,
  className,
  ...restProps
}: AnchorHTMLAttributes<HTMLAnchorElement> & { endIcon?: 'down' }) {
  return (
    <a
      href={href}
      className={classNames(styles.MenuItemBody, className)}
      {...restProps}
      onClick={event => {
        onClick?.(event);
      }}
    >
      <span className={styles.menuItemBodyInner}>
        {children}
        {endIcon === 'down' && <DownSVG className={styles.bodyIcon} />}
      </span>
    </a>
  );
}

export function MenuItemDropdown({
  children,
  className,
  ...restProps
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={classNames(styles.MenuItemDropdown, className)} {...restProps}>
      <div className={styles.dropdownInner}>{children}</div>
    </div>
  );
}

export function DropdownItem({
  children,
  className,
  onClick,
  ...restProps
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={classNames(styles.DropdownItem, className)}
      {...restProps}
      onClick={event => {
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
