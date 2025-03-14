import { call, put, takeLeading } from 'typed-redux-saga';
import { Deps } from '#services';
import { displayError } from '#shared/api';
import { TaroCalcSlice } from './slice';

export const TaroCalcSagas = {
  *init(deps: Deps) {
    yield* takeLeading(TaroCalcSlice.actions.fetch, TaroCalcSagas.fetch, deps);
  },

  *fetch(deps: Deps, { payload }: ReturnType<typeof TaroCalcSlice.actions.fetch>) {
    try {
      const response = yield* call(deps.api.getTaro, payload);

      if (response.ok) {
        yield* put(TaroCalcSlice.actions.fetchDone({ data: response.data }));
      } else {
        throw response.data;
      }
    } catch (error) {
      yield* put(TaroCalcSlice.actions.fetchFail({ error: displayError(error) }));
    }
  },
} as const;
