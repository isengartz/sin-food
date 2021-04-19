import { MenuItemInterface } from '../../util/interfaces/MenuItemInterface';
import { MenuCategoriesInterface } from '../../util/interfaces/MenuCategoriesInterface';
import { MenuTypes } from '../action-types';
import { ErrorType } from '../../util/types/ErrorType';

export type MenuAction =
  | GetMenuCategoriesStart
  | GetMenuCategoriesSuccess
  | GetMenuCategoriesError
  | GetMenuItemsStart
  | GetMenuItemsSuccess
  | GetMenuItemsError
  | SetSelectedMenuItem;

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
