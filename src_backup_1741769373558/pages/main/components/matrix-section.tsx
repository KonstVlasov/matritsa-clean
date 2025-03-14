import classNames from 'classnames';
import { FormEventHandler, HTMLAttributes } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '#components/button';
import { DateInput } from '#components/date-input';
import { Input, InputProps } from '#components/input';
import { SexField } from '#components/sex-field';
import { ItemUsingSlice } from '#features/item-using';
import { JwtSlice } from '#features/jwt';
import { MatrixFormSlice, MatrixFormType } from '#features/matrix-form';
import { ItemsSlice } from '#features/user-items';
import destinyMatrix from '#images/destiny-matrix.png';
import { MatrixPayload, MatrixType, RelationMatrixPayload } from '#shared/api';
import styles from './matrix-section.m.css';

const TABS: Array<{ key: MatrixFormType; name: string }> = [
  {
    key: 'personal',
    name: 'Расчет личной матрицы',
  },
  {
    key: 'relation',
    name: 'Совместимость',
  },
  {
    key: 'finances',
    name: 'Финансы',
  },
  {
    key: 'childish',
    name: 'Расчет детской матрицы',
  },
];

const serviceCodeByMatrixFormType: Record<MatrixFormType, MatrixType> = {
  personal: 'PERSONAL_MATRIX',
  relation: 'RELATION_MATRIX',
  finances: 'FINANCE_MATRIX',
  childish: 'CHILDREN_MATRIX',
};

export function MatrixSection({ className, ...restProps }: HTMLAttributes<HTMLElement>) {
  const dispatch = useDispatch();

  const currentTab = useSelector(MatrixFormSlice.selectors.formType);
  const authorized = useSelector(JwtSlice.selectors.authorized);
  const status = useSelector(ItemsSlice.selectors.status);
  const disabled = status === 'fetching';

  const setCurrentTab = (formType: MatrixFormType) => {
    dispatch(MatrixFormSlice.actions.typeChanged({ formType }));
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = event => {
    if (!authorized) {
      return;
    }

    event.preventDefault();

    const rawData = Object.fromEntries(new FormData(event.currentTarget).entries());

    const data: MatrixPayload | RelationMatrixPayload =
      currentTab === 'relation'
        ? ({
            serviceCode: serviceCodeByMatrixFormType[currentTab] as any,
            name: String(rawData.partner1Name),
            name2: String(rawData.partner2Name),
            birthDate: String(rawData.partner1BirthDate),
            birthDate2: String(rawData.partner2BirthDate),
          } satisfies RelationMatrixPayload)
        : ({
            serviceCode: serviceCodeByMatrixFormType[currentTab] as any,
            name: String(rawData.name),
            birthDate: String(rawData.birthDate),
          } satisfies MatrixPayload);

    dispatch(
      ItemUsingSlice.actions.formSubmit({
        formKind: 'matrix',
        form: { action: event.currentTarget.action, data },
      }),
    );
  };

  return (
    <section className={classNames(styles.section, className)} {...restProps}>
      <div className={styles.inner}>
        <div className={styles.imageBlock} id='matrix-section-decor'>
          <img src={destinyMatrix} alt='' />
        </div>

        <div className={styles.mainBlock}>
          <h2 className={styles.title}>Матрица судьбы</h2>

          <div className={styles.tabs}>
            {TABS.map(tab => (
              <Button
                key={tab.key}
                size='unset'
                className={styles.tab}
                coloring={tab.key === currentTab ? 'fill' : 'outline'}
                color='#242a49'
                onClick={() => setCurrentTab(tab.key)}
              >
                {tab.name}
              </Button>
            ))}
          </div>

          <div className={styles.formPlate}>
            {currentTab === 'personal' && (
              <MatrixForm matrixType={currentTab} onSubmit={onSubmit} disabled={disabled} />
            )}

            {currentTab === 'relation' && (
              <RelationMatrixForm matrixType={currentTab} onSubmit={onSubmit} disabled={disabled} />
            )}

            {currentTab === 'finances' && (
              <MatrixForm matrixType={currentTab} onSubmit={onSubmit} disabled={disabled} />
            )}

            {currentTab === 'childish' && (
              <MatrixForm
                nameInputProps={{ placeholder: 'Имя ребенка*' }}
                matrixType={currentTab}
                onSubmit={onSubmit}
                disabled={disabled}
              />
            )}
          </div>

          <div className={styles.decor}>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MatrixForm({
  matrixType,
  nameInputProps,
  onSubmit,
  disabled,
}: {
  matrixType: string;
  nameInputProps?: InputProps;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  disabled?: boolean;
}) {
  return (
    <form className={styles.form} method='GET' action='/matrix-result' onSubmit={onSubmit}>
      <input type='hidden' name='matrixType' value={matrixType} />
      <Input
        className={classNames(styles.input, nameInputProps?.className)}
        name='name'
        required
        placeholder='Ваше имя*'
        disabled={disabled}
        {...nameInputProps}
      />

      <DateInput
        className={styles.input}
        name='birthDate'
        required
        placeholder='Дата рождения дд.мм.гггг*'
        disabled={disabled}
      />

      <SexField className={styles.sexField} name='sex' required disabled={disabled} />

      <Button
        type='submit'
        size='unset'
        className={styles.button}
        endIcon='arrow'
        disabled={disabled}
      >
        Рассчитать
      </Button>
    </form>
  );
}

function RelationMatrixForm({
  matrixType,
  onSubmit,
  disabled,
}: {
  matrixType: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  disabled?: boolean;
}) {
  return (
    <form className={styles.form} method='GET' action='/matrix-result' onSubmit={onSubmit}>
      <input type='hidden' name='matrixType' value={matrixType} />

      <Input
        className={styles.input}
        name='partner1Name'
        required
        placeholder='Ваше имя*'
        disabled={disabled}
      />

      <DateInput
        className={styles.input}
        name='partner1BirthDate'
        required
        placeholder='Дата рождения*'
        disabled={disabled}
      />

      <SexField className={styles.sexField} name='partner1Sex' required disabled={disabled} />

      <Input
        className={styles.input}
        name='partner2Name'
        required
        placeholder='Имя партнера*'
        disabled={disabled}
      />

      <DateInput
        className={styles.input}
        name='partner2BirthDate'
        required
        placeholder='Дата рождения партнера*'
        disabled={disabled}
      />

      <SexField className={styles.sexField} name='partner2Sex' required disabled={disabled} />

      <Button
        type='submit'
        size='unset'
        className={styles.button}
        endIcon='arrow'
        disabled={disabled}
      >
        Рассчитать
      </Button>
    </form>
  );
}
