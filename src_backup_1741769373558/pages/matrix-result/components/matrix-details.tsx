import { MouseEventHandler } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '#components/button';
import { StyledMarkup } from '#components/styled-markup';
import { ItemUsingSlice } from '#features/item-using';
import { JwtSlice } from '#features/jwt';
import { MatrixCalcSlice } from '#features/matrix-calc';
import DownSVG from '#icons/down.svg';
import LockSVG from '#icons/lock.svg';
import { MatrixResult } from '#shared/api';
import styles from './matrix-details.m.css';

export function MatrixDetails({ data }: { data: MatrixResult['transcriptions'] }) {
  const dispatch = useDispatch();

  const calc = useSelector(MatrixCalcSlice.selectors.data);
  const authorized = useSelector(JwtSlice.selectors.authorized);

  const onFullAccessRequest: MouseEventHandler<HTMLAnchorElement> = event => {
    if (!authorized) {
      return;
    }

    if (!calc?.serviceCode) {
      return;
    }

    event.preventDefault();

    dispatch(ItemUsingSlice.actions.fullRequested({ serviceCode: calc?.serviceCode }));
  };

  return (
    <div className={styles.MatrixDetails}>
      {data.map((item, index) => (
        <details key={index} className={styles.item} open={index === 0 ? true : undefined}>
          <summary className={styles.itemSummary}>
            <DownSVG className={styles.itemArrow} />
            <span className={styles.itemTitle}>{item.title}</span>
            {item.is_blocked && <LockSVG />}
          </summary>

          <div className={styles.itemBody}>
            {item.is_blocked ? (
              <div className={styles.itemAccess}>
                <div>Для получения полного доступа к расчету приобретите подписку</div>
                <Button
                  className={styles.accessButton}
                  as='anchor'
                  href='/#pricing'
                  endIcon='arrow'
                  onClick={onFullAccessRequest}
                >
                  Получить полный доступ
                </Button>
              </div>
            ) : (
              item.content?.map((text, index) => (
                <StyledMarkup key={index} dangerouslySetInnerHTML={{ __html: text }} />
              ))
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
