import classNames from 'classnames';
import { Button } from '#components/button';
import bgMatrix from '#images/hero-bg-matrix.png';
import bgTaro from '#images/hero-bg-taro.png';
import { scrollToAnchorOnClick } from '#shared/dom';
import styles from './hero-section.m.css';

export function HeroSection() {
  return (
    <section className={styles.section}>
      <div className={styles.layout}>
        <div className={classNames(styles.block, styles.blockMatrix)}>
          <h3 className={styles.title}>Матрица судьбы</h3>
          <Button
            as='anchor'
            href='#matrix-section-decor'
            className={styles.button}
            color='#6280fe'
            size='unset'
            endIcon='arrow'
            onClick={event => {
              scrollToAnchorOnClick(event);
            }}
          >
            Расчет матрицы
          </Button>
        </div>

        <div className={classNames(styles.block, styles.blockTaro)}>
          <h3 className={styles.title}>Карты таро</h3>
          <Button
            as='anchor'
            href='#taro'
            className={styles.button}
            color='#6280fe'
            size='unset'
            endIcon='arrow'
            onClick={event => {
              scrollToAnchorOnClick(event);
            }}
          >
            Сделать расклад
          </Button>
        </div>

        <div className={classNames(styles.decor, styles.decorMatrix)}>
          <div className={styles.layout}>
            <div className={styles.blockDecor}>
              <img className={styles.image} src={bgMatrix} alt='' />
            </div>
            <div className={styles.blockStub}></div>
          </div>
        </div>

        <div className={classNames(styles.decor, styles.decorTaro)}>
          <div className={styles.layout}>
            <div className={styles.blockStub}></div>
            <div className={styles.blockDecor}>
              <img className={styles.image} src={bgTaro} alt='' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
