import { MatrixFormType } from './slice';

export { type MatrixFormState, type MatrixFormType, MatrixFormSlice } from './slice';
export { MatrixFormSagas } from './sagas';

export function isMatrixType(value: unknown): value is MatrixFormType {
  return (
    value === 'personal' || value === 'relation' || value === 'finances' || value === 'childish'
  );
}
