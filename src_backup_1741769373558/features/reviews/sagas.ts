import { call, put, takeLeading } from 'typed-redux-saga';
import { Deps } from '#services';
import { displayError } from '#shared/api';
import { ReviewsSlice } from './slice';

export const ReviewsSagas = {
  *init(deps: Deps) {
    yield* takeLeading(ReviewsSlice.actions.fetch, ReviewsSagas.fetch, deps);
  },

  *fetch(deps: Deps) {
    try {
      const response = yield* call(deps.api.getReviews);

      if (response.ok) {
        yield* put(ReviewsSlice.actions.fetchDone({ data: response.data }));
      } else {
        throw response.data;
      }
    } catch (error) {
      yield* put(ReviewsSlice.actions.fetchFail({ error: displayError(error) }));
    }
  },
} as const;
