import classNames from 'classnames';
import { CSSProperties, HTMLAttributes, Ref, useMemo } from 'react';
import styles from './taro-card.m.css';

export interface TaroCardStyle extends CSSProperties {
  '--taro-card-w'?: string;
  '--taro-card-h'?: string;
  '--taro-card-r'?: string;
  '--taro-card-b'?: string;
}

export interface TaroCardProps extends HTMLAttributes<HTMLDivElement> {
  rootRef?: Ref<HTMLDivElement>;
  cardIndex?: number;
}

export function TaroCard({ rootRef, cardIndex, className, ...restProps }: TaroCardProps) {
  const imageSrc = useMemo(
    () =>
      typeof cardIndex === 'number'
        ? `/public/images/taro/${cardIndex.toString().padStart(3, '0')}.png`
        : undefined,
    [cardIndex],
  );

  return (
    <div ref={rootRef} className={classNames(styles.TaroCard, className)} {...restProps}>
      <img
        className={styles.cardImage}
        src={imageSrc}
        alt={cardIndex ? `Карта №${cardIndex}` : ''}
      />
    </div>
  );
}
