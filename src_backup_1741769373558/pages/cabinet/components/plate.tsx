import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import { Spinner } from '#components/spinner';
import styles from './plate.m.css';

export interface PlateProps extends HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  textAlign?: 'center';
}

export function Plate({ textAlign, className, children, loading, ...restProps }: PlateProps) {
  return (
    <div
      className={classNames(
        styles.Plate,
        loading && styles.loading,
        textAlign === 'center' && styles.textAlignCenter,
        className,
      )}
      {...restProps}
    >
      {loading && <Spinner />}
      {!loading && children}
    </div>
  );
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  textAlign?: 'center';
}

export function Heading({ level = 3, textAlign, className, children, ...restProps }: HeadingProps) {
  const Tag = `h${level}` as const;

  return (
    <Tag
      className={classNames(
        styles.Heading,
        styles[Tag],
        textAlign === 'center' && styles.textAlignCenter,
        className,
      )}
      {...restProps}
    >
      {children}
    </Tag>
  );
}

export function ErrorPlate() {
  return (
    <Plate className={styles.ErrorPlate}>
      <Heading level={2}>Ошибка</Heading>
      <p>Попробуйте перезагрузить страницу</p>
    </Plate>
  );
}
