import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { MenuItemInterface } from '../../util/interfaces/MenuItemInterface';

export const selectMenu = (state: RootState) => state.menu;

export const selectMenuCategories = createSelector(
  selectMenu,
  (menu) => menu.categories,
);

export const selectMenuCategoriesAsMap = createSelector(selectMenu, (menu) => {
  const categoriesMap = new Map<string, string>();
  for (let category of menu.categories) {
    categoriesMap.set(category.id, category.name);
  }
  return categoriesMap;
});

export const selectMenuItems = createSelector(selectMenu, (menu) => menu.items);

export const selectMenuItemsSortedByCategory = createSelector(
  selectMenu,
  (menu) => {
    const itemsMap = new Map<string, MenuItemInterface[]>();
    menu.items.forEach((item) => {
      const key = item.menu_category;
      itemsMap.set(key, [...(itemsMap.get(key) || []), item]);
    });
    return itemsMap;
  },
);
