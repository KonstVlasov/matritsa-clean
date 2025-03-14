import { RectSize, useBoundingClientRect } from '@krutoo/utils';
import classNames from 'classnames';
import { HTMLAttributes, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '#components/button';
import { PageLoading } from '#components/page-loading';
import { PageRoot } from '#components/page-root';
import { StyledMarkup } from '#components/styled-markup';
import { TaroCard, TaroCardStyle } from '#components/taro-card';
import { CARD_PADDING, CARD_SIZE } from '#components/taro-picker/constants';
import { PageFooter } from '#containers/page-footer';
import { PageHeader } from '#containers/page-header';
import { ItemUsingSlice } from '#features/item-using';
import { JwtSlice } from '#features/jwt';
import { TaroCalcSlice } from '#features/taro-calc';
import { TaroResult } from '#shared/api';
import { parseTaro, parseTaroCalc } from '#utils/forms';
import styles from './taro-result-page.m.css';

export function TaroResultPage() {
  const dispatch = useDispatch();

  const status = useSelector(TaroCalcSlice.selectors.status);
  const data = useSelector(TaroCalcSlice.selectors.data);
  const [free, setFree] = useState(true);

  useEffect(() => {
    const url = new URL(location.href);
    const data = Object.fromEntries(url.searchParams.entries());

    const free = parseTaro(data);
    if (free) {
      dispatch(
        TaroCalcSlice.actions.fetch({
          serviceCode: 'TARO_SPREAD',
          ...free,
        }),
      );
      dispatch(
        ItemUsingSlice.actions.formChanged({
          action: '/taro-result',
          data: {
            serviceCode: 'TARO_SPREAD',
            ...free,
          },
        }),
      );
      setFree(true);
      return;
    }

    const calc = parseTaroCalc(data);
    if (calc) {
      dispatch(
        TaroCalcSlice.actions.fetch({
          ...calc,
        }),
      );
      setFree(false);
      return;
    }
  }, [dispatch]);

  const authorized = useSelector(JwtSlice.selectors.authorized);
  const calc = useSelector(TaroCalcSlice.selectors.data);

  const onFullRequest: MouseEventHandler<HTMLAnchorElement> = event => {
    if (!authorized) {
      return;
    }

    if (!calc?.serviceCode) {
      return;
    }

    event.preventDefault();

    dispatch(ItemUsingSlice.actions.fullRequested({ serviceCode: calc?.serviceCode }));
  };

  return (
    <PageRoot display='flexColumn'>
      <PageHeader />

      <div className={styles.root}>
        <div className={styles.container}>
          {status === 'fetching' && <PageLoading />}

          {status === 'success' && data && (
            <div className={styles.main}>
              <div className={styles.title}>{getSectionTitle(data)}</div>

              <div className={classNames(styles.section, styles.cardsSection)}>
                <div className={styles.cardsBlock}>
                  <TaroCardsView
                    cardIndices={data.cards.map(c => c.index)}
                    className={styles.cardsView}
                  />
                </div>
              </div>

              <div className={classNames(styles.section, styles.secondarySection)}>
                <div className={styles.descriptionBlock}>
                  {data.answer && (
                    <StyledMarkup dangerouslySetInnerHTML={{ __html: data.answer }} />
                  )}
                  {!data.answer && (
                    <StyledMarkup>
                      <h3>Ответ пуст</h3>
                      <p>Попробуйте задать вопрос позднее...</p>
                    </StyledMarkup>
                  )}
                  {/* <div className={styles.cardInfoList}>
                    {data.cards.map((card, index) => (
                      <div key={index} className={styles.cardInfo}>
                        <h3 className={styles.cardInfoTitle}>{card.name}</h3>
                        <p className={styles.cardInfoText}>{card.description}</p>
                      </div>
                    ))}
                  </div> */}
                </div>
                {free && (
                  <div className={styles.offerBlock}>
                    Для получения полного доступа к раскладу приобретите подписку
                    <Button as='anchor' href='/#pricing' endIcon='arrow' onClick={onFullRequest}>
                      Получить полный доступ
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <PageFooter />
    </PageRoot>
  );
}

function getSectionTitle(data: TaroResult) {
  if (data.cards.length === 1) {
    return 'Результаты расклада «Да-Нет»';
  }
  if (data.cards.length === 3) {
    return 'Результаты гадания «Три карты»';
  }
  return 'Результаты расклада Таро';
}

export interface TaroCardsViewStyle extends TaroCardStyle {
  '--taro-cards-view-gap'?: string;
}

function TaroCardsView({
  cardIndices,
  className,
  style,
  ...restProps
}: { cardIndices: number[] } & HTMLAttributes<HTMLDivElement>) {
  const ref = useRef(null);
  const area = useBoundingClientRect(ref);

  const cardSize: RectSize = {
    width: CARD_SIZE.width + CARD_PADDING * 2,
    height: CARD_SIZE.height + CARD_PADDING * 2,
  };

  let cardPadding = 0;

  if (cardIndices.length === 1) {
    const scale = Math.min(
      area.width / (cardSize.width * 1 + CARD_PADDING * 0),
      area.height / (cardSize.height * 1 + CARD_PADDING * 0),
    );

    cardSize.width = cardSize.width * scale;
    cardSize.height = cardSize.height * scale;
    cardPadding = CARD_PADDING * scale;
  } else if (cardIndices.length === 3) {
    const scale = Math.min(
      area.width / (cardSize.width * 3 + CARD_PADDING * 2),
      area.height / (cardSize.height * 1 + CARD_PADDING * 0),
    );

    cardSize.width = cardSize.width * scale;
    cardSize.height = cardSize.height * scale;
    cardPadding = CARD_PADDING * scale;
  } else if (cardIndices.length === 5) {
    const scale = Math.min(
      area.width / (cardSize.width * 3 + CARD_PADDING * 2),
      area.height / (cardSize.height * 2 + CARD_PADDING * 1),
    );

    cardSize.width = cardSize.width * scale;
    cardSize.height = cardSize.height * scale;
    cardPadding = CARD_PADDING * scale;
  }

  const rootStyle: TaroCardsViewStyle = {
    '--taro-card-w': `${cardSize.width}px`,
    '--taro-card-h': `${cardSize.height}px`,
    '--taro-card-r': `${cardSize.width * 0.08}px`,
    '--taro-card-b': `${cardPadding}px`,
    '--taro-cards-view-gap': `${cardPadding}px`,
    ...style,
  };

  return (
    <div
      ref={ref}
      className={classNames(styles.TaroCardsView, className)}
      style={rootStyle}
      {...restProps}
    >
      {area.ready && (
        <>
          {cardIndices.length <= 3 &&
            cardIndices
              .slice(0, 5)
              .map((cardIndex, index) => <TaroCard key={index} cardIndex={cardIndex} />)}

          {cardIndices.length === 5 && (
            <div className={styles.cardRows}>
              <div className={styles.cardRow}>
                {cardIndices.slice(0, 3).map((cardIndex, index) => (
                  <TaroCard key={index} cardIndex={cardIndex} />
                ))}
              </div>
              <div className={styles.cardRow}>
                {cardIndices.slice(3, 5).map((cardIndex, index) => (
                  <TaroCard key={index} cardIndex={cardIndex} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
