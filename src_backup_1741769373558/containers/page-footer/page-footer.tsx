import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Logo } from '#components/logo';
import {
  PageFooter as Footer,
  FooterItem,
  FooterList,
  FooterListItem,
  FooterSubscribeForm,
} from '#components/page-footer';
import { SubscribeSlice } from '#features/subscribe/slice';
import styles from './page-footer.m.css';

export function PageFooter() {
  const dispatch = useDispatch();
  const { email } = useSelector(SubscribeSlice.selectors.fields);
  const status = useSelector(SubscribeSlice.selectors.status);
  const error = useSelector(SubscribeSlice.selectors.error);

  return (
    <Footer>
      <FooterItem>
        <Logo textColor='inherit' textTransform='capitalize' lineBreaks={false} />
        <p className={styles.slogan}>
          ИП Власов Константин Сергеевич
          <br />
          ОГРНИП 315619600049891
          <br />
          ИНН 611392546995
        </p>
      </FooterItem>

      <FooterItem blockTitle='Контакты'>
        <FooterList>
          <FooterListItem>
            <a href=''>Telegram</a>
          </FooterListItem>
          <FooterListItem>
            <a href=''>VK</a>
          </FooterListItem>
        </FooterList>
      </FooterItem>

      <FooterItem blockTitle='Новости и акции'>
        <FooterSubscribeForm
          email={email}
          onEmailChange={value => {
            dispatch(SubscribeSlice.actions.fieldsChanged({ email: value }));
          }}
          onSubmit={() => {
            dispatch(SubscribeSlice.actions.fetch());
          }}
          disabled={status === 'fetching'}
          error={error}
          detailsHref='/public/docs/persona-data-processing.pdf'
        />

        <div className={styles.links}>
          <a
            className={classNames(styles.link, styles.underlined)}
            href='/public/docs/privacy-policy.pdf'
          >
            Политика конфиденциальности
          </a>
          <br />
          <a
            className={classNames(styles.link, styles.underlined)}
            href='/public/docs/public-offer.pdf'
          >
            Пользовательское соглашение
          </a>
        </div>

        <div className={styles.links}>
          По всем вопросам обращаться на элеĸтронную почту{' '}
          <a
            className={classNames(styles.link, styles.underlined)}
            href='email:support@matritsa-taro.ru'
          >
            support@matritsa-taro.ru
          </a>
        </div>
      </FooterItem>
    </Footer>
  );
}
