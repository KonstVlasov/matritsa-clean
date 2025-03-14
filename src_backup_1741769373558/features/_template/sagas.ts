import { call, put, takeLeading } from 'typed-redux-saga';
import { Deps } from '#services';
import { displayError } from '#shared/api';
import { parseResponse } from '#shared/fetch';
import { SomethingSlice } from './slice';

export const SomethingSagas = {
  *init(deps: Deps) {
    yield* takeLeading(SomethingSlice.actions.fetch, SomethingSagas.fetch, deps);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  *fetch(deps: Deps, { payload }: ReturnType<typeof SomethingSlice.actions.fetch>) {
    try {
      const response = yield* call(() => fetch('hello').then(parseResponse));

      if (response.ok) {
        yield* put(SomethingSlice.actions.fetchDone({ data: response.data }));
      } else {
        throw response.data;
      }
    } catch (error) {
      yield* put(SomethingSlice.actions.fetchFail({ error: displayError(error) }));
    }
  },
} as const;
