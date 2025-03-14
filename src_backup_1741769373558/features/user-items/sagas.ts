import { call, put, takeLeading } from 'typed-redux-saga';
import { Deps } from '#services';
import { displayError } from '#shared/api';
import { ItemsSlice } from './slice';

export const ItemsSagas = {
  *init(deps: Deps) {
    yield* takeLeading(ItemsSlice.actions.fetch, ItemsSagas.fetch, deps);
  },

  *fetch(deps: Deps, { payload }: ReturnType<typeof ItemsSlice.actions.fetch>) {
    try {
      const response = yield* call(deps.api.getUserItems, payload);

      if (response.ok) {
        yield* put(ItemsSlice.actions.fetchDone({ data: response.data }));
      } else {
        throw response.data;
      }
    } catch (error) {
      yield* put(ItemsSlice.actions.fetchFail({ error: displayError(error) }));
    }
  },
} as const;
