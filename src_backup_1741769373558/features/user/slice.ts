import { createAction, createReducer, createSelector } from '@reduxjs/toolkit';
import { Profile } from '#shared/api';
import { RemoteDataState } from '#shared/types';

export type FieldName = Extract<
  keyof Profile,
  'name' | 'phone' | 'birthDate' | 'partnerName' | 'partnerBirthDate' | 'sex'
>;

export type UserFormFields = Record<FieldName, string>;

export interface UserState extends RemoteDataState<Profile> {
  fields: UserFormFields;
  fieldsChanged: boolean;
}

const sliceName = 'User';

const initialState: UserState = {
  status: 'initial',
  data: null,
  fields: {
    phone: '',
    name: '',
    birthDate: '',
    sex: '',
    partnerName: '',
    partnerBirthDate: '',
  },
  fieldsChanged: false,
  error: null,
};

const actions = {
  fetch: createAction(`${sliceName}/fetch`),
  fetchDone: createAction<{ data: Profile }>(`${sliceName}/fetchDone`),
  fetchFail: createAction<{ error: string }>(`${sliceName}/fetchFail`),
  fieldsUpdated: createAction<
    Partial<UserFormFields> & { silent?: boolean; forceChanged?: boolean }
  >(`${sliceName}/fieldsUpdated`),
  fieldsReset: createAction(`${sliceName}/fieldsReset`),
  submitForm: createAction(`${sliceName}/submitForm`),
} as const;

const reducer = createReducer(initialState, ({ addCase }) => {
  addCase(actions.fetch, state => {
    state.status = 'fetching';
  });

  addCase(actions.submitForm, state => {
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

  addCase(actions.fieldsUpdated, (state, { payload }) => {
    const { silent = false, forceChanged = true, ...newFields } = payload;
    state.fields = { ...state.fields, ...newFields };

    if (!silent) {
      state.fieldsChanged = forceChanged;
    }
  });

  addCase(actions.fieldsReset, state => {
    const source = state.data ?? initialState.fields;

    for (const key of Object.keys(state.fields) as Array<keyof UserState['fields']>) {
      (state.fields as any)[key] = source[key] || '';
    }

    state.fieldsChanged = false;
  });
});

const selectors = (() => {
  const selectSlice = (state: { [sliceName]: UserState }) => state[sliceName];

  const selectStatus = createSelector(selectSlice, state => state.status);

  const selectData = createSelector(selectSlice, state => state.data);

  const selectError = createSelector(selectSlice, state => state.error);

  const selectFields = createSelector(selectSlice, state => state.fields);

  const selectFieldsChanged = createSelector(selectSlice, state => state.fieldsChanged);

  return {
    slice: selectSlice,
    status: selectStatus,
    data: selectData,
    error: selectError,
    fields: selectFields,
    fieldsChanged: selectFieldsChanged,
  };
})();

export const UserSlice = {
  name: sliceName,
  initialState,
  actions,
  reducer,
  selectors,
} as const;
