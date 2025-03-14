import classNames from 'classnames';
import { HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '#components/button';
import { UiSlice } from '#features/ui';
import mastercard from '#images/mastercard.png';
import mir from '#images/mir.png';
import visa from '#images/visa.png';
import { Api, Offer } from '#shared/api';
import { Status } from '#shared/types';
import styles from './pricing-section.m.css';

export function PricingSection({ className, ...restProps }: HTMLAttributes<HTMLElement>) {
  const dispatch = useDispatch();

  const [{ status, data }, setOffersState] = useState<{
    status: Status;
    data: null | Offer[];
    error: null | string;
  }>(() => ({
    status: 'initial',
    data: null,
    error: null,
  }));

  useEffect(() => {
    setOffersState(state => ({ ...state, status: 'fetching' }));

    new Api({
      fetch: (...args) => fetch(...args),
      host: import.meta.env.API_HOST,
    })
      .getOffers()
      .then(res => (res.ok ? res.data : Promise.reject(`Ошибка, код ответа: ${res.status}`)))
      .then(data => {
        setOffersState({ data, status: 'success', error: null });
      })
      .catch(cause => {
        setOffersState({ data: null, status: 'failure', error: String(cause) });
      });
  }, []);

  return (
    <section className={classNames(styles.section, className)} {...restProps}>
      <div className={styles.layout}>
        <div className={styles.products}>
          {status === 'success' && data && (
            <>
              {data.map(offer => (
                <PriceBlock
                  key={offer.id}
                  title={offer.name}
                  list={offer.props}
                  price={offer.cost}
                  popular={offer.is_popular}
                  onBuyClick={() => {
                    dispatch(UiSlice.actions.modalOpen({ modalType: 'purchase', offer }));
                  }}
                />
              ))}
            </>
          )}
        </div>

        <div className={styles.payments}>
          Принимаем к оплате:
          <div className={styles.payment}>
            <img src={visa} alt='' />
            <img src={mastercard} alt='' />
            <img src={mir} alt='' />
          </div>
        </div>
      </div>
    </section>
  );
}

function PriceBlock({
  className,
  title,
  list,
  price,
  popular = false,
  onBuyClick,
}: {
  className?: string;
  list?: string[];
  title?: ReactNode;
  price?: number;
  popular?: boolean;
  onBuyClick?: VoidFunction;
}) {
  return (
    <div className={classNames(styles.block, popular && styles.popular, className)}>
      <div className={styles.blockMain}>
        <h3 className={styles.blockTitle}>{title}</h3>

        <ul className={styles.ul}>
          {list?.map((item, index) => (
            <li key={index} className={styles.li}>
              {item}
            </li>
          ))}
        </ul>

        <div className={styles.blockFooter}>
          <Button
            size='unset'
            endIcon='arrow'
            color='unset'
            className={styles.blockButton}
            onClick={onBuyClick}
          >
            Купить
          </Button>
          {typeof price === 'number' && <span className={styles.price}>{price} ₽</span>}
        </div>
      </div>
    </div>
  );
}
