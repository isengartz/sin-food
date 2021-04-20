import { OrderAction, RemoveItemFromCartAction } from '../actions';
import { OrderTypes } from '../action-types';
import {
  CartItemInterface,
  StoredCartItemInterface,
} from '../../util/interfaces/CartItemInterface';
import { v4 as uuidv4 } from 'uuid';
import { AppThunk } from '../../util/types/AppThunk';
import { Dispatch } from 'redux';
import { CacheHelper } from '../../util/cacheHelper';

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
