import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getItemTitle, getItemValueLabel } from '#components/utils';
import { ItemsSlice } from '#features/user-items';
import { Item } from '#shared/api';
import styles from './items-view.m.css';
import { ErrorPlate, Heading, Plate } from './plate';

export function ItemsView() {
  const data = useSelector(ItemsSlice.selectors.data);
  const status = useSelector(ItemsSlice.selectors.status);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ItemsSlice.actions.fetch());
  }, [dispatch]);

  return (
    <>
      {status === 'fetching' && <Plate loading />}

      {status === 'failure' && <ErrorPlate />}

      {status === 'success' && (
        <>
          {(!data || data.length === 0) && (
            <Plate textAlign='center'>
              <Heading level={2}>Нет подключенных услуг</Heading>
            </Plate>
          )}

          {Array.isArray(data) && data.length > 0 && (
            <div className={styles.list}>
              {data.map((item, index) => (
                <UserItemCard key={index} data={item} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

function UserItemCard({ data }: { data: Item }) {
  return (
    <Plate className={styles.item}>
      <div className={styles.itemTitle}>{getItemTitle(data)}</div>

      <div className={styles.itemMain}>
        <div className={styles.itemValueLabel}>{getItemValueLabel(data)}:</div>
        <div className={styles.itemValue}>{data.amount}</div>
      </div>

      {data.endDate && <div className={styles.itemCaption}>Истекает: {data.endDate}</div>}
    </Plate>
  );
}
