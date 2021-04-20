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

export const selectSelectedMenuItem = createSelector(
  selectMenu,
  (menu) => menu.selectedItem,
);

export const selectedSelectedMenuItemIngredients = createSelector(
  selectSelectedMenuItem,
  (item) => {
    const ingredientMap = new Map<string, number>();
    if (!item || item.extra_ingredient_groups.length === 0) {
      return ingredientMap;
    }
    for (let group of item.extra_ingredient_groups) {
      for (let ingredient of group.ingredients) {
        ingredientMap.set(ingredient.id, ingredient.defaultPrice);
      }
    }
    return ingredientMap;
  },
);

export const selectedSelectedMenuItemIngredientsNames = createSelector(
  selectSelectedMenuItem,
  (item) => {
    const ingredientMap = new Map<string, string>();
    if (!item) {
      return ingredientMap;
    }
    for (let group of item.extra_ingredient_groups) {
      for (let ingredient of group.ingredients) {
        ingredientMap.set(ingredient.id, ingredient.name);
      }
    }
    for (let ingredient of item.main_ingredients) {
      ingredientMap.set(ingredient.id, ingredient.name);
    }
    return ingredientMap;
  },
);
