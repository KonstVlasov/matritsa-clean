import classNames from 'classnames';
import { HTMLAttributes, ReactNode } from 'react';
import styles from './footer.m.css';

export function PageFooter({ children, className, ...restProps }: HTMLAttributes<HTMLDivElement>) {
  return (
    <footer className={classNames(styles.footer, className)} {...restProps}>
      <div className={styles.layout}>
        <div className={styles.grid}>{children}</div>
      </div>
      <div className={styles.copyright}>Matrix Numerology Ⓒ 2024</div>
    </footer>
  );
}

export function FooterList({ children }: { children: ReactNode }) {
  return <ul className={styles.ul}>{children}</ul>;
}

export function FooterListItem({ children }: { children: ReactNode }) {
  return <li className={styles.li}>{children}</li>;
}

export function FooterItem({
  blockTitle,
  children,
  className,
  ...restProps
}: { blockTitle?: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={classNames(styles.block, className)} {...restProps}>
      {blockTitle && <h3 className={styles.blockTitle}>{blockTitle}</h3>}
      {children}
    </div>
  );
}

export function FooterSubscribeForm({
  email,
  disabled,
  onEmailChange,
  onSubmit,
  error,
  detailsHref,
}: {
  disabled?: boolean;
  email?: string;
  onEmailChange?: (email: string) => void;
  onSubmit?: (email: string) => void;
  error?: string | null;
  detailsHref?: string;
}) {
  return (
    <>
      <form
        action=''
        onSubmit={event => {
          event.preventDefault();
          onSubmit?.(String(new FormData(event.currentTarget).get('email') ?? ''));
        }}
        className={styles.form}
      >
        <input
          name='email'
          className={styles.input}
          type='email'
          placeholder='Ваш email'
          required
          value={email}
          disabled={disabled}
          onChange={e => onEmailChange?.(e.target.value)}
        />

        <button className={styles.submit} type='submit' disabled={disabled}>
          Подписаться
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      {detailsHref && (
        <div className={styles.agreement}>
          Даю согласие на обработку персональных данных
          <br />
          <a className={styles.underlined} href={detailsHref}>
            Подробнее
          </a>
        </div>
      )}
    </>
  );
}
