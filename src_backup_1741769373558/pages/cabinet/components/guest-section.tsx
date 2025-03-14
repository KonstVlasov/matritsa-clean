import { useDispatch } from 'react-redux';
import { Button } from '#components/button';
import { UiSlice } from '#features/ui';
import styles from './guest-section.m.css';

export function GuestSection() {
  const dispatch = useDispatch();

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Вы не авторизованы</h2>
      <p className={styles.message}>
        Для доступа в личный кабинет, необходимо войти или зарегистрироваться
      </p>
      <Button onClick={() => dispatch(UiSlice.actions.modalOpen({ modalType: 'auth' }))}>
        Вход/регистрация
      </Button>
    </div>
  );
}
