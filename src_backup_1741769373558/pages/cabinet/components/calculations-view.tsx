import { getDeclination } from '@krutoo/utils';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CalculationsSlice } from '#features/user-calcs';
import { Calculation } from '#shared/api';
import styles from './calculations-view.m.css';
import { ListBlock, ListBlockItem } from './list-block';
import { ErrorPlate, Plate } from './plate';

export function CalculationsView() {
  const dispatch = useDispatch();

  const status = useSelector(CalculationsSlice.selectors.status);
  const data = useSelector(CalculationsSlice.selectors.data);

  useEffect(() => {
    dispatch(CalculationsSlice.actions.fetch());
  }, [dispatch]);

  return (
    <>
      {status === 'fetching' && <Plate loading />}

      {status === 'failure' && <ErrorPlate />}

      {status === 'success' && Array.isArray(data) && (
        <ListBlock>
          {data.length === 0 && (
            <div className={styles.stub}>
              <h2 className={styles.title}>Нет расчетов</h2>
            </div>
          )}
          {data.map((item, index) => (
            <CalcItem key={index} data={item} />
          ))}
        </ListBlock>
      )}
    </>
  );
}

function CalcItem({ data }: { data: Calculation }) {
  const url =
    data.serviceCode === 'TARO_SPREAD'
      ? `/taro-result?taroCalcId=${data.id}`
      : `/matrix-result?matrixCalcId=${data.id}`;

  let title = '';
  let subtitle = '';

  if (data.serviceCode === 'TARO_SPREAD') {
    // @todo в заголовка наверное вопрос должен быть
    title = 'Расклад таро';
    subtitle = `${data.cards.length} ${getDeclination(data.cards.length, ['карта', 'карты', 'карт'])}`;
  } else if (data.serviceCode === 'RELATION_MATRIX') {
    title = `${data.name} и ${data.name2}`;
    subtitle = `${data.birthDate} / ${data.birthDate2}`;
  } else {
    title = `${data.name}`;
    subtitle = `${data.birthDate}`;
  }

  return (
    <ListBlockItem>
      <div className={styles.item}>
        <a href={url} className={styles.itemLink}>
          <span className={styles.itemTitle}>{title}</span>
          <span className={styles.itemSubtitle}>{subtitle}</span>
        </a>
      </div>
    </ListBlockItem>
  );
}
