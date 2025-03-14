import { call, put, select, takeLeading } from 'typed-redux-saga';
import { Deps } from '#services';
import { Profile, displayError } from '#shared/api';
import { UserFormFields, UserSlice } from './slice';

export const UserSagas = {
  *init(deps: Deps) {
    yield* takeLeading(UserSlice.actions.fetch, UserSagas.fetch, deps);
    yield* takeLeading(UserSlice.actions.submitForm, UserSagas.submit, deps);
  },

  *fetch(deps: Deps) {
    try {
      const response = yield* call(deps.api.getUserData);

      if (response.ok) {
        yield* put(
          UserSlice.actions.fieldsUpdated({
            ...pickFormFields(response.data),
            forceChanged: false,
          }),
        );
        yield* put(UserSlice.actions.fetchDone({ data: response.data }));
      } else {
        throw response.data;
      }
    } catch (error) {
      yield* put(UserSlice.actions.fetchFail({ error: displayError(error) }));
    }
  },

  *submit(deps: Deps) {
    const formData = yield* select(UserSlice.selectors.fields);

    try {
      const response = yield* call(deps.api.updateUserData, formData);

      if (response.ok) {
        yield* put(UserSlice.actions.fetchDone({ data: response.data }));
        yield* put(
          UserSlice.actions.fieldsUpdated({
            ...pickFormFields(response.data),
            forceChanged: false,
          }),
        );
      } else {
        throw response.data;
      }
    } catch (error) {
      yield* put(UserSlice.actions.fetchFail({ error: displayError(error) }));
    }
  },
} as const;

function pickFormFields(data: Profile): UserFormFields {
  return {
    name: data.name ?? '',
    sex: data.sex ?? '',
    birthDate: data.birthDate ?? '',
    phone: data.phone ?? '',
    partnerName: data.partnerName ?? '',
    partnerBirthDate: data.partnerBirthDate ?? '',
  };
}
