import { createAction, createReducer, createSelector } from '@reduxjs/toolkit';
import { Review } from '#shared/api';
import { RemoteDataState } from '#shared/types';

export interface ReviewsState extends RemoteDataState<Review[]> {}

const sliceName = 'Reviews';

const initialState: ReviewsState = {
  status: 'initial',
  data: null,
  error: null,
};

const actions = {
  fetch: createAction(`${sliceName}/fetch`),
  fetchDone: createAction<{ data: Review[] }>(`${sliceName}/fetchDone`),
  fetchFail: createAction<{ error: string }>(`${sliceName}/fetchFail`),
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
  const selectSlice = (state: { [sliceName]: ReviewsState }) => state[sliceName];

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

export const ReviewsSlice = {
  name: sliceName,
  initialState,
  actions,
  reducer,
  selectors,
} as const;
