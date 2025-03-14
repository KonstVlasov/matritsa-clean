import { call, put, takeLeading } from 'typed-redux-saga';
import { Deps } from '#services';
import { displayError } from '#shared/api';
import { CalculationsSlice } from './slice';

export const CalculationsSagas = {
  *init(deps: Deps) {
    yield* takeLeading(CalculationsSlice.actions.fetch, CalculationsSagas.fetch, deps);
  },

  *fetch(deps: Deps) {
    try {
      const response = yield* call(deps.api.getUserCalculations);

      if (response.ok) {
        yield* put(CalculationsSlice.actions.fetchDone({ data: response.data }));
      } else {
        throw response.data;
      }
    } catch (error) {
      yield* put(CalculationsSlice.actions.fetchFail({ error: displayError(error) }));
    }
  },
} as const;
