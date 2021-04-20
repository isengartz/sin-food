import { OrderTypes } from '../action-types';
import { StoredCartItemInterface } from '../../util/interfaces/CartItemInterface';

export type OrderAction =
  | AddItemToCartAction
  | RemoveItemFromCartAction
  | InitializeOrderDataAction
  | ClearCartDataAction;

export interface AddItemToCartAction {
  type: OrderTypes.ADD_ITEM_TO_CART;
  payload: { items: StoredCartItemInterface[]; restaurant: string };
}

export interface RemoveItemFromCartAction {
  type: OrderTypes.REMOVE_ITEM_FROM_CART;
  payload: string;
}

export interface InitializeOrderDataAction {
  type: OrderTypes.INITIALIZE_CART_DATA;
  payload: { items: StoredCartItemInterface[]; restaurant: string };
}

export interface ClearCartDataAction {
  type: OrderTypes.CLEAR_CART_DATA;
}
