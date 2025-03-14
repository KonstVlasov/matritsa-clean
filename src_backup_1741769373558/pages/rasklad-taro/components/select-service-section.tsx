import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '#components/button';
import { TaroFormSlice, TaroFormType } from '#features/taro-form';
import { scrollToAnchorOnClick } from '#shared/dom';
import styles from './select-service-section.m.css';

interface TaroVariant {
  type: TaroFormType;
  title: string;
  description: string;
  action?: VoidFunction;
}

export function SelectServiceSection({ className, ...restProps }: HTMLAttributes<HTMLElement>) {
  const dispatch = useDispatch();
  const formType = useSelector(TaroFormSlice.selectors.formType);

  const taroVariants: TaroVariant[] = [
    {
      type: 'yes-no',
      title: 'Расклад «да-нет»',
      description: 'Основывается на одной карте, позволяет получить точный ответ',
      action: () => dispatch(TaroFormSlice.actions.typeChanged({ formType: 'yes-no' })),
    },

    {
      type: 'three-cards',
      title: 'Гадание «Три карты»',
      description: 'Вы выбираете три карты, символизирующие настоящее, прошлое и будущее',
      action: () => dispatch(TaroFormSlice.actions.typeChanged({ formType: 'three-cards' })),
    },

    {
      type: 'classic',
      title: 'Расклад Таро',
      description: 'Ответ на вопрос формируется на основе пяти карт, вытянутых из колоды',
      action: () => dispatch(TaroFormSlice.actions.typeChanged({ formType: 'classic' })),
    },
  ];

  return (
    <section className={classNames(styles.section, className)} {...restProps}>
      <h2 className={styles.title}>Выберите подходящую услугу</h2>

      <div className={styles.blocks}>
        {taroVariants.map((item, index) => (
          <div
            key={index}
            className={classNames(styles.block, formType === item.type && styles.blockSelected)}
          >
            <h3 className={styles.blockTitle}>{item.title}</h3>
            <p>{item.description}</p>
            <Button
              as='anchor'
              href='#taro'
              className={styles.blockButton}
              color='#e6e8f0'
              endIcon='arrow'
              onClick={event => {
                item.action?.();
                scrollToAnchorOnClick(event);
              }}
            >
              Выбрать
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
