import { MenuCategoriesInterface } from '../../util/interfaces/MenuCategoriesInterface';
import { MenuItemInterface } from '../../util/interfaces/MenuItemInterface';
import { MenuAction } from '../actions';
import { MenuTypes } from '../action-types';
import { ErrorType } from '../../util/types/ErrorType';

interface MenuState {
  categories: MenuCategoriesInterface[];
  items: MenuItemInterface[];
  loading: boolean;
  errors: ErrorType;
  selectedItem: MenuItemInterface | null;
}

const initialState: MenuState = {
  categories: [],
  items: [],
  loading: false,
  errors: [],
  selectedItem: null,
};

const menuReducer = (state = initialState, action: MenuAction) => {
  switch (action.type) {
    case MenuTypes.GET_MENU_CATEGORIES_START:
      return { ...state, loading: true, errors: [] };
    case MenuTypes.GET_MENU_CATEGORIES_SUCCESS:
      return { ...state, loading: false, categories: action.payload };
    case MenuTypes.GET_MENU_CATEGORIES_ERROR:
      return { ...state, loading: false, errors: action.payload };
    case MenuTypes.GET_MENU_ITEMS_START:
      return { ...state, loading: true, errors: [] };
    case MenuTypes.GET_MENU_ITEMS_SUCCESS:
      return { ...state, loading: false, items: action.payload };
    case MenuTypes.GET_MENU_ITEMS_ERROR:
      return { ...state, loading: false, errors: action.payload };
    case MenuTypes.SET_SELECTED_MENU_ITEM:
      return { ...state, selectedItem: action.payload };
    default:
      return state;
  }
};

export default menuReducer;
