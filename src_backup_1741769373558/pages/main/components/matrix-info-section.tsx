import { Button } from '#components/button';
import { scrollToAnchorOnClick } from '#shared/dom';
import styles from './matrix-info-section.m.css';

export function MatrixInfoSection() {
  return (
    <section className={styles.section}>
      <div className={styles.plate}>
        <h2 className={styles.title}>Матрица судьбы</h2>

        <p>
          Матрица судьбы — это уникальный инструмент самопознания, который позволяет глубже понять
          свои врожденные таланты, потенциал и жизненное предназначение. Используя дату рождения,
          этот метод помогает раскрыть скрытые аспекты личности, определить сильные и слабые
          стороны, а также осознать, какие возможности и препятствия могут встретиться на жизненном
          пути. Благодаря анализу совместимости, Матрица судьбы также может помочь в создании
          гармоничных отношений, минимизируя конфликты и способствуя взаимопониманию между
          партнёрами.
        </p>

        <Button
          as='anchor'
          href='#how-it-works'
          size='unset'
          color='#242a49'
          coloring='outline'
          endIcon='arrow'
          className={styles.button}
          onClick={event => {
            scrollToAnchorOnClick(event);
          }}
        >
          Как это работает
        </Button>
      </div>
    </section>
  );
}
