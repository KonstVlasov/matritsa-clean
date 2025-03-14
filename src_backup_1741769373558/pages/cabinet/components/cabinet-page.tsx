import { useSelector } from 'react-redux';
import { PageRoot } from '#components/page-root';
import { PageFooter } from '#containers/page-footer';
import { PageHeader } from '#containers/page-header';
import { JwtSlice } from '#features/jwt';
import styles from './cabinet-page.m.css';
import { CabinetSection } from './cabinet-section';
import { GuestSection } from './guest-section';

export function CabinetPage() {
  const authorized = useSelector(JwtSlice.selectors.authorized);

  return (
    <PageRoot display='flexColumn'>
      <PageHeader />
      <div className={styles.sectionWrapper}>
        {authorized && <CabinetSection />}
        {!authorized && <GuestSection />}
      </div>
      <PageFooter />
    </PageRoot>
  );
}
