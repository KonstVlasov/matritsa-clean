import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom';
import { useIsomorphicLayoutEffect, useMergeRefs } from '@krutoo/utils';
import classNames from 'classnames';
import { HTMLAttributes, Ref, useEffect, useRef, useState } from 'react';
import DownSVG from '#icons/down.svg';
import styles from './select.m.css';

export interface SelectMenuProps extends HTMLAttributes<HTMLDivElement> {
  rootRef?: Ref<HTMLDivElement>;
}

export interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
}

export interface SelectProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  options?: Array<MenuItemProps>;
  onValueChange?: (value: string) => void;
}

export function Select({
  value,
  defaultValue,
  onValueChange,
  options = [],
  onClick,
  children,
  className,
  ...restProps
}: SelectProps) {
  const [currentValue, setCurrentValue] = useState(value ?? defaultValue ?? '');
  const [open, setOpen] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setCurrentValue(value ?? '');
  }, [value]);

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    strategy: 'absolute',
    open,
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const openerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const openerMergedRef = useMergeRefs<HTMLDivElement>([openerRef, refs.setReference]);
  const menuMergedRef = useMergeRefs<HTMLDivElement>([menuRef, refs.setFloating]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const opener = openerRef.current;
    const menu = menuRef.current;

    if (!opener || !menu) {
      return;
    }

    const maybeClose = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        if (opener.contains(event.target)) {
          return;
        }

        if (menu.contains(event.target)) {
          return;
        }

        setOpen(false);
      }
    };

    window.addEventListener('mousedown', maybeClose);

    return () => {
      window.removeEventListener('mousedown', maybeClose);
    };
  }, [open]);

  return (
    <>
      <div
        ref={openerMergedRef}
        {...restProps}
        className={classNames(styles.opener, open && styles.menuOpen, className)}
        onClick={event => {
          onClick?.(event);
          setOpen(a => !a);
        }}
      >
        <div>{children}</div>
        <DownSVG className={styles.openerIcon} />
      </div>

      {open && (
        <SelectMenu rootRef={menuMergedRef} style={floatingStyles}>
          {options.map((optionProps, index) => (
            <MenuItem
              key={index}
              {...optionProps}
              onClick={event => {
                optionProps.onClick?.(event);
                const nextValue = optionProps.value ?? String(optionProps.children ?? '');

                setCurrentValue(nextValue);
                setOpen(false);

                if (currentValue !== nextValue) {
                  onValueChange?.(nextValue);
                }
              }}
            />
          ))}
        </SelectMenu>
      )}
    </>
  );
}

function SelectMenu({ rootRef, children, className, ...restProps }: SelectMenuProps) {
  return (
    <div ref={rootRef} className={classNames(styles.menu, className)} {...restProps}>
      {children}
    </div>
  );
}

function MenuItem({ className, children, ...restProps }: MenuItemProps) {
  return (
    <div {...restProps} className={classNames(styles.menuItem, className)}>
      {children}
    </div>
  );
}
