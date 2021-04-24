import { StoredCartItemInterface } from '../../util/interfaces/CartItemInterface';
import { OrderAction } from '../actions';
import produce from 'immer';
import { OrderTypes } from '../action-types';
import { ErrorType } from '../../util/types/ErrorType';
import { PaymentMethod } from '@sin-nombre/sinfood-common';

export interface OrderState {
  cart: {
    items: StoredCartItemInterface[];
    restaurant: string;
  };
  payment_method: PaymentMethod;
  loading: boolean;
  errors: ErrorType;
}

const initialState: OrderState = {
  cart: {
    items: [],
    restaurant: '',
  },
  payment_method: PaymentMethod.CASH,
  loading: false,
  errors: [],
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
      case OrderTypes.UPDATE_CART_ITEM:
        const itemIndex = state.cart.items.findIndex(
          (item) => item.uuid === action.payload.uuid,
        );
        if (itemIndex !== -1) {
          state.cart.items[itemIndex] = action.payload;
        }
        return state;
      case OrderTypes.UPDATE_CART_ITEM_ERROR:
        state.errors = action.payload;
        return state;
      case OrderTypes.SET_ORDER_ERRORS:
        state.errors = action.payload;
        return state;
      case OrderTypes.CLEAR_ORDER_ERRORS:
        state.errors = [];
        state.loading = false;
        return state;
      case OrderTypes.UPDATE_ORDER_PAYMENT_METHOD:
        state.payment_method = action.payload;
        return state;
      default:
        return state;
    }
  },
);

export default reducer;
