import { put } from 'typed-redux-saga';
import { MatrixFormSlice } from './slice';

export const MatrixFormSagas = {
  *init() {
    const typeFromQuery = new URL(window.location.href).searchParams.get('matrix-type');

    if (
      typeFromQuery === 'personal' ||
      typeFromQuery === 'relation' ||
      typeFromQuery === 'finances' ||
      typeFromQuery === 'childish'
    ) {
      yield* put(MatrixFormSlice.actions.typeChanged({ formType: typeFromQuery }));
    }
  },
};
