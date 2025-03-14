import { useDispatch } from 'react-redux';
import { Button } from '#components/button';
import { Modal } from '#components/modal';
import { UiSlice } from '#features/ui';
import MailSVG from '#icons/mail.svg';
import styles from './subscribe-done-modal.m.css';

export function SubscribeDoneModal() {
  const dispatch = useDispatch();

  const onDismiss = () => {
    dispatch(UiSlice.actions.modalBack());
  };

  return (
    <Modal onDismiss={onDismiss} className={styles.modal}>
      <MailSVG className={styles.icon} />
      <h3 className={styles.title}>Спасибо за подписку!</h3>
      <p className={styles.message}>
        Вы теперь в курсе последних новинок и акций, ожидайте интересные обновления от нас.
      </p>
      <Button endIcon='arrow' className={styles.button} onClick={onDismiss}>
        Хорошо
      </Button>
    </Modal>
  );
}
