import classNames from 'classnames';
import { MatrixResult } from '#shared/api';
import styles from './chakra-table.m.css';

const subtitle: Record<string, string | undefined> = {
  Сахасрара: 'Миссия',
  Аджна: 'Судьба, эгрегоры',
  Виджуха: 'Судьба, эгрегоры',
  Анахата: 'Отношения, картина мира',
  Манипура: 'Статус, владение',
  Свадхистана: 'Детская любовь, радость',
  Муладхара: 'Тело, материя',
};

export function ChakraTable({ data }: { data: MatrixResult['table'] }) {
  return (
    <div className={styles.ChakraTable}>
      <div className={styles.inner}>
        <div className={classNames(styles.chakraHeader, styles.chakraRow)}>
          <div className={styles.chakraItem}>Название чакры</div>
          <div className={styles.chakraItem}>Физика</div>
          <div className={styles.chakraItem}>Энергия</div>
          <div className={styles.chakraItem}>Эмоции</div>
        </div>

        <div className={styles.chakraBody}>
          {data.map((item, index) => (
            <div key={index} className={styles.chakraRow}>
              <div className={styles.chakraItem}>
                <div className={styles.chakraTitle}>{item.name}</div>
                <div className={styles.chakraSubtitle}>{subtitle[item.name]}</div>
              </div>
              <div className={styles.chakraItem}>
                <div className={styles.value}>{item.physic}</div>
              </div>
              <div className={styles.chakraItem}>
                <div className={styles.value}>{item.energy}</div>
              </div>
              <div className={styles.chakraItem}>
                <div className={styles.value}>{item.emotions}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
