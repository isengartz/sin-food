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

export const clearCartData = (): AppThunk => {
  return async (dispatch: Dispatch<OrderAction>) => {
    const cacheHelper = new CacheHelper();
    await cacheHelper.delItem('cart');
    dispatch({ type: OrderTypes.CLEAR_CART_DATA });
  };
};

export const createOrder = (orderItems: any): AppThunk => {
  return async (dispatch: Dispatch<OrderAction>) => {
    try {
      console.log(orderItems);
      const {
        data: { data },
      } = await axiosOrderInstance.post('/', orderItems);
      const response = await axiosOrderInstance.post('/', orderItems);
      console.log(response.data);
      return data;
    } catch (e) {
      dispatch({
        type: OrderTypes.SET_ORDER_ERRORS,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};

export const clearOrderErrors = () => ({ type: OrderTypes.CLEAR_ORDER_ERRORS });

export const updatePaymentMethod = (method: PaymentMethod) => ({
  type: OrderTypes.UPDATE_ORDER_PAYMENT_METHOD,
  payload: method,
});
