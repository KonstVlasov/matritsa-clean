import classNames from 'classnames';
import { Logo } from '#components/logo';
import styles from './logo-section.m.css';

export function LogoSection({ className }: { className?: string }) {
  return (
    <section className={classNames(styles.logoSection, className)}>
      <Logo />
    </section>
  );
}
