import { createAction, createReducer, createSelector } from '@reduxjs/toolkit';
import { Offer } from '#shared/api';
import { RemoteDataState } from '#shared/types';

export interface CheckoutState extends RemoteDataState<unknown> {
  fields: {
    email: string;
  };
}

const sliceName = 'Checkout';

const initialState: CheckoutState = {
  status: 'initial',
  data: null,
  error: null,
  fields: {
    email: '',
  },
};

const actions = {
  fetch: createAction<Offer>(`${sliceName}/fetch`),
  fetchDone: createAction<{ data: unknown }>(`${sliceName}/fetchDone`),
  fetchFail: createAction<{ error: string }>(`${sliceName}/fetchFail`),
  fieldsChanged: createAction<Partial<CheckoutState['fields']>>(`${sliceName}/fieldsChanged`),
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

  addCase(actions.fieldsChanged, (state, { payload }) => {
    state.status = 'failure';
    state.fields = { ...state.fields, ...payload };
  });
});

const selectors = (() => {
  const selectSlice = (state: { [sliceName]: CheckoutState }) => state[sliceName];

  const selectStatus = createSelector(selectSlice, state => state.status);

  const selectData = createSelector(selectSlice, state => state.data);

  const selectError = createSelector(selectSlice, state => state.error);

  const selectFields = createSelector(selectSlice, state => state.fields);

  return {
    slice: selectSlice,
    status: selectStatus,
    data: selectData,
    error: selectError,
    fields: selectFields,
  };
})();

export const CheckoutSlice = {
  name: sliceName,
  initialState,
  actions,
  reducer,
  selectors,
} as const;
