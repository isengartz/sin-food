import { OrderTypes } from '../action-types';
import { StoredCartItemInterface } from '../../util/interfaces/CartItemInterface';
import { ErrorType } from '../../util/types/ErrorType';

export type OrderAction =
  | AddItemToCartAction
  | RemoveItemFromCartAction
  | InitializeOrderDataAction
  | ClearCartDataAction
  | UpdateCartItemAction
  | UpdateCartItemErrorAction;

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

export interface UpdateCartItemAction {
  type: OrderTypes.UPDATE_CART_ITEM;
  payload: StoredCartItemInterface;
}

export interface UpdateCartItemErrorAction {
  type: OrderTypes.UPDATE_CART_ITEM_ERROR;
  payload: ErrorType;
}
