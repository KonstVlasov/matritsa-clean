import { call, put, select, takeLeading } from 'typed-redux-saga';
import { Deps } from '#services';
import { displayError } from '#shared/api';
import { AuthSlice } from './slice';

export const AuthSagas = {
  *init(deps: Deps) {
    yield* takeLeading(AuthSlice.actions.signUp, AuthSagas.signUp, deps);
    yield* takeLeading(AuthSlice.actions.signIn, AuthSagas.signIn, deps);
  },

  *signUp(deps: Deps) {
    try {
      const fields = yield* select(AuthSlice.selectors.fields);
      const response = yield* call(deps.api.signUp, fields);

      if (!response.ok) {
        throw response.data;
      }

      yield* call(AuthSagas.signIn, deps);
    } catch (error) {
      yield* put(AuthSlice.actions.fetchFail(displayError(error)));
    }
  },

  *signIn(deps: Deps) {
    try {
      const fields = yield* select(AuthSlice.selectors.fields);
      const response = yield* call(deps.api.signIn, fields);

      if (!response.ok) {
        throw response.data;
      }

      yield* put(AuthSlice.actions.fetchDone());
      localStorage.setItem(
        'JWT',
        JSON.stringify({
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
        }),
      );
      location.reload();
    } catch (error) {
      yield* put(AuthSlice.actions.fetchFail(displayError(error)));
    }
  },
} as const;
