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
    const { cookie } = await createAdmin(instance);
    // Set cookie in the instance
    instance.defaults.headers.Cookie = cookie;

    const restaurantCategories = await seedRestaurantCategories(instance);
    console.log('restaurant-categories', restaurantCategories.length);

    const restaurants = await seedRestaurants(restaurantCategories);
    console.log('restaurants', restaurants.length);

    const ingredientCategories = await seedIngredientCategories(
      instance,
      restaurants,
    );
    console.log('ingredient-categories', ingredientCategories.length);

    const ingredients = await seedIngredients(instance, ingredientCategories);
    console.log('ingredients', ingredients.length);

    const ingredientsGrouped = _.groupBy(ingredients, 'userId');

    const menuItemCategories = await seedMenuItemCategories(
      instance,
      restaurants,
    );
    console.log('menu-item-categories', menuItemCategories.length);

    const menuItems = await seedMenuItems(
      instance,
      ingredientsGrouped,
      menuItemCategories,
    );

    console.log('menu-items', menuItems.length);
  } catch (e) {
    console.log(e.response.data.errors || e.message);
  }

  // return response;
};

seeder();
