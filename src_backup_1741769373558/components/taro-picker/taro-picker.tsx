import { Point2d, RectSize, useBoundingClientRect } from '@krutoo/utils';
import classNames from 'classnames';
import { CSSProperties, HTMLAttributes, memo, useMemo, useRef, useState } from 'react';
import { Button } from '#components/button';
import { CARD_SIZE, FAN_SIZE } from './constants';
import styles from './taro-picker.m.css';
import { CardPickedEvent, TaroPickerStyle } from './types';

export function TaroPicker({
  disabled,
  onCardPick,
  pickedIndices = [],
  className,
  style,
  ...restProps
}: HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean;
  pickedIndices?: number[];
  onCardPick?: (event: CardPickedEvent) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);
  const areaSize = useBoundingClientRect(rootRef);
  const [interaction, setInteraction] = useState<boolean>(false);
  const [pointerAngle, setPointerAngle] = useState<number>(-90);
  const [needConfirm, setNeedConfirm] = useState(false);

  const shuffle = useMemo(() => [...Array(78).keys()].sort(() => Math.random() - 0.5), []);
  const cardIndices = useMemo(() => {
    return shuffle.filter(i => !pickedIndices.includes(i));
  }, [shuffle, pickedIndices]);

  const cardCount = cardIndices.length;
  const fanRange = 145;

  const innerGutter = useMemo(() => {
    return Math.min(areaSize.width, areaSize.height) * 0.12;
  }, [areaSize.width, areaSize.height]);

  const scale = useMemo(() => {
    return Math.min(
      (areaSize.width - innerGutter) / FAN_SIZE.width,
      (areaSize.height - innerGutter) / FAN_SIZE.height,
    );
  }, [areaSize.width, areaSize.height, innerGutter]);

  const fanSize = useMemo<RectSize>(() => {
    return {
      width: FAN_SIZE.width * scale,
      height: FAN_SIZE.height * scale,
    };
  }, [scale]);

  const cardSize = useMemo<RectSize>(() => {
    return {
      width: CARD_SIZE.width * scale,
      height: CARD_SIZE.height * scale,
    };
  }, [scale]);

  const center = useMemo<Point2d>(() => {
    return {
      x: fanSize.width / 2,
      y: fanSize.height - cardSize.width / 2,
    };
  }, [fanSize.width, fanSize.height, cardSize.width]);

  const { angles, nearestIndex } = useMemo(() => {
    const angles: number[] = [];
    let nearestIndex = -1;

    for (let i = cardCount - 1; i >= 0; i--) {
      const angle = i * (-fanRange / (cardCount - 1)) - (180 - fanRange) / 2;

      angles.push(angle);

      if (interaction && pointerAngle < 0) {
        if (nearestIndex === -1) {
          nearestIndex = angles.length - 1;
          continue;
        }

        if (Math.abs(angle - pointerAngle) < Math.abs(angles[nearestIndex]! - pointerAngle)) {
          nearestIndex = angles.length - 1;
        }
      }
    }

    return { angles, nearestIndex };
  }, [interaction, pointerAngle, fanRange, cardCount]);

  const start = -180 + (180 - fanRange) / 2;
  const end = -((180 - fanRange) / 2);

  const rootStyle: TaroPickerStyle = {
    ...style,
    '--taro-picker-card-w': `${cardSize.width}px`,
    '--taro-picker-card-h': `${cardSize.height}px`,
    '--taro-picker-center-x': `${center.x}px`,
    '--taro-picker-center-y': `${center.y}px`,
  };

  const touchedRef = useRef(false);

  return (
    <div
      ref={rootRef}
      {...restProps}
      className={classNames(styles.root, disabled && styles.disabled, className)}
      style={rootStyle}
      tabIndex={0}
      onBlur={() => {
        setInteraction(false);
        setNeedConfirm(false);
      }}
      onMouseDown={event => {
        event.preventDefault();
      }}
      onMouseEnter={() => {
        setInteraction(true);
      }}
      onMouseLeave={() => {
        setInteraction(false);
      }}
      onMouseMove={event => {
        const element = fanRef.current;

        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();

        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        // move to origin
        x = x - center.x;
        y = y - center.y;

        // normalize
        const len = Math.sqrt(x ** 2 + y ** 2);
        x = x / len;
        y = y / len;

        const angle = (Math.atan2(y, x) * 180) / Math.PI;
        setPointerAngle(angle);
      }}
      onTouchStart={event => {
        touchedRef.current = true;

        const touch = event.touches[0];

        if (!touch) {
          return;
        }

        event.currentTarget.focus();

        setInteraction(true);
      }}
      onTouchMove={event => {
        event.preventDefault();

        const touch = event.touches[0];

        if (!touch) {
          return;
        }

        const { width, left } = event.currentTarget.getBoundingClientRect();
        const posX = touch.clientX - left;
        const ratio = posX / width;

        setPointerAngle(-180 + 180 * ratio);
      }}
      onTouchEnd={() => {
        touchedRef.current = true;

        setNeedConfirm(true);
      }}
      onClick={event => {
        if (touchedRef.current) {
          touchedRef.current = false;
          return;
        }

        if (event.defaultPrevented) {
          return;
        }

        if (nearestIndex === -1) {
          return;
        }

        const container = fanRef.current;

        if (!container) {
          return;
        }

        const card = container.children[nearestIndex]?.firstChild;

        if (!(card instanceof HTMLElement)) {
          return;
        }

        onCardPick?.({
          index: cardIndices[nearestIndex] ?? 0,
          angle: (angles[nearestIndex] ?? 0) + 90,
          boundingRect: card.getBoundingClientRect(),
          timestamp: Date.now(),
        });
      }}
    >
      {areaSize.ready && (
        <div ref={fanRef} className={styles.fan} style={fanSize}>
          {angles.map((angle, index) => {
            let resultAngle = angle;

            if (nearestIndex >= 0) {
              if (index < nearestIndex) {
                resultAngle = -180 + (180 - fanRange) / 2 + 0.5 * (resultAngle - start);
              }

              if (index > nearestIndex) {
                resultAngle = end - Math.abs((end - resultAngle) * 0.5);
              }
            }

            return (
              <FanCard
                key={index}
                angle={resultAngle}
                active={index === nearestIndex}
                cardSize={cardSize}
              />
            );
          })}
        </div>
      )}

      {needConfirm && (
        <Button
          className={styles.confirm}
          onClick={event => {
            event.preventDefault();

            const query = '[data-card-picker-type="card"]';
            const element = fanRef.current?.querySelectorAll(query)[nearestIndex];
            const rect = element?.getBoundingClientRect();

            onCardPick?.({
              index: cardIndices[nearestIndex] ?? 0,
              angle: (angles[nearestIndex] ?? 0) + 90,
              boundingRect: rect!,
              timestamp: Date.now(),
            });

            setNeedConfirm(false);
          }}
        >
          Выбрать
        </Button>
      )}
    </div>
  );
}

const FanCard = memo(function FanCard({
  angle,
  active,
  cardSize,
}: {
  active: boolean;
  angle: number;
  cardSize: RectSize;
}) {
  const style = useMemo<CSSProperties>(() => {
    return {
      width: active ? cardSize.height * 0.62 : cardSize.height / 2,
      transform: `rotate(${angle}deg)`,
    };
  }, [cardSize, active, angle]);

  return (
    <div data-card-picker-type='card' className={classNames(styles.line)} style={style}>
      <div className={classNames(styles.card, active && styles.active)}></div>
    </div>
  );
});
