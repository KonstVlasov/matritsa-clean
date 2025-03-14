import { call, put, select, takeLeading } from 'typed-redux-saga';
import { Deps } from '#services';
import { displayError } from '#shared/api';
import { CheckoutSlice } from './slice';

export const CheckoutSagas = {
  *init(deps: Deps) {
    yield* takeLeading(CheckoutSlice.actions.fetch, CheckoutSagas.fetch, deps);
  },

  *fetch(deps: Deps, { payload }: ReturnType<typeof CheckoutSlice.actions.fetch>) {
    try {
      const { email } = yield* select(CheckoutSlice.selectors.fields);
      const response = yield* call(deps.api.checkout, { offerId: payload.id, email });

      if (response.ok) {
        yield* put(CheckoutSlice.actions.fetchDone({ data: response.data }));
        window.location.assign(response.data.redirectUri);
      } else {
        throw response.data;
      }
    } catch (error) {
      yield* put(CheckoutSlice.actions.fetchFail({ error: displayError(error) }));
    }
  },
} as const;
