import { PageRoot } from '#components/page-root';
import { PageFooter } from '#containers/page-footer';
import { PageHeader } from '#containers/page-header';
import { AboutTaroSection } from './about-taro-section';
import { BlogSection } from './blog-section';
import { HeroSection } from './hero-section';
import { HowItWorksSection } from './how-it-works-section';
import { LogoSection } from './logo-section';
import styles from './main-page.m.css';
import { MatrixInfoSection } from './matrix-info-section';
import { MatrixSection } from './matrix-section';
import { PricingSection } from './pricing-section';
import { ReviewSection } from './review-section';
import { SelectServiceSection } from './select-service-section';
import { TaroSection } from './taro-section';

export function MainPage() {
  return (
    <PageRoot>
      <PageHeader />

      <div className={styles.bg}>
        <LogoSection className={styles.logoSection} />

        <HeroSection />

        <MatrixInfoSection />
      </div>

      <MatrixSection id='matrix' />

      <HowItWorksSection id='how-it-works' />

      <AboutTaroSection id='about-taro' />

      <SelectServiceSection id='taro-variants' />

      <TaroSection id='taro' />

      <BlogSection id='blog' />

      <PricingSection id='pricing' />

      <ReviewSection />

      <PageFooter />
    </PageRoot>
  );
}
