import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '#components/button';
import { Input, InputProps } from '#components/input';
import { Modal } from '#components/modal';
import { AuthSlice, AuthState } from '#features/auth';
import { UiSlice } from '#features/ui';
import { useGlobalKeydown } from '#shared/react';
import styles from './auth-modal.m.css';

export function AuthModal() {
  const dispatch = useDispatch();

  useGlobalKeydown('Escape', () => {
    dispatch(UiSlice.actions.modalBack());
  });

  const [currentTab, setCurrentTab] = useState(1);

  const tabs = [
    {
      id: 1,
      name: 'Вход',
    },
    {
      id: 2,
      name: 'Регистрация',
    },
  ];

  return (
    <Modal
      className={styles.modal}
      onDismiss={() => {
        dispatch(UiSlice.actions.modalBack());
      }}
    >
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <Button
            key={tab.id}
            size={36}
            className={styles.tab}
            onClick={() => setCurrentTab(tab.id)}
            color={currentTab === tab.id ? '#6280fe' : '#e6e8f0'}
          >
            {tab.name}
          </Button>
        ))}
      </div>
      {currentTab === 1 && <LoginForm />}
      {currentTab === 2 && <RegisterForm />}
    </Modal>
  );
}

export function LoginForm() {
  const dispatch = useDispatch();

  const status = useSelector(AuthSlice.selectors.status);
  const error = useSelector(AuthSlice.selectors.error);
  const fields = useSelector(AuthSlice.selectors.fields);

  const formDisabled = status === 'fetching';

  const bindField = (name: keyof AuthState['fields']): InputProps => {
    return {
      name,
      value: fields[name],
      disabled: formDisabled,
      onChange: event => {
        dispatch(AuthSlice.actions.fieldsChanged({ [name]: event.target.value }));
      },
    };
  };

  return (
    <>
      <h2 className={styles.title}>Вход</h2>

      <Input
        className={styles.input}
        required
        {...bindField('email')}
        type='text'
        placeholder='Ваш email'
      />

      <Input
        className={styles.input}
        {...bindField('password')}
        type='password'
        placeholder='Пароль'
        required
      />

      {error && <div className={styles.error}>{error}</div>}

      <Button
        disabled={formDisabled || !fields.email || !fields.password}
        className={styles.submit}
        onClick={() => {
          dispatch(AuthSlice.actions.signIn());
        }}
      >
        Войти
      </Button>
    </>
  );
}

export function RegisterForm() {
  const dispatch = useDispatch();

  const status = useSelector(AuthSlice.selectors.status);
  const error = useSelector(AuthSlice.selectors.error);
  const fields = useSelector(AuthSlice.selectors.fields);

  const formDisabled = status === 'fetching';

  const bindField = (name: keyof AuthState['fields']): InputProps => {
    return {
      name,
      value: fields[name],
      disabled: formDisabled,
      onChange: event => {
        dispatch(AuthSlice.actions.fieldsChanged({ [name]: event.target.value }));
      },
    };
  };

  return (
    <>
      <h2 className={styles.title}>Регистрация</h2>

      <Input
        className={styles.input}
        required
        {...bindField('email')}
        type='text'
        placeholder='Ваш email'
      />

      <Input
        className={styles.input}
        {...bindField('password')}
        type='password'
        placeholder='Пароль'
        required
      />

      <Input
        className={styles.input}
        {...bindField('passwordAgain')}
        type='password'
        placeholder='Пароль еще раз'
        required
      />

      {error && <div className={styles.error}>{error}</div>}

      {fields.password && fields.passwordAgain && fields.password !== fields.passwordAgain && (
        <div className={styles.error}>Пароли не совпадают</div>
      )}

      <Button
        disabled={
          formDisabled ||
          !fields.email ||
          fields.password.length < 5 ||
          fields.password !== fields.passwordAgain
        }
        className={styles.submit}
        onClick={() => {
          dispatch(AuthSlice.actions.signUp());
        }}
      >
        Зарегистрироваться
      </Button>
    </>
  );
}
