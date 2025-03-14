import { createAction, createReducer, createSelector } from '@reduxjs/toolkit';

export type MatrixFormType = 'personal' | 'relation' | 'finances' | 'childish';

export interface MatrixFormState {
  formType: MatrixFormType;
}

const sliceName = 'MatrixForm';

const initialState: MatrixFormState = {
  formType: 'personal',
};

const actions = {
  typeChanged: createAction<{ formType: MatrixFormType }>(`${sliceName}/typeChanged`),
} as const;

const reducer = createReducer(initialState, ({ addCase }) => {
  addCase(actions.typeChanged, (state, { payload }) => {
    state.formType = payload.formType;
  });
});

const selectors = (() => {
  const selectSlice = (state: { [sliceName]: MatrixFormState }): MatrixFormState => {
    return state[sliceName];
  };

  const selectFormType = createSelector(selectSlice, state => {
    return state.formType;
  });

  return {
    slice: selectSlice,
    formType: selectFormType,
  };
})();

export const MatrixFormSlice = {
  name: sliceName,
  initialState,
  actions,
  reducer,
  selectors,
} as const;
