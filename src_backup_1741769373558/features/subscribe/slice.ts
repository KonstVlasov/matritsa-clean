import { createAction, createReducer, createSelector } from '@reduxjs/toolkit';
import { RemoteDataState } from '#shared/types';

export interface SubscribeState extends RemoteDataState<unknown> {
  fields: {
    email: string;
  };
}

const sliceName = 'Subscribe';

const initialState: SubscribeState = {
  status: 'initial',
  data: null,
  error: null,
  fields: {
    email: '',
  },
};

const actions = {
  fetch: createAction(`${sliceName}/fetch`),
  fetchDone: createAction<{ data: unknown }>(`${sliceName}/fetchDone`),
  fetchFail: createAction<{ error: string }>(`${sliceName}/fetchFail`),
  fieldsChanged: createAction<{ email: string }>(`${sliceName}/fieldsChanged`),
} as const;

const reducer = createReducer(initialState, ({ addCase }) => {
  addCase(actions.fetch, state => {
    state.status = 'fetching';
  });

  addCase(actions.fetchDone, (state, { payload }) => {
    state.status = 'success';
    state.data = payload.data;
    state.error = null;
    state.fields.email = '';
  });

  addCase(actions.fetchFail, (state, { payload }) => {
    state.status = 'failure';
    state.error = payload.error;
  });

  addCase(actions.fieldsChanged, (state, { payload }) => {
    state.fields.email = payload.email;
  });
});

const selectors = (() => {
  const selectSlice = (state: { [sliceName]: SubscribeState }) => state[sliceName];

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

export const SubscribeSlice = {
  name: sliceName,
  initialState,
  actions,
  reducer,
  selectors,
} as const;
