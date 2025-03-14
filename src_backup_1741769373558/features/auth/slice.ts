import { createAction, createReducer, createSelector } from '@reduxjs/toolkit';
import { RemoteDataState } from '#shared/types';

export interface AuthState extends RemoteDataState<unknown> {
  fields: {
    email: string;
    password: string;
    passwordAgain: string;
  };
}

const sliceName = 'Auth';

const initialState: AuthState = {
  status: 'initial',
  data: null,
  error: null,
  fields: {
    email: '',
    password: '',
    passwordAgain: '',
  },
};

const actions = {
  fieldsChanged: createAction<Partial<AuthState['fields']>>(`${sliceName}/emailChanged`),
  signIn: createAction(`${sliceName}/signIn`),
  signUp: createAction(`${sliceName}/signUp`),
  fetchDone: createAction(`${sliceName}/fetchDone`),
  fetchFail: createAction<string>(`${sliceName}/fetchFail`),
} as const;

const reducer = createReducer(initialState, ({ addCase }) => {
  addCase(actions.fieldsChanged, (state, { payload }) => {
    state.fields = { ...state.fields, ...payload };
  });

  addCase(actions.signIn, state => {
    state.status = 'fetching';
  });

  addCase(actions.signUp, state => {
    state.status = 'fetching';
  });

  addCase(actions.fetchDone, state => {
    state.status = 'success';
  });

  addCase(actions.fetchFail, (state, { payload }) => {
    state.status = 'failure';
    state.error = payload;
  });
});

const selectors = (() => {
  const selectSlice = (state: { [sliceName]: AuthState }) => state[sliceName];

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

export const AuthSlice = {
  name: sliceName,
  initialState,
  actions,
  reducer,
  selectors,
} as const;
