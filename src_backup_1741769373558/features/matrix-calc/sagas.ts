import { call, put, takeLeading } from 'typed-redux-saga';
import { Deps } from '#services';
import { displayError } from '#shared/api';
import { MatrixCalcSlice } from './slice';

export const MatrixCalcSagas = {
  *init(deps: Deps) {
    yield* takeLeading(MatrixCalcSlice.actions.fetch, MatrixCalcSagas.fetch, deps);
  },

  *fetch(deps: Deps, { payload }: ReturnType<typeof MatrixCalcSlice.actions.fetch>) {
    try {
      const response = yield* call(deps.api.getMatrix, payload);

      if (response.ok) {
        yield* put(MatrixCalcSlice.actions.fetchDone({ data: response.data }));
      } else {
        throw response.data;
      }
    } catch (error) {
      yield* put(MatrixCalcSlice.actions.fetchFail({ error: displayError(error) }));
    }
  },
} as const;
