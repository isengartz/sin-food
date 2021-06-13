import type { MenuDataItem, Settings as ProSettings } from '@ant-design/pro-layout';
import { GlobalModelState } from './global';
import { UserModelState } from './user';
import type { StateType } from './login';
import { RegisterStateType } from './register';
import { RestaurantCategoriesStateType } from './restaurant-categories';
import { MenuCategoriesStateType } from './menu-categories';

export { GlobalModelState, UserModelState };

export type Loading = {
  global: boolean;
  effects: Record<string, boolean | undefined>;
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
    register?: boolean;
    restaurant_categories?: boolean;
    menu_categories?: boolean;
  };
};

export type ConnectState = {
  global: GlobalModelState;
  loading: Loading;
  settings: ProSettings;
  user: UserModelState;
  login: StateType;
  register: RegisterStateType;
  restaurant_categories: RestaurantCategoriesStateType;
  menu_categories: MenuCategoriesStateType;
};

export type Route = {
  routes?: Route[];
} & MenuDataItem;
