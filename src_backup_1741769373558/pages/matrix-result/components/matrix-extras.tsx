import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import BracketSVG from '#icons/bracket.svg';
import { MatrixResult } from '#shared/api';
import styles from './matrix-extras.m.css';

export function MatrixExtras({ data }: { data: MatrixResult['calc'] }) {
  return (
    <div className={styles.root}>
      <div className={styles.block}>
        <div className={styles.title}>Поиск себя:</div>
        <div className={styles.message}>
          Соединение мужского и женского. Выстраивание взаимоотношений. Способности, навыки, умения.
        </div>
        <Diagram
          itemA={{ label: 'Небо', value: data.PURPOSE.SEARCH.SKY }}
          itemB={{ label: 'Земля', value: data.PURPOSE.SEARCH.EARTH }}
          resultValue={data.PURPOSE.SEARCH.SUM}
        />
      </div>

      <div className={styles.block}>
        <div className={styles.title}>Социализация:</div>
        <div className={styles.message}>
          Социальная и родовая системы. Результаты и признание в социуме.
        </div>
        <Diagram
          itemA={{ label: 'М', value: data.PURPOSE.SOCIALIZATION.MEN }}
          itemB={{ label: 'Ж', value: data.PURPOSE.SOCIALIZATION.WOMEN }}
          resultValue={data.PURPOSE.SOCIALIZATION.SUM}
        />
      </div>

      <div className={styles.block}>
        <div className={styles.title}>
          <span>Духовная гармония:</span>
          <NumberCircle>{data.PURPOSE.SPIRIT}</NumberCircle>
        </div>
        <div className={styles.message}>
          Духовный зачет. Кто я для бога? Где божественное во мне?
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.title}>
          <span>Планетарное:</span>
          <NumberCircle>{data.PURPOSE.PLANETARY}</NumberCircle>
        </div>
        <div className={styles.message}>Планетарное предназначение человека</div>
      </div>
    </div>
  );
}

interface DiagramItem {
  label: string;
  value: number;
}

function Diagram({
  itemA,
  itemB,
  resultValue,
}: {
  itemA: DiagramItem;
  itemB: DiagramItem;
  resultValue: number;
}) {
  return (
    <div className={styles.diagram}>
      <div className={styles.diagramInput}>
        <div className={styles.diagramInputItem}>
          {itemA.label}
          <NumberCircle>{itemA.value}</NumberCircle>
        </div>
        <div className={styles.diagramInputItem}>
          {itemB.label}
          <NumberCircle>{itemB.value}</NumberCircle>
        </div>
      </div>
      <BracketSVG />
      <div>
        <NumberCircle>{resultValue}</NumberCircle>
      </div>
    </div>
  );
}

function NumberCircle({ children, className, ...restProps }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...restProps} className={classNames(styles.circle, className)}>
      {children}
    </span>
  );
}
