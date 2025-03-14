import { useIsomorphicLayoutEffect, useMatchMedia } from '@krutoo/utils';
import classNames from 'classnames';
import { MouseEventHandler, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '#components/button';
import {
  DropdownItem,
  MenuItem,
  MenuItemBody,
  MenuItemDropdown,
  type PageHeaderProps,
  PageHeader as PurePageHeader,
} from '#components/page-header';
import { MenuBarItem, PageMenuBar } from '#components/page-menu-bar';
import { JwtSlice } from '#features/jwt';
import { MatrixFormSlice } from '#features/matrix-form';
import { TaroFormSlice } from '#features/taro-form';
import { UiSlice } from '#features/ui';
import { scrollToAnchorOnClick } from '#shared/dom';
import styles from './page-header.m.css';

interface MenuItem {
  name: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  children?: MenuItem[];
}

export function PageHeader({ className, ...restProps }: PageHeaderProps) {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const desktopWidth = useMatchMedia('(min-width: 1024px)');
  const desktop = mounted ? desktopWidth : true;
  const authorized = useSelector(JwtSlice.selectors.authorized);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  const menuItems: Array<MenuItem> = [
    {
      name: 'Матрица судьбы',
      href: '/#matrix-section-decor',
      onClick: event => {
        scrollToAnchorOnClick(event);
        dispatch(MatrixFormSlice.actions.typeChanged({ formType: 'personal' }));
      },
      children: [
        {
          name: 'Совместимость',
          href: '/?matrix-type=relation#matrix',
          onClick: event => {
            scrollToAnchorOnClick(event);
            dispatch(MatrixFormSlice.actions.typeChanged({ formType: 'relation' }));
          },
        },
        {
          name: 'Финансы',
          href: '/?matrix-type=finances#matrix',
          onClick: event => {
            scrollToAnchorOnClick(event);
            dispatch(MatrixFormSlice.actions.typeChanged({ formType: 'finances' }));
          },
        },
        {
          name: 'Детская матрица',
          href: '/?matrix-type=childish#matrix',
          onClick: event => {
            scrollToAnchorOnClick(event);
            dispatch(MatrixFormSlice.actions.typeChanged({ formType: 'childish' }));
          },
        },
      ],
    },
    {
      name: 'Таро',
      href: '/#taro',
      onClick: scrollToAnchorOnClick,
      children: [
        {
          name: 'О таро',
          href: '/#about-taro',
          onClick: scrollToAnchorOnClick,
        },
        {
          name: 'Расклад таро',
          href: '/?taro-type=classic#taro',
          onClick: event => {
            scrollToAnchorOnClick(event);
            dispatch(TaroFormSlice.actions.typeChanged({ formType: 'classic' }));
          },
        },
        {
          name: 'Гадание «три карты»',
          href: '/?taro-type=three-cards#taro',
          onClick: event => {
            scrollToAnchorOnClick(event);
            dispatch(TaroFormSlice.actions.typeChanged({ formType: 'three-cards' }));
          },
        },
        {
          name: 'Расклад «да-нет»',
          href: '/?taro-type=yes-no#taro',
          onClick: event => {
            scrollToAnchorOnClick(event);
            dispatch(TaroFormSlice.actions.typeChanged({ formType: 'yes-no' }));
          },
        },
      ],
    },
    {
      name: 'Купить',
      href: '/#pricing',
      onClick: scrollToAnchorOnClick,
    },
    {
      name: 'Блог',
      href: '/#blog',
      onClick: scrollToAnchorOnClick,
    },
  ];

  return (
    <>
      {desktop && (
        <PurePageHeader
          {...restProps}
          className={classNames(styles.pageHeader, className)}
          endContent={
            <>
              {!authorized && (
                <Button
                  className={styles.userButton}
                  onClick={() => {
                    dispatch(UiSlice.actions.modalOpen({ modalType: 'auth' }));
                  }}
                >
                  Вход
                </Button>
              )}

              {authorized && (
                <Button as='anchor' href='/cabinet' className={styles.userButton}>
                  Профиль
                </Button>
              )}
            </>
          }
        >
          {menuItems.map((item, index) => (
            <MenuItem key={index}>
              <MenuItemBody
                href={item.href}
                onClick={item.onClick}
                endIcon={item.children ? 'down' : undefined}
              >
                {item.name}
              </MenuItemBody>
              {item.children && (
                <MenuItemDropdown>
                  {item.children?.map((child, childIndex) => (
                    <DropdownItem key={childIndex} href={child.href} onClick={child.onClick}>
                      {child.name}
                    </DropdownItem>
                  ))}
                </MenuItemDropdown>
              )}
            </MenuItem>
          ))}
        </PurePageHeader>
      )}

      {!desktop && (
        <PageMenuBar className={styles.pageNavBar}>
          {menuItems.map((item, index) => (
            <MenuBarItem key={index} href={item.href} onClick={item.onClick}>
              {item.name}
            </MenuBarItem>
          ))}

          <hr className={styles.hr} />

          {!authorized && (
            <MenuBarItem onClick={() => dispatch(UiSlice.actions.modalOpen({ modalType: 'auth' }))}>
              Вход
            </MenuBarItem>
          )}

          {authorized && <MenuBarItem href='/cabinet'>Профиль</MenuBarItem>}
        </PageMenuBar>
      )}
    </>
  );
}
