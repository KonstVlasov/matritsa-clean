import { createAction, createReducer, createSelector } from '@reduxjs/toolkit';
import { Status } from '#shared/types';

export interface JwtData {
  accessToken: string;
  refreshToken: string;
}

export interface JwtState {
  data: null | JwtData;
  status: Status;
}

const sliceName = 'JWT';

const initialState: JwtState = {
  data: null,
  status: 'initial',
};

const actions = {
  init: createAction<{ data: JwtData | null }>(`${sliceName}/init`),
  logout: createAction<undefined | { reload?: boolean }>(`${sliceName}/logout`),
} as const;

const reducer = createReducer(initialState, ({ addCase }) => {
  addCase(actions.init, (state, { payload }) => {
    state.data = payload.data;
    state.status = 'success';
  });
});

const selectors = (() => {
  const selectSlice = (state: { [sliceName]: JwtState }): JwtState => {
    return state[sliceName];
  };

  const selectData = createSelector(selectSlice, state => state.data);

  const selectAuthorized = createSelector(
    selectSlice,
    state => state.status === 'success' && state.data !== null,
  );

  return {
    slice: selectSlice,
    data: selectData,
    authorized: selectAuthorized,
  };
})();

export const JwtSlice = {
  name: sliceName,
  initialState,
  actions,
  reducer,
  selectors,
} as const;
