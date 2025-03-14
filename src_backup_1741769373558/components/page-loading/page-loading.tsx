import { Spinner } from '#components/spinner';
import styles from './page-loading.m.css';

export function PageLoading() {
  return (
    <div className={styles.loading}>
      <Spinner />
    </div>
  );
}
