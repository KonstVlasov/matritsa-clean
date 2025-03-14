import { combineReducers } from '@reduxjs/toolkit';
import { AuthSlice } from '#features/auth';
import { CheckoutSlice } from '#features/checkout';
import { ItemUsingSlice } from '#features/item-using';
import { JwtSlice } from '#features/jwt';
import { MatrixCalcSlice } from '#features/matrix-calc';
import { MatrixFormSlice } from '#features/matrix-form';
import { ReviewsSlice } from '#features/reviews';
import { SubscribeSlice } from '#features/subscribe/slice';
import { TaroCalcSlice } from '#features/taro-calc';
import { TaroFormSlice } from '#features/taro-form';
import { UiSlice } from '#features/ui';
import { UserSlice } from '#features/user';
import { CalculationsSlice } from '#features/user-calcs';
import { ItemsSlice } from '#features/user-items';
import { OrdersSlice } from '#features/user-orders';

export const reducer = combineReducers({
  [JwtSlice.name]: JwtSlice.reducer,
  [UiSlice.name]: UiSlice.reducer,
  [AuthSlice.name]: AuthSlice.reducer,
  [MatrixFormSlice.name]: MatrixFormSlice.reducer,
  [TaroFormSlice.name]: TaroFormSlice.reducer,
  [UserSlice.name]: UserSlice.reducer,
  [MatrixCalcSlice.name]: MatrixCalcSlice.reducer,
  [TaroCalcSlice.name]: TaroCalcSlice.reducer,
  [SubscribeSlice.name]: SubscribeSlice.reducer,
  [ReviewsSlice.name]: ReviewsSlice.reducer,
  [CheckoutSlice.name]: CheckoutSlice.reducer,
  [CalculationsSlice.name]: CalculationsSlice.reducer,
  [ItemsSlice.name]: ItemsSlice.reducer,
  [OrdersSlice.name]: OrdersSlice.reducer,
  [ItemUsingSlice.name]: ItemUsingSlice.reducer,
});
