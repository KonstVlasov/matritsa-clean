import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import { Button } from '#components/button';
import taroCards from '#images/taro-cards-sample.png';
import { scrollToAnchorOnClick } from '#shared/dom';
import styles from './about-taro-section.m.css';

export function AboutTaroSection({ className, ...restProps }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={classNames(styles.section, className)} {...restProps}>
      <div className={styles.inner}>
        <div className={styles.block}>
          <h2 className={styles.title}>Карты Таро</h2>

          <img className={styles.image} src={taroCards} alt='' />
        </div>

        <div className={styles.block}>
          <hr className={styles.hr} />

          <p className={styles.info}>
            Таро поможет вам лучше понять прошлое, осознать настоящее и предвидеть будущее,
            предоставляя ценные подсказки для принятия важных жизненных решений.
          </p>

          <Button
            as='anchor'
            href='#taro'
            size='unset'
            coloring='outline'
            color='#242a49'
            endIcon='arrow'
            className={styles.button}
            onClick={event => {
              scrollToAnchorOnClick(event);
            }}
          >
            Сделать расклад
          </Button>
        </div>
      </div>
    </section>
  );
}
