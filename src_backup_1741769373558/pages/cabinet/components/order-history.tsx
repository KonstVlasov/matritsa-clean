import { format, parseISO } from 'date-fns';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OrdersSlice } from '#features/user-orders';
import { ListBlock, ListBlockItem } from './list-block';
import styles from './order-hostory.m.css';
import { ErrorPlate, Heading, Plate } from './plate';

export function OrderHistory() {
  const dispatch = useDispatch();

  const status = useSelector(OrdersSlice.selectors.status);
  const data = useSelector(OrdersSlice.selectors.data);

  useEffect(() => {
    dispatch(OrdersSlice.actions.fetch());
  }, [dispatch]);

  return (
    <>
      {status === 'fetching' && <Plate loading />}

      {status === 'failure' && <ErrorPlate />}

      {status === 'success' && (
        <>
          {(!data || data.length === 0) && (
            <Plate textAlign='center'>
              <Heading level={2}>Нет заказов</Heading>
            </Plate>
          )}

          {data && data.length > 0 && (
            <ListBlock>
              {data.map((item, index) => (
                <ListBlockItem key={index} className={styles.ordersItem}>
                  <div className={styles.orderColumn}>
                    <div className={styles.orderTitle}>{item.offerName}</div>
                    <div>{format(parseISO(item.createdAt), 'HH:mm dd.mm.yyyy')}</div>
                  </div>

                  <div className={styles.orderColumn}>{item.amount} ₽</div>
                </ListBlockItem>
              ))}
            </ListBlock>
          )}
        </>
      )}
    </>
  );
}
