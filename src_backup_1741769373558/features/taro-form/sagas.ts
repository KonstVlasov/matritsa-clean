import { call, put, takeLeading } from 'typed-redux-saga';
import { Deps } from '#services';
import { displayError } from '#shared/api';
import { TaroFormSlice } from './slice';

export const TaroFormSagas = {
  *init(deps: Deps) {
    yield* call(TaroFormSagas.handleSearchParams);
    yield* takeLeading(TaroFormSlice.actions.fetch, TaroFormSagas.fetch, deps);

    yield* put(TaroFormSlice.actions.fetch());
  },

  *handleSearchParams() {
    const typeFromQuery = new URL(window.location.href).searchParams.get('taro-type');

    if (
      typeFromQuery === 'classic' ||
      typeFromQuery === 'yes-no' ||
      typeFromQuery === 'three-cards'
    ) {
      yield* put(TaroFormSlice.actions.typeChanged({ formType: typeFromQuery }));
    }
  },

  *fetch(deps: Deps) {
    try {
      const response = yield* call(deps.api.getTaroCards);

      if (response.ok) {
        yield* put(TaroFormSlice.actions.fetchDone({ data: response.data }));
      } else {
        throw response.data;
      }
    } catch (error) {
      yield* put(TaroFormSlice.actions.fetchFail({ error: displayError(error) }));
    }
  },
};
