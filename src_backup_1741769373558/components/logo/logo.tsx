import classNames from 'classnames';
import styles from './logo.m.css';

export function Logo({
  textColor = 'default',
  textTransform = 'default',
  lineBreaks = true,
}: {
  lineBreaks?: boolean;
  textTransform?: 'default' | 'capitalize';
  textColor?: 'default' | 'inherit';
}) {
  const rootClassName = classNames(
    //
    styles.logo,
    textColor === 'default' && styles.textColorDefault,
    textColor === 'inherit' && styles.textColorInherit,
  );

  return (
    <div className={rootClassName}>
      <img className={styles.logoPic} src='/public/images/logo.png' alt='Логотип' />
      <h1 className={styles.logoText}>
        {textTransform === 'default' && 'MATRIX'}
        {textTransform === 'capitalize' && 'Matrix'}

        {lineBreaks ? <br /> : ' '}

        {textTransform === 'default' && 'numerology'}
        {textTransform === 'capitalize' && 'Numerology'}
      </h1>
    </div>
  );
}
