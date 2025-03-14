import { createAction, createReducer, createSelector } from '@reduxjs/toolkit';
import { TaroPayload, TaroResult } from '#shared/api';
import { RemoteDataState } from '#shared/types';

export interface TaroCalcState extends RemoteDataState<TaroResult> {}

const sliceName = 'TaroCalc';

const initialState: TaroCalcState = {
  status: 'initial',
  data: null,
  error: null,
};

const actions = {
  fetch: createAction<TaroPayload | { taroCalcId: number }>(`${sliceName}/fetch`),

  fetchDone: createAction<{ data: TaroCalcState['data'] }>(`${sliceName}/fetchDone`),

  fetchFail: createAction<{ error: TaroCalcState['error'] }>(`${sliceName}/fetchFail`),
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
  const selectSlice = (state: { [sliceName]: TaroCalcState }) => state[sliceName];

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

export const TaroCalcSlice = {
  name: sliceName,
  initialState,
  actions,
  reducer,
  selectors,
} as const;
