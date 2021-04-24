import { AppThunk } from '../../util/types/AppThunk';
import { Dispatch } from 'redux';
import { MenuAction, SetSelectedMenuItem } from '../actions';
import { MenuTypes } from '../action-types';
import axiosMenuService from '../../apis/instances/menu';
import { handleAxiosErrorMessage } from '../../util/handleAxiosErrorMessage';
import { MenuItemInterface } from '../../util/interfaces/MenuItemInterface';
import { CacheHelper } from '../../util/cacheHelper';
import { StoredCartItemInterface } from '../../util/interfaces/CartItemInterface';

/**
 * Fetch Menu Categories
 */
export const getMenuCategories = (restaurantId: string): AppThunk => {
  return async (dispatch: Dispatch<MenuAction>) => {
    dispatch({ type: MenuTypes.GET_MENU_CATEGORIES_START });
    try {
      const {
        data: {
          data: { menu_item_categories },
        },
      } = await axiosMenuService.get(`/categories/filter/${restaurantId}`);
      dispatch({
        type: MenuTypes.GET_MENU_CATEGORIES_SUCCESS,
        payload: menu_item_categories,
      });
      // localStorage.setItem(
      //   'restaurantCategories',
      //   JSON.stringify(menu_item_categories),
      // );
    } catch (e) {
      dispatch({
        type: MenuTypes.GET_MENU_CATEGORIES_ERROR,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};

/**
 * Fetch Menu Items
 */
export const getMenuItems = (restaurantId: string): AppThunk => {
  return async (dispatch: Dispatch<MenuAction>) => {
    dispatch({ type: MenuTypes.GET_MENU_ITEMS_START });
    try {
      const {
        data: {
          data: { menu_items },
        },
      } = await axiosMenuService.get(`/filter/${restaurantId}`);
      dispatch({
        type: MenuTypes.GET_MENU_ITEMS_SUCCESS,
        payload: menu_items,
      });
      // localStorage.setItem('restaurantCategories', JSON.stringify(menu_items));
    } catch (e) {
      dispatch({
        type: MenuTypes.GET_MENU_ITEMS_ERROR,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};

export const setSelectedMenuItem = (
  item: MenuItemInterface,
): SetSelectedMenuItem => {
  return {
    type: MenuTypes.SET_SELECTED_MENU_ITEM,
    payload: item,
  };
};

export const startUpdatingMenuItem = (
  selectedItem: MenuItemInterface,
  uuid: string,
): AppThunk => {
  return async (dispatch: Dispatch<MenuAction>) => {
    dispatch({ type: MenuTypes.START_UPDATING_MENU_ITEM_START });
    try {
      const cacheHelper = new CacheHelper();
      const storedItems = await cacheHelper.getItem<{
        items: StoredCartItemInterface[];
        restaurant: string;
      }>('cart');
      if (!storedItems) {
        throw new Error('We got an internal error! Try again later!');
      }
      const foundItem = storedItems.items.find((item) => item.uuid === uuid);
      console.log('foundItem', foundItem);
      if (!foundItem) {
        throw new Error('We got an internal error! Try again later!');
      }

      dispatch({
        type: MenuTypes.START_UPDATING_MENU_ITEM_SUCCESS,
        payload: {
          selectedItem,
          editingItem: foundItem,
        },
      });
    } catch (e) {
      dispatch({
        type: MenuTypes.START_UPDATING_MENU_ITEM_ERROR,
        payload: [{ message: e.message }],
      });
    }
  };
};

export const unsetMenuEditingItem = () => ({
  type: MenuTypes.UNSET_UPDATING_ITEM,
});

export const unsetSelectedItem = () => ({
  type: MenuTypes.UNSET_SELECTED_ITEM,
});
