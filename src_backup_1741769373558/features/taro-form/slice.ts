import { createAction, createReducer, createSelector } from '@reduxjs/toolkit';
import { TaroCard } from '#shared/api';
import { RemoteDataState } from '#shared/types';

export type TaroFormType = 'classic' | 'yes-no' | 'three-cards' | null;

export interface TaroFormState extends RemoteDataState<TaroCard[]> {
  formType: TaroFormType;
}

const sliceName = 'TaroForm';

const initialState: TaroFormState = {
  formType: null,

  status: 'initial',
  data: null,
  error: null,
};

const actions = {
  typeChanged: createAction<{ formType: TaroFormType }>(`${sliceName}/typeChanged`),
  fetch: createAction(`${sliceName}/fetch`),
  fetchDone: createAction<{ data: TaroFormState['data'] }>(`${sliceName}/fetchDone`),
  fetchFail: createAction<{ error: TaroFormState['error'] }>(`${sliceName}/fetchFail`),
} as const;

const reducer = createReducer(initialState, ({ addCase }) => {
  addCase(actions.typeChanged, (state, { payload }) => {
    state.formType = payload.formType;
  });

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
  const selectSlice = (state: { [sliceName]: TaroFormState }): TaroFormState => {
    return state[sliceName];
  };

  const selectStatus = createSelector(selectSlice, state => state.status);

  const selectData = createSelector(selectSlice, state => state.data);

  const selectError = createSelector(selectSlice, state => state.error);

  const selectFormType = createSelector(selectSlice, state => {
    return state.formType;
  });

  return {
    slice: selectSlice,
    formType: selectFormType,
    status: selectStatus,
    data: selectData,
    error: selectError,
  };
})();

export const TaroFormSlice = {
  name: sliceName,
  initialState,
  actions,
  reducer,
  selectors,
} as const;
