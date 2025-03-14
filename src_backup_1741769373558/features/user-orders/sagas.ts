import { call, put, takeLeading } from 'typed-redux-saga';
import { Deps } from '#services';
import { displayError } from '#shared/api';
import { OrdersSlice } from './slice';

export const OrdersSagas = {
  *init(deps: Deps) {
    yield* takeLeading(OrdersSlice.actions.fetch, OrdersSagas.fetch, deps);
  },

  *fetch(deps: Deps) {
    try {
      const response = yield* call(deps.api.getUserOrders);

      if (response.ok) {
        yield* put(OrdersSlice.actions.fetchDone({ data: response.data }));
      } else {
        throw response.data;
      }
    } catch (error) {
      yield* put(OrdersSlice.actions.fetchFail({ error: displayError(error) }));
    }
  },
} as const;
