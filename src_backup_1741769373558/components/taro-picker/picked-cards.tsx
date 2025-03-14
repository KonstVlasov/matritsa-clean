import {
  RectSize,
  getPositionedParentOffset,
  lerp,
  useBoundingClientRect,
  useIsomorphicLayoutEffect,
} from '@krutoo/utils';
import classNames from 'classnames';
import { HTMLAttributes, useRef, useState } from 'react';
import { TaroCard, TaroCardStyle } from '#components/taro-card';
import { createAnimation, easing } from '#shared/animation';
import { CARD_PADDING, CARD_SIZE } from './constants';
import styles from './picked-cards.m.css';
import { CardPickedEvent } from './types';

export function PickedCards({
  cards,
  className,
  style,
  cardLimit = 5,
  getCardName,
  ...restProps
}: HTMLAttributes<HTMLDivElement> & {
  cards: CardPickedEvent[];
  cardLimit?: number;
  getCardName?: (cardIndex: number) => string | undefined | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const areaSize = useBoundingClientRect(ref);

  const deckSize = {
    width: 1.2 * ((CARD_SIZE.width + CARD_PADDING * 2) * cardLimit),
    height: CARD_SIZE.height,
  };

  const scale = Math.min(areaSize.width / deckSize.width, areaSize.height / deckSize.height);

  const deckSizeScaled = {
    width: deckSize.width * scale,
    height: deckSize.height * scale,
  };

  const scale2 = Math.min(
    deckSizeScaled.width / CARD_SIZE.width,
    deckSizeScaled.height / CARD_SIZE.height,
  );

  const cardSizeScaled = {
    width: (CARD_SIZE.width + CARD_PADDING * 2) * scale2,
    height: (CARD_SIZE.height + CARD_PADDING * 2) * scale2,
  };

  const cardPadding = CARD_PADDING * scale2;

  const rootStyle: TaroCardStyle = {
    ...style,
    '--taro-card-w': `${cardSizeScaled.width}px`,
    '--taro-card-h': `${cardSizeScaled.height}px`,
    '--taro-card-r': `${cardSizeScaled.width * 0.08}px`,
    '--taro-card-b': `${cardPadding}px`,
  };

  return (
    <div
      ref={ref}
      className={classNames(styles.PickedCards, className)}
      style={rootStyle}
      {...restProps}
    >
      {areaSize.ready && (
        <div
          className={styles.inner}
          style={{
            ...deckSizeScaled,
          }}
        >
          {cards.slice(0, cardLimit).map(card => (
            <PickedCard
              key={card.index}
              card={card}
              sizes={{ card: cardSizeScaled }}
              cardName={getCardName?.(card.index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function PickedCard({
  card,
  sizes,
  cardName,
}: {
  card: CardPickedEvent;
  cardName?: string | null;
  sizes: { card: RectSize };
}) {
  const [status, setStatus] = useState<'moving' | 'moved'>('moving');
  const placeRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (Date.now() - card.timestamp > 1000) {
      setStatus('moved');
      return;
    }

    const placeElem = placeRef.current;
    const cardElem = cardRef.current;

    if (!(placeElem && cardElem)) {
      return;
    }

    const initRect = card.boundingRect;
    const selfRect = cardElem.getBoundingClientRect();

    const getTargetPos = () => {
      const offset = getPositionedParentOffset(cardElem);
      const rect = placeElem.getBoundingClientRect();

      return {
        x: rect.left + offset.x + sizes.card.width / 2,
        y: rect.top + offset.y + sizes.card.height / 2,
      };
    };

    const animation = createAnimation({
      duration: 1000,
      easing: easing.easeOutCubic,
      from: 0,
      to: 1,
      effect(factor) {
        cardElem.style.setProperty(
          'left',
          `${lerp(initRect.left - selfRect.left + initRect.width / 2, getTargetPos().x, factor)}px`,
        );

        cardElem.style.setProperty(
          'top',
          `${lerp(initRect.top - selfRect.top + initRect.height / 2, getTargetPos().y, factor)}px`,
        );

        cardElem.style.setProperty(
          'transform',
          `translate(-50%, -50%) rotate(${lerp(card.angle, 0, factor)}deg)`,
        );
      },
    });

    animation.play().then(() => {
      setStatus('moved');
    });
  }, []);

  return (
    <div ref={placeRef} className={styles.place}>
      <TaroCard
        rootRef={cardRef}
        className={classNames(styles.card, styles.pickedCard)}
        cardIndex={card.index}
        style={{
          ...(status === 'moving' && {
            position: 'absolute',
            top: 0,
            left: 0,
          }),

          ...(status === 'moved' && {
            transform: 'none',
          }),
        }}
      />
      {cardName && <div className={styles.placeTitle}>{cardName}</div>}
    </div>
  );
}
