import { createAction, createReducer, createSelector } from '@reduxjs/toolkit';
import {
  MatrixPayload,
  MatrixResult,
  RelationMatrixPayload,
  RelationMatrixResult,
} from '#shared/api';
import { RemoteDataState } from '#shared/types';

export interface MatrixCalcState extends RemoteDataState<MatrixResult | RelationMatrixResult> {}

const sliceName = 'MatrixCalc';

const initialState: MatrixCalcState = {
  status: 'initial',
  data: null,
  error: null,
};

const actions = {
  fetch: createAction<MatrixPayload | RelationMatrixPayload | { matrixCalcId: number }>(
    `${sliceName}/fetch`,
  ),

  fetchDone: createAction<{ data: MatrixCalcState['data'] }>(`${sliceName}/fetchDone`),

  fetchFail: createAction<{ error: MatrixCalcState['error'] }>(`${sliceName}/fetchFail`),
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
  const selectSlice = (state: { [sliceName]: MatrixCalcState }) => state[sliceName];

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

export const MatrixCalcSlice = {
  name: sliceName,
  initialState,
  actions,
  reducer,
  selectors,
};
