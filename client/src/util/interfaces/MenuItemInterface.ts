export interface VariationInterface {
  name: string;
  price: number;
}

export interface IngredientInterface {
  name: string;
  category: string;
  defaultPrice: number;
  id: string;
}
export interface ExtraGroupsInterfaces {
  title: string;
  ingredients: IngredientInterface[];
}

export interface MenuItemInterface {
  id: string;
  name: string;
  description: string;
  base_price: number;
  menu_category: string;
  variations: VariationInterface[];
  main_ingredients: IngredientInterface[];
  extra_ingredient_groups: ExtraGroupsInterfaces[];
  image?: string;
}
