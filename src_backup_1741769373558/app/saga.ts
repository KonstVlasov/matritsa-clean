import { call, fork } from 'typed-redux-saga';
import { AuthSagas } from '#features/auth';
import { CheckoutSagas } from '#features/checkout';
import { ItemUsingSagas } from '#features/item-using';
import { JwtSagas } from '#features/jwt';
import { MatrixCalcSagas } from '#features/matrix-calc';
import { MatrixFormSagas } from '#features/matrix-form';
import { ReviewsSagas } from '#features/reviews';
import { SubscribeSagas } from '#features/subscribe/sagas';
import { TaroCalcSagas } from '#features/taro-calc';
import { TaroFormSagas } from '#features/taro-form';
import { UserSagas } from '#features/user';
import { CalculationsSagas } from '#features/user-calcs';
import { ItemsSagas } from '#features/user-items';
import { OrdersSagas } from '#features/user-orders';
import { Deps } from '#services';

export function* appSaga(deps: Deps) {
  // eslint-disable-next-line no-console
  console.log('saga started');

  // blocking
  yield* call(JwtSagas.init, deps);

  // non blocking
  yield* fork(AuthSagas.init, deps);
  yield* fork(MatrixFormSagas.init, deps);
  yield* fork(TaroFormSagas.init, deps);
  yield* fork(UserSagas.init, deps);
  yield* fork(MatrixCalcSagas.init, deps);
  yield* fork(TaroCalcSagas.init, deps);
  yield* fork(SubscribeSagas.init, deps);
  yield* fork(ReviewsSagas.init, deps);
  yield* fork(CheckoutSagas.init, deps);
  yield* fork(CalculationsSagas.init, deps);
  yield* fork(ItemsSagas.init, deps);
  yield* fork(OrdersSagas.init, deps);
  yield* fork(ItemUsingSagas.init, deps);
}
