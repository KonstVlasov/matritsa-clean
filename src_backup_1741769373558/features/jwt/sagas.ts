import { call, delay, put, select, spawn, takeLeading } from 'typed-redux-saga';
import { Deps } from '#services';
import { JwtData, JwtSlice } from './slice';

const JwtUtil = {
  isExpired(data: JwtData) {
    const expireTimestamp = JSON.parse(atob(data.accessToken.split('.')[1] as string)).exp;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    return currentTimestamp > expireTimestamp;
  },

  expiredIn(data: JwtData): number {
    const expireTimestamp = JSON.parse(atob(data.accessToken.split('.')[1] as string)).exp;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    return Math.max(0, expireTimestamp - currentTimestamp);
  },
};

export const JwtSagas = {
  *init(deps: Deps) {
    yield* call(JwtSagas.defineState, deps);
    yield* spawn(JwtSagas.refreshLoop, deps);
    yield* spawn(JwtSagas.watch);
  },

  *watch() {
    yield* takeLeading(JwtSlice.actions.logout, JwtSagas.logout);
  },

  *defineState(deps: Deps) {
    const existedDataJson = localStorage.getItem('JWT');

    if (!existedDataJson) {
      return;
    }

    const existedData = safeJsonParse(existedDataJson);

    if (!isJwtData(existedData)) {
      localStorage.removeItem('JWT');
      return;
    }

    if (import.meta.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('взяли JWT из хранилища');

      // eslint-disable-next-line no-console
      console.log('токен протух?', JwtUtil.isExpired(existedData));

      // eslint-disable-next-line no-console
      console.log('токен протухнет через', JwtUtil.expiredIn(existedData), 'сек');
    }

    if (JwtUtil.isExpired(existedData)) {
      try {
        const updatedData = yield* call(JwtSagas.refresh, deps, existedData.refreshToken);

        localStorage.setItem('JWT', JSON.stringify(updatedData));

        yield* put(JwtSlice.actions.init({ data: updatedData }));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        localStorage.removeItem('JWT');
        yield* put(JwtSlice.actions.init({ data: null }));
      }
    } else {
      yield* put(JwtSlice.actions.init({ data: existedData }));
    }
  },

  *refresh(deps: Deps, refreshToken: string) {
    const response = yield* call(deps.api.refreshJwt, { refreshToken });

    if (response.ok) {
      const data: JwtData = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      };

      return data;
    } else {
      throw response.data;
    }
  },

  *refreshLoop(deps: Deps) {
    const data = yield* select(JwtSlice.selectors.data);

    if (!data) {
      return;
    }

    const defaultTimeout = 1000 * 60 * 5;

    let timeout = Math.min(defaultTimeout, (JwtUtil.expiredIn(data) * 1000) / 2);
    let refreshToken = data.refreshToken;

    while (true) {
      yield* delay(timeout);

      timeout = defaultTimeout;

      try {
        const data = yield* call(JwtSagas.refresh, deps, refreshToken);

        refreshToken = data.refreshToken;

        localStorage.setItem('JWT', JSON.stringify(data));

        yield* put(JwtSlice.actions.init({ data }));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        break;
      }
    }
  },

  *logout({ payload }: ReturnType<typeof JwtSlice.actions.logout>) {
    yield* put(JwtSlice.actions.init({ data: null }));

    localStorage.removeItem('JWT');

    const reload = payload?.reload ?? true;

    if (reload) {
      window.location.reload();
    }
  },
};

function isJwtData(value: unknown): value is JwtData {
  return (
    typeof value === 'object' &&
    value !== null &&
    'accessToken' in value &&
    typeof value.accessToken === 'string' &&
    'refreshToken' in value &&
    typeof value.refreshToken === 'string'
  );
}

function safeJsonParse(string: string, defaultValue?: any): any {
  try {
    return JSON.parse(string);
  } catch {
    return defaultValue;
  }
}
