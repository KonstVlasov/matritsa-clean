import classNames from 'classnames';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageLoading } from '#components/page-loading';
import { PageRoot } from '#components/page-root';
import { PageFooter } from '#containers/page-footer';
import { PageHeader } from '#containers/page-header';
import { ItemUsingSlice } from '#features/item-using';
import { MatrixCalcSlice } from '#features/matrix-calc';
import { MatrixResult, RelationMatrixResult } from '#shared/api';
import {
  parseMatrixCalc,
  parseMatrixChildish,
  parseMatrixFinances,
  parseMatrixPersonal,
  parseMatrixRelation,
} from '#utils/forms';
import { ChakraTable } from './chakra-table';
import { DestinyMatrix } from './destiny-matrix';
import { MatrixDetails } from './matrix-details';
import { MatrixExtras } from './matrix-extras';
import styles from './matrix-result-page.m.css';

export function MatrixResultPage() {
  const dispatch = useDispatch();

  const status = useSelector(MatrixCalcSlice.selectors.status);
  const data = useSelector(MatrixCalcSlice.selectors.data);

  useEffect(() => {
    const data = Object.fromEntries(new URL(window.location.href).searchParams.entries());

    const personal = parseMatrixPersonal(data);
    if (personal) {
      dispatch(
        MatrixCalcSlice.actions.fetch({
          serviceCode: 'PERSONAL_MATRIX',
          ...personal,
        }),
      );
      dispatch(
        ItemUsingSlice.actions.formChanged({
          action: '/matrix-result',
          data: {
            serviceCode: 'PERSONAL_MATRIX',
            ...personal,
          },
        }),
      );
      return;
    }

    const finances = parseMatrixFinances(data);
    if (finances) {
      dispatch(
        MatrixCalcSlice.actions.fetch({
          serviceCode: 'FINANCE_MATRIX',
          ...finances,
        }),
      );
      dispatch(
        ItemUsingSlice.actions.formChanged({
          action: '/matrix-result',
          data: {
            serviceCode: 'FINANCE_MATRIX',
            ...finances,
          },
        }),
      );
      return;
    }

    const childish = parseMatrixChildish(data);
    if (childish) {
      dispatch(
        MatrixCalcSlice.actions.fetch({
          serviceCode: 'CHILDREN_MATRIX',
          ...childish,
        }),
      );
      dispatch(
        ItemUsingSlice.actions.formChanged({
          action: '/matrix-result',
          data: {
            serviceCode: 'CHILDREN_MATRIX',
            ...childish,
          },
        }),
      );
      return;
    }

    const relation = parseMatrixRelation(data);
    if (relation) {
      dispatch(
        MatrixCalcSlice.actions.fetch({
          serviceCode: 'RELATION_MATRIX',
          ...relation,
        }),
      );
      dispatch(
        ItemUsingSlice.actions.formChanged({
          action: '/matrix-result',
          data: {
            serviceCode: 'RELATION_MATRIX',
            ...relation,
          },
        }),
      );
      return;
    }

    const calc = parseMatrixCalc(data);
    if (calc) {
      dispatch(
        MatrixCalcSlice.actions.fetch({
          ...calc,
        }),
      );
      return;
    }
  }, [dispatch]);

  return (
    <PageRoot display='flexColumn'>
      <PageHeader />
      <div className={styles.root}>
        <div className={styles.container}>
          {status === 'fetching' && <PageLoading />}

          {status === 'success' && data && (
            <div className={styles.main}>
              <div className={styles.titleSection}>
                <h2 className={styles.title}>{getSectionTitle(data)}</h2>
              </div>

              {data.serviceCode === 'PERSONAL_MATRIX' && (
                <>
                  <PersonalView data={data} />
                </>
              )}

              {data.serviceCode === 'FINANCE_MATRIX' && (
                <>
                  <FinancesView data={data} />
                </>
              )}

              {data.serviceCode === 'CHILDREN_MATRIX' && (
                <>
                  <ChildishView data={data} />
                </>
              )}

              {data.serviceCode === 'RELATION_MATRIX' && (
                <>
                  <RelationView data={data} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <PageFooter />
    </PageRoot>
  );
}

function getSectionTitle(data: MatrixResult | RelationMatrixResult) {
  if (data.serviceCode === 'PERSONAL_MATRIX') {
    return 'Результаты расчета личной матрицы';
  }
  if (data.serviceCode === 'FINANCE_MATRIX') {
    return 'Результаты расчета финансов';
  }
  if (data.serviceCode === 'CHILDREN_MATRIX') {
    return 'Результаты расчета детской матрицы';
  }
  if (data.serviceCode === 'RELATION_MATRIX') {
    return 'Результаты расчета матрицы совместимости';
  }
  return null;
}

function PersonalView({ data }: { data: MatrixResult }) {
  return (
    <div className={classNames(styles.grid, styles.gridPersonal)}>
      <div className={classNames(styles.gridItem, styles.gridItemMatrix)}>
        <div className={styles.matrixBlock}>
          <DestinyMatrix data={data.calc} />
        </div>

        <div className={styles.bubbles}>
          <div className={styles.bubble}>Дата рождения: {data.birthDate}</div>
        </div>
      </div>

      <div className={classNames(styles.gridItem, styles.gridItemTable)}>
        <ChakraTable data={data.table} />
      </div>

      <div className={classNames(styles.gridItem, styles.gridItemExtras)}>
        <MatrixExtras data={data.calc} />
      </div>

      <div className={classNames(styles.gridItem, styles.gridItemDetails)}>
        <MatrixDetails data={data.transcriptions} />
      </div>
    </div>
  );
}

function FinancesView({ data }: { data: MatrixResult }) {
  return (
    <div className={classNames(styles.grid, styles.gridFinances)}>
      <div className={classNames(styles.gridItem, styles.gridItemMatrix)}>
        <div className={styles.matrixBlock}>
          <DestinyMatrix data={data.calc} />
        </div>

        <div className={styles.bubbles}>
          <div className={styles.bubble}>Дата рождения: {data.birthDate}</div>
        </div>
      </div>

      <div className={classNames(styles.gridItem, styles.gridItemTable)}>
        <MatrixDetails data={data.transcriptions} />
      </div>
    </div>
  );
}

function ChildishView({ data }: { data: MatrixResult }) {
  return (
    <div className={classNames(styles.grid, styles.gridChildish)}>
      <div className={classNames(styles.gridItem, styles.gridItemMatrix)}>
        <div className={styles.matrixBlock}>
          <DestinyMatrix data={data.calc} />
        </div>

        <div className={styles.bubbles}>
          <div className={styles.bubble}>Дата рождения: {data.birthDate}</div>
        </div>
      </div>

      <div className={classNames(styles.gridItem, styles.gridItemExtras)}>
        <MatrixExtras data={data.calc} />
      </div>

      <div className={classNames(styles.gridItem, styles.gridItemTable)}>
        <MatrixDetails data={data.transcriptions} />
      </div>
    </div>
  );
}

function RelationView({ data }: { data: RelationMatrixResult }) {
  return (
    <div className={classNames(styles.grid, styles.gridRelation)}>
      <div className={classNames(styles.gridItem, styles.gridItemMatrix1)}>
        <div className={styles.matrixBlock}>
          <DestinyMatrix data={data.matrixPartner1} />
        </div>
        <div className={styles.bubbles}>
          <div className={styles.bubble}>Партнер 01: {data.name}</div>
          <div className={styles.bubble}>Дата рождения: {data.birthDate}</div>
        </div>
      </div>

      <div className={classNames(styles.gridItem, styles.gridItemMatrix2)}>
        <div className={styles.matrixBlock}>
          <DestinyMatrix data={data.matrixPartner2} />
        </div>
        <div className={styles.bubbles}>
          <div className={styles.bubble}>Партнер 02: {data.name2}</div>
          <div className={styles.bubble}>Дата рождения: {data.birthDate2}</div>
        </div>
      </div>

      <div className={classNames(styles.gridItem, styles.gridItemMatrixCommon)}>
        <div className={styles.matrixBlock}>
          <DestinyMatrix data={data.calc} />
        </div>
      </div>

      <div className={classNames(styles.gridItem, styles.gridItemExtras)}>
        <MatrixExtras data={data.calc} />
      </div>

      <div className={classNames(styles.gridItem, styles.gridItemDetails)}>
        <MatrixDetails data={data.transcriptions} />
      </div>
    </div>
  );
}
