import classNames from 'classnames';
import { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes } from 'react';
import ArrowSVG from '#icons/arrow.svg';
import styles from './button.m.css';

export interface ButtonCommonProps {
  color?: '#6280fe' | '#a2b4ff' | '#242a49' | '#e6e8f0' | '#fff' | 'unset';
  coloring?: 'fill' | 'outline';
  endIcon?: 'arrow';
  size?: 36 | 40 | 52 | 56 | 'unset';
}

export interface ButtonAsButtonProps
  extends ButtonCommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  as?: 'button';
}

export interface ButtonAsAnchorProps
  extends ButtonCommonProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
  as: 'anchor';
}

export interface ButtonAsSpanProps
  extends ButtonCommonProps,
    Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  as: 'span';
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps | ButtonAsSpanProps;

export function Button({
  size = 40,
  color: color = '#6280fe',
  coloring = 'fill',
  children,
  className,
  endIcon,
  ...restProps
}: ButtonProps) {
  const rootClassName = classNames(
    styles.button,
    size === 36 && styles['size36'],
    size === 40 && styles['size40'],
    size === 52 && styles['size52'],
    size === 56 && styles['size56'],
    color === '#6280fe' && styles['color-6280fe'],
    color === '#a2b4ff' && styles['color-a2b4ff'],
    color === '#242a49' && styles['color-242a49'],
    color === '#e6e8f0' && styles['color-e6e8f0'],
    color === '#fff' && styles['color-fff'],
    coloring === 'fill' && styles['coloring-fill'],
    coloring === 'outline' && styles['coloring-outline'],
    className,
  );

  if (restProps.as === 'anchor') {
    const props = omitAsProp(restProps);

    return (
      <a className={rootClassName} {...props}>
        {children}
        {endIcon === 'arrow' && <ArrowSVG className={styles.icon} />}
      </a>
    );
  }

  if (restProps.as === 'span') {
    const props = omitAsProp(restProps);

    return (
      <span className={rootClassName} {...props}>
        {children}
        {endIcon === 'arrow' && <ArrowSVG className={styles.icon} />}
      </span>
    );
  }

  const props = omitAsProp(restProps);

  return (
    <button type={restProps.type ?? 'button'} className={rootClassName} {...props}>
      {children}
      {endIcon === 'arrow' && <ArrowSVG className={styles.icon} />}
    </button>
  );
}

function omitAsProp<T extends { as?: unknown }>(props: T): Omit<T, 'as'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { as, ...omitted } = props;

  return omitted;
}
