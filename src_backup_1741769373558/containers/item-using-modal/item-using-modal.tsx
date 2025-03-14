import classNames from 'classnames';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '#components/button';
import { Modal } from '#components/modal';
import { getItemTitle, getItemValueLabel } from '#components/utils';
import { ItemUsingSlice } from '#features/item-using';
import { UiSlice } from '#features/ui';
import { ItemsSlice } from '#features/user-items';
import styles from './item-using-modal.m.css';

export function ItemUsingModal() {
  const dispatch = useDispatch();

  const [selectedId, setSelectedId] = useState<null | number>(null);
  const [fullList, setFullList] = useState<boolean>(false);
  const items = useSelector(ItemsSlice.selectors.data);
  const error = useSelector(ItemUsingSlice.selectors.error);
  const status = useSelector(ItemUsingSlice.selectors.status);

  const onDismiss = () => {
    dispatch(UiSlice.actions.modalBack());
  };

  return (
    <Modal className={styles.modal} onDismiss={onDismiss}>
      <h1 className={styles.title}>Подтверждение</h1>

      <p className={styles.message}>Выберите подходящую услугу:</p>

      {(!items || items?.length === 0) && <div>Нет подходящих услуг</div>}

      {items && (
        <>
          <div className={styles.list}>
            {items.slice(0, fullList ? items.length : 3).map(item => (
              <div
                key={item.id}
                className={classNames(styles.item, item.id === selectedId && styles.itemSelected)}
                onClick={() => setSelectedId(item.id)}
              >
                <div className={styles.itemTitle}>{getItemTitle(item)}</div>
                <div className={styles.itemSubtitle}>
                  {getItemValueLabel(item)}: {item.amount}
                </div>
              </div>
            ))}
          </div>

          {!fullList && items.length > 3 && (
            <Button size={36} color='#fff' onClick={() => setFullList(true)}>
              Показать все услуги ({items.length})
            </Button>
          )}
        </>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.controls}>
        <Button
          disabled={status === 'fetching' || selectedId === null}
          onClick={() => {
            if (selectedId === null) {
              return;
            }

            dispatch(ItemUsingSlice.actions.fetch({ userItemId: selectedId }));
          }}
        >
          Подтвердить
        </Button>
        <div>или</div>
        <Button
          color='#fff'
          size={36}
          onClick={() => {
            dispatch(ItemUsingSlice.actions.freeChosen());
            dispatch(UiSlice.actions.modalClose());
          }}
        >
          Попробовать бесплатно
        </Button>
      </div>
    </Modal>
  );
}
