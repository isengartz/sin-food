import { OrderAction } from '../actions';
import { OrderTypes } from '../action-types';
import {
  CartItemInterface,
  StoredCartItemInterface,
} from '../../util/interfaces/CartItemInterface';
import { v4 as uuidv4 } from 'uuid';
import { AppThunk } from '../../util/types/AppThunk';
import { Dispatch } from 'redux';
import { CacheHelper } from '../../util/cacheHelper';
import { handleAxiosErrorMessage } from '../../util/handleAxiosErrorMessage';
import { axiosOrderInstance } from '../../apis/instances/order';
import { PaymentMethod } from '@sin-nombre/sinfood-common';
import { axiosPaymentInstance } from '../../apis/instances/payment';

/**
 * Adds an item into cart and cache
 * @param item
 * @param restaurantId
 */
export const addItemToCart = (
  item: CartItemInterface,
  restaurantId: string,
): AppThunk => {
  return async (dispatch: Dispatch<OrderAction>) => {
    // Check if there are any other cart data in cache
    const cacheHelper = new CacheHelper();
    const cart = (await cacheHelper.getItem<{
      items: StoredCartItemInterface[];
      restaurant: string;
    }>('cart')) || { items: [], restaurant: '' };
    // Create an uuid for the cart item
    const newItem = { ...item, uuid: uuidv4() };
    const newCartData = {
      items: [...cart.items, newItem],
      restaurant: restaurantId,
    };

    dispatch({ type: OrderTypes.ADD_ITEM_TO_CART, payload: newCartData });
    await cacheHelper.setItem('cart', newCartData);
  };
};

/**
 * Updates an item from cart and cache
 * @param updatedItem
 */
export const updateCartItem = (
  updatedItem: StoredCartItemInterface,
): AppThunk => {
  return async (dispatch: Dispatch<OrderAction>) => {
    try {
      const cacheHelper = new CacheHelper();
      const storedItems = await cacheHelper.getItem<{
        items: StoredCartItemInterface[];
        restaurant: string;
      }>('cart');

      // The below checks should never ever happen normally.
      // In order to bug it someone has to manually delete IndexDB stuff from the browser
      if (!storedItems) {
        throw new Error('We got an internal error! Try again later!');
      }

      const foundItemIndex = storedItems.items.findIndex(
        (item) => item.uuid === updatedItem.uuid,
      );

      if (foundItemIndex === -1) {
        throw new Error('We got an internal error! Try again later!');
      }
      // Replace the item in the cache
      storedItems.items.splice(foundItemIndex, 1, updatedItem);

      await cacheHelper.setItem('cart', {
        items: storedItems.items,
        restaurant: storedItems.restaurant,
      });

      dispatch({ type: OrderTypes.UPDATE_CART_ITEM, payload: updatedItem });
    } catch (e) {
      dispatch({
        type: OrderTypes.UPDATE_CART_ITEM_ERROR,
        payload: [{ message: e.message }],
      });
    }
  };
};

/**
 * Deletes an item from cart and cache
 * @param uuid
 */
export const removeItemFromCart = (uuid: string): AppThunk => {
  return async (dispatch: Dispatch<OrderAction>) => {
    // Check if there are any other cart data in cache
    const cacheHelper = new CacheHelper();
    const cart = await cacheHelper.getItem<{
      items: StoredCartItemInterface[];
      restaurant: string;
    }>('cart');
    // Update cart cache by removing the item
    const newItems = cart!.items.filter((item) => item.uuid !== uuid);
    const newCartData = {
      items: newItems,
      restaurant: cart!.restaurant,
    };

    dispatch({
      type: OrderTypes.REMOVE_ITEM_FROM_CART,
      payload: uuid,
    });
    await cacheHelper.setItem('cart', newCartData);
  };
};

/**
 * Empty the whole cart
 */
export const clearCartData = (): AppThunk => {
  return async (dispatch: Dispatch<OrderAction>) => {
    const cacheHelper = new CacheHelper();
    await cacheHelper.delItem('cart');
    dispatch({ type: OrderTypes.CLEAR_CART_DATA });
  };
};

/**
 * Generate an orderId and return it back
 * We dont store anything in Redux here
 * @param orderItems
 */
export const createOrder = (orderItems: any): AppThunk => {
  return async (dispatch: Dispatch<OrderAction>) => {
    dispatch({
      type: OrderTypes.ORDER_CREATION_START,
    });
    try {
      const {
        data: {
          data: { orders },
        },
      } = await axiosOrderInstance.post('/', orderItems);
      return orders;
    } catch (e) {
      dispatch({
        type: OrderTypes.ORDER_CREATION_ERROR,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};

interface PaymentResponse {
  status: string;
  data: {
    payment: {
      id: string;
      orderId: string;
    };
  };
}

/**
 * Creates a payment and return it back
 * We dont store anything in Redux here
 * @param orderId
 * @param payment_method
 * @param token
 */
export const createPayment = (
  orderId: string,
  payment_method: PaymentMethod,
  token: string = '',
): AppThunk<Promise<PaymentResponse | undefined>> => {
  return async (
    dispatch: Dispatch<OrderAction>,
  ): Promise<PaymentResponse | undefined> => {
    dispatch({
      type: OrderTypes.ORDER_PAYMENT_START,
    });
    try {
      const payload = {
        orderId,
        payment_method,
        token,
      };
      const response = await axiosPaymentInstance.post('/', payload);

      return response.data as PaymentResponse;
    } catch (e) {
      dispatch({
        type: OrderTypes.ORDER_PAYMENT_ERROR,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};

/**
 * Clear all order errors
 */
export const clearOrderErrors = () => ({ type: OrderTypes.CLEAR_ORDER_ERRORS });

/**
 * Updates the current selected payment method
 * @param method
 */
export const updatePaymentMethod = (method: PaymentMethod) => ({
  type: OrderTypes.UPDATE_ORDER_PAYMENT_METHOD,
  payload: method,
});
