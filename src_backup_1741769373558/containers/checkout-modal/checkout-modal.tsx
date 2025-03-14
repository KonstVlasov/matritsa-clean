import { ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '#components/button';
import { Input } from '#components/input';
import { Modal } from '#components/modal';
import { CheckoutSlice } from '#features/checkout';
import { JwtSlice } from '#features/jwt';
import { UiSlice } from '#features/ui';
import { Offer } from '#shared/api';
import styles from './checkout-modal.m.css';

export function CheckoutModal({ offer }: { offer: Offer }) {
  const dispatch = useDispatch();
  const authorized = useSelector(JwtSlice.selectors.authorized);

  const status = useSelector(CheckoutSlice.selectors.status);
  const { email } = useSelector(CheckoutSlice.selectors.fields);
  const error = useSelector(CheckoutSlice.selectors.error);

  const onDismiss = () => {
    dispatch(UiSlice.actions.modalClose());
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(CheckoutSlice.actions.fetch(offer));
  };

  const onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(CheckoutSlice.actions.fieldsChanged({ email: event.target.value }));
  };

  return (
    <Modal onDismiss={onDismiss} className={styles.modal}>
      <div className={styles.container}>
        <h3 className={styles.title}>Вы покупаете</h3>

        <div className={styles.offer}>
          <div className={styles.offerTitle}>{offer.name}</div>

          <div className={styles.offerProps}>
            {offer.props.map((prop, index) => (
              <div key={index} className={styles.offerPropsItem}>
                {prop}
              </div>
            ))}
          </div>

          <div className={styles.offerCost}>Итого: {offer.cost} ₽</div>
        </div>

        {error && (
          <div className={styles.error}>
            <div className={styles.errorTitle}>Ошибка</div>
            <div className={styles.errorText}>{error}</div>
          </div>
        )}

        <form onSubmit={onSubmit} className={styles.form}>
          {!authorized && (
            <Input
              viewSize='m'
              className={styles.field}
              name='email'
              type='email'
              value={email}
              onChange={onEmailChange}
              placeholder='Ваш email'
              required={!authorized}
              disabled={status === 'fetching'}
            />
          )}
          <Button
            className={styles.submit}
            type='submit'
            size={56}
            disabled={status === 'fetching'}
          >
            Перейти к оплате
          </Button>
        </form>
      </div>
    </Modal>
  );
}
