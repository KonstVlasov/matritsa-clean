import { useBoundingClientRect } from '@krutoo/utils';
import classNames from 'classnames';
import { HTMLAttributes, useRef } from 'react';
import { Button } from '#components/button';
import decor from '#images/destiny-matrix-decor.png';
import { scrollToAnchorOnClick } from '#shared/dom';
import styles from '../components/how-it-works-section.m.css';

export function HowItWorksSection({ className, ...restProps }: HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const size = useBoundingClientRect(ref);

  const imgSize = {
    width: size.width * 1.5,
    height: size.width * 1.5,
  };

  return (
    <section className={classNames(styles.section, className)} {...restProps}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Как это работает?</h2>
        <p className={styles.subtitle}>Получите расчет персональной диаграммы</p>

        <div className={styles.groups}>
          <div className={classNames(styles.group, styles.groupSplit)}>
            <div className={classNames(styles.block, styles.part)}>
              <h3 className={styles.blockTitle}>ШАГ 01:</h3>
              <p>Введите дату рождения</p>
            </div>

            <div className={classNames(styles.block, styles.part)}>
              <h3 className={styles.blockTitle}>ШАГ 02:</h3>
              <p>Изучите личную диаграмму</p>
            </div>
          </div>

          <div className={styles.group}>
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>ШАГ 03:</h3>

              <p>
                Воспользуйтесь знаниями Матрицы для уверенного принятия решений, которые изменят
                вашу жизнь в областях любви, личностного роста и карьеры
              </p>

              <Button
                as='anchor'
                href='#matrix-section-decor'
                onClick={scrollToAnchorOnClick}
                size='unset'
                endIcon='arrow'
                className={styles.calcButton}
              >
                рассчитать
              </Button>
            </div>
          </div>

          <div className={styles.group}>
            <div ref={ref} className={classNames(styles.block, styles.decor)}>
              <img
                src={decor}
                alt=''
                className={classNames(size.ready && styles.ready)}
                style={{
                  height: `${imgSize.height}px`,
                  top: `${-((imgSize.height - size.height) / 2)}px`,
                  left: `${-(imgSize.width / 2) + size.width}px`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
