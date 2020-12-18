/* eslint-disable @typescript-eslint/indent */
import { OrderDoc } from '../models/order';
import { MenuItem } from '../models/menu-item';
import { Ingredient } from '../models/ingredient';

export const calculateFinalOrderPrice = async (
  items: OrderDoc['menu_items'],
): Promise<number> => {
  // We only need the unique values of ingredients and menu_items
  // So store them in a Set
  const ids: Set<string> = new Set();
  const ingrs: Set<string> = new Set();

  items.forEach((item) => {
    ids.add(item.item);
    item.item_options.extra_ingredients.forEach((ingredient) =>
      ingrs.add(ingredient),
    );
  });

  // Query menuItems and ingredients that we gonna need
  // Convert Set to array
  const ingredients = await Ingredient.find({ _id: { $in: [...ingrs] } });
  const menuItems = await MenuItem.find({ _id: { $in: [...ids] } });

  const price = items.reduce((acc, current) => {
    const foundItem = menuItems.find(
      (menuItem) => menuItem._id.toString() === current.item.toString(),
    );

    // If a variation is selected add the variation price.
    // Else add the base_price
    const variationPrice = current.item_options.variation
      ? foundItem!.variations.find(
          (variation) => variation.name === current.item_options.variation,
        )!.price
      : foundItem!.base_price;

    let extraIngredientPrice = 0;
    // calculate the price of all extra ingredients
    current.item_options.extra_ingredients.forEach((ingredient) => {
      const foundIngredient = ingredients.find(
        (ingr) => ingr._id.toString() === ingredient.toString(),
      );
      extraIngredientPrice += foundIngredient!.price;
    });
    // we have to multiply the price of the item + ingredients with the quantity
    acc +=
      (variationPrice + extraIngredientPrice) * current.item_options.quantity;
    return acc;
  }, 0);

  return price;
};
