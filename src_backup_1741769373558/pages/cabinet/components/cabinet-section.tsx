import { useIsomorphicLayoutEffect, useMatchMedia } from '@krutoo/utils';
import classNames from 'classnames';
import { HTMLAttributes, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { UserSlice } from '#features/user';
import styles from './cabinet-section.m.css';
import { CalculationsView } from './calculations-view';
import { ItemsView } from './items-view';
import { OrderHistory } from './order-history';
import { PersonalInfo } from './personal-info';
import { Tab, Tabs } from './tabs';

function useMounted() {
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export function CabinetSection() {
  const dispatch = useDispatch();
  const mounted = useMounted();
  const desktop = useMatchMedia('(min-width: 1024px)');

  useEffect(() => {
    if (mounted) {
      dispatch(UserSlice.actions.fetch());
    }
  }, [dispatch, mounted]);

  return (
    <div className={styles.outer}>
      {mounted && (
        <>
          {!desktop && <MobileView />}
          {desktop && <DesktopView />}
        </>
      )}
    </div>
  );
}

function MobileView() {
  return (
    <Container maxWidth={680}>
      <div className={styles.MobileView}>
        <div>
          <h3 className={styles.mobileTitle}>Личная информация</h3>
          <PersonalInfo />
        </div>

        <div>
          <h3 className={styles.mobileTitle}>Расчеты</h3>
          <CalculationsView />
        </div>

        <div>
          <h3 className={styles.mobileTitle}>История заказов</h3>
          <OrderHistory />
        </div>

        <div>
          <h3 className={styles.mobileTitle}>Подключенные услуги</h3>
          <ItemsView />
        </div>
      </div>
    </Container>
  );
}

type DesktopTabKey = 'personal-info' | 'calculations' | 'order-history' | 'inventory';

const DESKTOP_TABS: Array<{ key: DesktopTabKey; name: string }> = [
  {
    key: 'personal-info',
    name: 'Личная информация',
  },
  {
    key: 'calculations',
    name: 'Расчеты',
  },
  {
    key: 'order-history',
    name: 'История заказов',
  },
  {
    key: 'inventory',
    name: 'Подключенные услуги',
  },
];

function DesktopView() {
  const [currentTab, setCurrentTab] = useState<DesktopTabKey>('personal-info');

  return (
    <div className={styles.DesktopView}>
      <Container maxWidth={960}>
        <Tabs>
          {DESKTOP_TABS.map(item => (
            <Tab
              key={item.key}
              checked={item.key === currentTab}
              onClick={() => setCurrentTab(item.key)}
            >
              {item.name}
            </Tab>
          ))}
        </Tabs>
      </Container>

      {currentTab === 'personal-info' && (
        <Container maxWidth={680}>
          <PersonalInfo />
        </Container>
      )}

      {currentTab === 'calculations' && (
        <Container maxWidth={680}>
          <CalculationsView />
        </Container>
      )}

      {currentTab === 'order-history' && (
        <Container maxWidth={680}>
          <OrderHistory />
        </Container>
      )}

      {currentTab === 'inventory' && (
        <Container maxWidth={960}>
          <ItemsView />
        </Container>
      )}
    </div>
  );
}

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: 960 | 680;
}

function Container({ maxWidth = 960, className, children, ...restProps }: ContainerProps) {
  const rootClassName = classNames(
    maxWidth === 960 && styles.container960,
    maxWidth === 680 && styles.container680,
    className,
  );

  return (
    <div className={rootClassName} {...restProps}>
      {children}
    </div>
  );
}
