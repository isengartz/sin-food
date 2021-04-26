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
 * Fetch restaurants menu categories
 * @param restaurantId
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
    } catch (e) {
      dispatch({
        type: MenuTypes.GET_MENU_CATEGORIES_ERROR,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};

/**
 * Fetch Restaurants menu items
 * @param restaurantId
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
    } catch (e) {
      dispatch({
        type: MenuTypes.GET_MENU_ITEMS_ERROR,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};

/**
 * Set the menu item as selected
 * @param item
 */
export const setSelectedMenuItem = (
  item: MenuItemInterface,
): SetSelectedMenuItem => {
  return {
    type: MenuTypes.SET_SELECTED_MENU_ITEM,
    payload: item,
  };
};

/**
 * Update the state in order to show the menu item edit modal
 * @param selectedItem
 * @param uuid
 */
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

      // The below checks should never ever happen normally.
      // In order to bug it someone has to manually delete IndexDB stuff from the browser
      if (!storedItems) {
        throw new Error('We got an internal error! Try again later!');
      }
      const foundItem = storedItems.items.find((item) => item.uuid === uuid);
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

/**
 * Clear the selected item for update from state
 */
export const unsetMenuEditingItem = () => ({
  type: MenuTypes.UNSET_UPDATING_ITEM,
});

/**
 * Clear the selected menu item from state
 */
export const unsetSelectedItem = () => ({
  type: MenuTypes.UNSET_SELECTED_ITEM,
});
