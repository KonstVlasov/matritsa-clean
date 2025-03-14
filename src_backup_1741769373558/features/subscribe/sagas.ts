import { call, put, select, takeLeading } from 'typed-redux-saga';
import { UiSlice } from '#features/ui';
import { Deps } from '#services';
import { displayError } from '#shared/api';
import { SubscribeSlice } from './slice';

export const SubscribeSagas = {
  *init(deps: Deps) {
    yield* takeLeading(SubscribeSlice.actions.fetch, SubscribeSagas.submit, deps);
  },

  *submit(deps: Deps) {
    try {
      const { email } = yield* select(SubscribeSlice.selectors.fields);
      const response = yield* call(deps.api.subscribe, { email });

      if (response.ok) {
        yield* put(SubscribeSlice.actions.fetchDone({ data: response.data }));
        yield* put(UiSlice.actions.modalOpen({ modalType: 'subscribeDone' }));
      } else {
        throw response.data;
      }
    } catch (error) {
      yield* put(SubscribeSlice.actions.fetchFail({ error: displayError(error) }));
    }
  },
} as const;
