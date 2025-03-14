import classNames from 'classnames';
import {
  AnchorHTMLAttributes,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import { Button } from '#components/button';
import BurgerSVG from '#icons/burger.svg';
import CrossSVG from '#icons/cross.svg';
import { useExactClick } from '#shared/react';
import styles from './page-menu-bar.m.css';

export interface PageMenuBarProps extends HTMLAttributes<HTMLDivElement> {}

const MenuContext = createContext<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => {},
});

export function PageMenuBar({ children, className, ...restProps }: PageMenuBarProps) {
  const [open, setOpen] = useState(false);
  const overlayClickProps = useExactClick(() => setOpen(false));

  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <div className={classNames(styles.root, className)} {...restProps}>
        <Button color='#fff' className={styles.button} onClick={() => setOpen(true)}>
          <span>Меню</span>
          <BurgerSVG />
        </Button>

        {open && (
          <div className={styles.overlay} {...overlayClickProps}>
            <div className={styles.curtain}>
              <div className={styles.curtainBody}>{children}</div>
              <div className={styles.curtainFooter}>
                <Button color='#e6e8f0' className={styles.button} onClick={() => setOpen(false)}>
                  <span>Закрыть</span>
                  <CrossSVG />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MenuContext.Provider>
  );
}

export function MenuBarItem({
  className,
  children,
  onClick,
  ...restProps
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { setOpen } = useContext(MenuContext);

  return (
    <a
      {...restProps}
      className={classNames(styles.menuItem, className)}
      onClick={event => {
        onClick?.(event);
        setOpen(false);
      }}
    >
      {children}
    </a>
  );
}
