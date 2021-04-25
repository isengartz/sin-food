import { OrderTypes } from '../action-types';
import { StoredCartItemInterface } from '../../util/interfaces/CartItemInterface';
import { ErrorType } from '../../util/types/ErrorType';
import { PaymentMethod } from '@sin-nombre/sinfood-common';

export type OrderAction =
  | AddItemToCartAction
  | RemoveItemFromCartAction
  | InitializeOrderDataAction
  | ClearCartDataAction
  | UpdateCartItemAction
  | UpdateCartItemErrorAction
  | ClearOrderErrorsAction
  | SetOrderErrorsAction
  | UpdateOrderPaymentMethodAction
  | OrderCreationStartAction
  | OrderCreationSuccessAction
  | OrderCreationErrorAction
  | OrderPaymentStartAction
  | OrderPaymentSuccessAction
  | OrderPaymentErrorAction;

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

export interface SetOrderErrorsAction {
  type: OrderTypes.SET_ORDER_ERRORS;
  payload: ErrorType;
}
export interface ClearOrderErrorsAction {
  type: OrderTypes.CLEAR_ORDER_ERRORS;
}

export interface UpdateOrderPaymentMethodAction {
  type: OrderTypes.UPDATE_ORDER_PAYMENT_METHOD;
  payload: PaymentMethod;
}

export interface OrderCreationStartAction {
  type: OrderTypes.ORDER_CREATION_START;
}

export interface OrderCreationSuccessAction {
  type: OrderTypes.ORDER_CREATION_SUCCESS;
}

export interface OrderCreationErrorAction {
  type: OrderTypes.ORDER_CREATION_ERROR;
  payload: ErrorType;
}

export interface OrderPaymentStartAction {
  type: OrderTypes.ORDER_PAYMENT_START;
}

export interface OrderPaymentSuccessAction {
  type: OrderTypes.ORDER_PAYMENT_SUCCESS;
}

export interface OrderPaymentErrorAction {
  type: OrderTypes.ORDER_PAYMENT_ERROR;
  payload: ErrorType;
}
