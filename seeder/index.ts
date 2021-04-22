import axios from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import tough from 'tough-cookie';
import dotenv from 'dotenv';
import _ from 'lodash';
import { seedRestaurants } from './services/seed-restaurants';
import { BASE_API_URL } from './utils/const';
import { createAdmin } from './utils/createAdmin';
import { seedRestaurantCategories } from './services/seed-restaurant-categories';
import { seedIngredientCategories } from './services/seed-ingredient-categories';
import { seedIngredients } from './services/seed-ingredients';
import { seedMenuItemCategories } from './services/seed-menu-categories';
import { seedMenuItems } from './services/seed-menu-items';
import { seedUser } from './services/seed-user';

dotenv.config();

const instance = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

const seeder = async () => {
  // Create an axios instance
  axiosCookieJarSupport(instance);
  instance.defaults.jar = new tough.CookieJar();

  try {
    // Create a normal user
    await seedUser();

    const { cookie } = await createAdmin(instance);
    // Set cookie in the instance
    instance.defaults.headers.Cookie = cookie;

    // Seed Restaurant Categories
    const restaurantCategories = await seedRestaurantCategories(instance);
    console.log('restaurant-categories', restaurantCategories.length);

    // Seed Restaurants
    const restaurants = await seedRestaurants(restaurantCategories, true);
    console.log('restaurants', restaurants.length);

    // Seed Ingredient Categories
    const ingredientCategories = await seedIngredientCategories(
      instance,
      restaurants,
    );
    console.log('ingredient-categories', ingredientCategories.length);

    // Seed Ingredients
    const ingredients = await seedIngredients(instance, ingredientCategories);
    console.log('ingredients', ingredients.length);

    // Seed Menu Item Categories
    const ingredientsGrouped = _.groupBy(ingredients, 'userId');
    const menuItemCategories = await seedMenuItemCategories(
      instance,
      restaurants,
    );
    console.log('menu-item-categories', menuItemCategories.length);

    // Seed Menu Items
    const menuItems = await seedMenuItems(
      instance,
      ingredientsGrouped,
      menuItemCategories,
    );
    console.log('menu-items', menuItems.length);
  } catch (e) {
    console.log(e.response.data.errors || e.message);
  }
};

seeder();
