import { StoredCartItemInterface } from '../../util/interfaces/CartItemInterface';
import { OrderAction } from '../actions';
import produce from 'immer';
import { OrderTypes } from '../action-types';

interface OrderState {
  cart: {
    items: StoredCartItemInterface[];
    restaurant: string;
  };
}

const initialState: OrderState = {
  cart: {
    items: [],
    restaurant: '',
  },
};

const reducer = produce(
  (state: OrderState = initialState, action: OrderAction): OrderState => {
    switch (action.type) {
      case OrderTypes.ADD_ITEM_TO_CART:
        state.cart = action.payload;
        return state;
      case OrderTypes.REMOVE_ITEM_FROM_CART:
        state.cart.items = state.cart.items.filter(
          (item) => item.uuid !== action.payload,
        );
        return state;
      case OrderTypes.INITIALIZE_CART_DATA:
        state.cart = action.payload;
        return state;
      case OrderTypes.CLEAR_CART_DATA:
        state.cart = initialState.cart;
        return state;
      default:
        return state;
    }
  },
);

export default reducer;
