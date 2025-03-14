import { createAction, createReducer, createSelector } from '@reduxjs/toolkit';
import { MatrixPayload, RelationMatrixPayload, ServiceCode, TaroPayload } from '#shared/api';
import { RemoteDataState } from '#shared/types';

interface FormDetails {
  action: string;
  data: MatrixPayload | RelationMatrixPayload | TaroPayload;
}

export interface ItemUsingState extends RemoteDataState<unknown> {
  form: null | FormDetails;
}

const sliceName = 'ItemUsing';

const initialState: ItemUsingState = {
  status: 'initial',
  data: null,
  error: null,
  form: null,
};

const actions = {
  fetch: createAction<{ userItemId: number }>(`${sliceName}/fetch`),
  fetchDone: createAction<{ data: ItemUsingState['data'] }>(`${sliceName}/fetchDone`),
  fetchFail: createAction<{ error: ItemUsingState['error'] }>(`${sliceName}/fetchFail`),

  formChanged: createAction<FormDetails>(`${sliceName}/formChanged`),
  formSubmit: createAction<{ formKind: 'matrix' | 'taro'; form: FormDetails }>(
    `${sliceName}/formSubmit`,
  ),
  fullRequested: createAction<{ serviceCode: ServiceCode }>(`${sliceName}/fullRequested`),
  freeChosen: createAction(`${sliceName}/freeChosen`),
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

  addCase(actions.formChanged, (state, { payload }) => {
    state.status = 'failure';
    state.form = payload;
  });

  addCase(actions.formSubmit, (state, { payload }) => {
    state.status = 'failure';
    state.form = payload.form;
  });
});

const selectors = (() => {
  const selectSlice = (state: { [sliceName]: ItemUsingState }) => state[sliceName];

  const selectStatus = createSelector(selectSlice, state => state.status);

  const selectData = createSelector(selectSlice, state => state.data);

  const selectError = createSelector(selectSlice, state => state.error);

  const selectForm = createSelector(selectSlice, state => state.form);

  return {
    slice: selectSlice,
    status: selectStatus,
    data: selectData,
    error: selectError,
    form: selectForm,
  };
})();

export const ItemUsingSlice = {
  name: sliceName,
  initialState,
  actions,
  reducer,
  selectors,
} as const;
