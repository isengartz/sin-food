import { RootState } from '../reducers';
import { createSelector } from 'reselect';

export const selectOrder = (state: RootState) => state.order;

export const selectCartItems = createSelector(
  selectOrder,
  (order) => order.cart.items,
);

export const selectCartTotalPrice = createSelector(selectCartItems, (items) =>
  items.reduce((acc, cur) => {
    acc += cur.item_options.price;
    return acc;
  }, 0),
);
