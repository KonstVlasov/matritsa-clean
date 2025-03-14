import { useIsomorphicLayoutEffect } from '@krutoo/utils';
import classNames from 'classnames';
import { ReactNode, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '#components/button';
import { DateInput } from '#components/date-input';
import { Input } from '#components/input';
import { PhoneInput } from '#components/phone-input';
import { SexField } from '#components/sex-field';
import { Spinner } from '#components/spinner';
import { JwtSlice } from '#features/jwt';
import { UserSlice } from '#features/user';
import styles from './personal-info.m.css';

const fieldName: Record<string, string | undefined> = {
  phone: 'Телефон',
  name: 'Имя',
  sex: 'Пол',
  birthDate: 'Дата рождения',
  partnerName: 'Имя партнёра',
  partnerBirthDate: 'Дата рождения партнёра',
};

const fieldPlaceholder: Record<string, string | undefined> = {
  phone: '+7 (900) 000 00 00',
  name: 'Ваше имя',
  sex: undefined,
  birthDate: 'дд.мм.гггг',
  partnerName: 'Имя партнёра',
  partnerBirthDate: 'дд.мм.гггг',
};

export function PersonalInfo() {
  const status = useSelector(UserSlice.selectors.status);

  return (
    <div className={styles.outer}>
      {status === 'fetching' && (
        <div className={classNames(styles.block, styles.loading)}>
          <Spinner />
        </div>
      )}

      {status === 'failure' && (
        <div className={classNames(styles.block, styles.error)}>
          <div>Произошла ошибка, попробуйте обновить страницу</div>
          <Button onClick={() => location.reload()}>Обновить</Button>
        </div>
      )}

      {status === 'success' && (
        <>
          <UserForm />
          <ExtraActions />
        </>
      )}
    </div>
  );
}

function UserForm() {
  const dispatch = useDispatch();

  const status = useSelector(UserSlice.selectors.status);
  const data = useSelector(UserSlice.selectors.data);
  const fields = useSelector(UserSlice.selectors.fields);
  const fieldsChanged = useSelector(UserSlice.selectors.fieldsChanged);
  const [resetKey, setResetKey] = useState(0);

  const disabled = status !== 'success' && status !== 'failure';

  useIsomorphicLayoutEffect(() => {
    if (fieldsChanged === false) {
      setResetKey(Math.floor(Math.random() * 1000));
    }
  }, [fieldsChanged]);

  return (
    <div className={styles.block}>
      <div className={styles.fieldBlock}>
        <label className={styles.label} htmlFor='email'>
          Email
        </label>
        <Input viewSize='m' id='email' placeholder='' value={data?.email ?? ''} readOnly />
      </div>

      {Object.entries(fields).map(([name, value], index) => {
        if (name === 'email') {
          return;
        }

        let field: ReactNode;

        if (name === 'sex') {
          field = (
            <SexField
              disabled={disabled}
              viewSize={40}
              id={name}
              name={name}
              value={value.toLocaleLowerCase()}
              onValueChange={nextSex => {
                dispatch(UserSlice.actions.fieldsUpdated({ [name]: nextSex.toUpperCase() }));
              }}
            />
          );
        } else if (name === 'phone') {
          field = (
            <PhoneInput
              disabled={disabled}
              key={resetKey}
              viewSize='m'
              id={name}
              name={name}
              placeholder={fieldPlaceholder[name]}
              value={value.replace(/^7/g, '')}
              onChange={(event, meta) => {
                dispatch(
                  UserSlice.actions.fieldsUpdated({
                    [name]: meta.cleanValue ? `7${meta.cleanValue}` : '',
                  }),
                );
              }}
            />
          );
        } else if (name === 'birthDate' || name === 'partnerBirthDate') {
          field = (
            <DateInput
              disabled={disabled}
              viewSize='m'
              id={name}
              name={name}
              placeholder={fieldPlaceholder[name]}
              value={value}
              onChange={(event, meta) => {
                dispatch(
                  UserSlice.actions.fieldsUpdated({
                    [name]: event.target.value,
                    silent: meta?.initial,
                  }),
                );
              }}
            />
          );
        } else {
          field = (
            <Input
              disabled={disabled}
              viewSize='m'
              id={name}
              name={name}
              placeholder={fieldPlaceholder[name]}
              value={value}
              onChange={event => {
                dispatch(UserSlice.actions.fieldsUpdated({ [name]: event.target.value }));
              }}
            />
          );
        }

        return (
          <div key={index} className={styles.fieldBlock}>
            <label className={styles.label} htmlFor={name}>
              {fieldName[name]}
            </label>
            {field}
          </div>
        );
      })}

      <div className={styles.formButtons}>
        <Button
          disabled={disabled || !fieldsChanged}
          onClick={() => {
            dispatch(UserSlice.actions.submitForm());
          }}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
}

function ExtraActions() {
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(JwtSlice.actions.logout());
  };

  return (
    <div className={styles.block}>
      <div>
        <Button onClick={logout}>Выйти из профиля</Button>
      </div>
    </div>
  );
}
