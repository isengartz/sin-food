import { MenuItemInterface } from '../../util/interfaces/MenuItemInterface';
import { MenuCategoriesInterface } from '../../util/interfaces/MenuCategoriesInterface';
import { MenuTypes } from '../action-types';
import { ErrorType } from '../../util/types/ErrorType';
import { StoredCartItemInterface } from '../../util/interfaces/CartItemInterface';

export type MenuAction =
  | GetMenuCategoriesStart
  | GetMenuCategoriesSuccess
  | GetMenuCategoriesError
  | GetMenuItemsStart
  | GetMenuItemsSuccess
  | GetMenuItemsError
  | SetSelectedMenuItem
  | StartUpdatingMenuItemStartAction
  | StartUpdatingMenuItemSuccessAction
  | StartUpdatingMenuItemErrorAction
  | UnsetUpdatingItemAction
  | UnsetSelectedItemAction;

interface GetMenuCategoriesStart {
  type: MenuTypes.GET_MENU_CATEGORIES_START;
}

interface GetMenuCategoriesSuccess {
  type: MenuTypes.GET_MENU_CATEGORIES_SUCCESS;
  payload: MenuCategoriesInterface[];
}

interface GetMenuCategoriesError {
  type: MenuTypes.GET_MENU_CATEGORIES_ERROR;
  payload: ErrorType;
}

interface GetMenuItemsStart {
  type: MenuTypes.GET_MENU_ITEMS_START;
}

interface GetMenuItemsSuccess {
  type: MenuTypes.GET_MENU_ITEMS_SUCCESS;
  payload: MenuItemInterface[];
}
interface GetMenuItemsError {
  type: MenuTypes.GET_MENU_ITEMS_ERROR;
  payload: ErrorType;
}

export interface SetSelectedMenuItem {
  type: MenuTypes.SET_SELECTED_MENU_ITEM;
  payload: MenuItemInterface;
}

export interface StartUpdatingMenuItemStartAction {
  type: MenuTypes.START_UPDATING_MENU_ITEM_START;
}

export interface StartUpdatingMenuItemSuccessAction {
  type: MenuTypes.START_UPDATING_MENU_ITEM_SUCCESS;
  payload: {
    selectedItem: MenuItemInterface;
    editingItem: StoredCartItemInterface;
  };
}

export interface StartUpdatingMenuItemErrorAction {
  type: MenuTypes.START_UPDATING_MENU_ITEM_ERROR;
  payload: ErrorType;
}

export interface UnsetUpdatingItemAction {
  type: MenuTypes.UNSET_UPDATING_ITEM;
}

export interface UnsetSelectedItemAction {
  type: MenuTypes.UNSET_SELECTED_ITEM;
}
