import { RootState } from '../reducers';
import { createSelector } from 'reselect';
import { OrderState } from '../reducers/orderReducer';

export const selectOrder = (state: RootState): OrderState => state.order!;

export const selectCartItems = createSelector(
  selectOrder,
  (order) => order.cart.items,
);

export const selectCartData = createSelector(
  selectOrder,
  (order) => order.cart,
);

export const selectCartTotalPrice = createSelector(selectCartItems, (items) =>
  items.reduce((acc, cur) => {
    acc += cur.item_options.price;
    return acc;
  }, 0),
);

export const selectOrderErrors = createSelector(
  selectOrder,
  (order) => order.errors,
);

export const selectOrderPaymentMethod = createSelector(
  selectOrder,
  (order) => order.payment_method,
);
