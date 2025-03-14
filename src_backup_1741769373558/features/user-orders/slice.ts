import { createAction, createReducer, createSelector } from '@reduxjs/toolkit';
import { Order } from '#shared/api';
import { RemoteDataState } from '#shared/types';

export interface OrdersState extends RemoteDataState<Order[]> {}

const sliceName = 'Orders';

const initialState: OrdersState = {
  status: 'initial',
  data: null,
  error: null,
};

const actions = {
  fetch: createAction(`${sliceName}/fetch`),
  fetchDone: createAction<{ data: OrdersState['data'] }>(`${sliceName}/fetchDone`),
  fetchFail: createAction<{ error: OrdersState['error'] }>(`${sliceName}/fetchFail`),
} as const;

const reducer = createReducer(initialState, ({ addCase }) => {
  addCase(actions.fetch, state => {
    state.status = 'fetching';
  });

  addCase(actions.fetchDone, (state, { payload }) => {
    state.status = 'success';
    state.data = payload.data;
  });

  addCase(actions.fetchFail, (state, { payload }) => {
    state.status = 'failure';
    state.error = payload.error;
  });
});

const selectors = (() => {
  const selectSlice = (state: { [sliceName]: OrdersState }) => state[sliceName];

  const selectStatus = createSelector(selectSlice, state => state.status);

  const selectData = createSelector(selectSlice, state => state.data);

  const selectError = createSelector(selectSlice, state => state.error);

  return {
    slice: selectSlice,
    status: selectStatus,
    data: selectData,
    error: selectError,
  };
})();

export const OrdersSlice = {
  name: sliceName,
  initialState,
  actions,
  reducer,
  selectors,
} as const;
