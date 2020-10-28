import express from "express";
import {
  findAllRestaurants,
  createRestaurant,
} from "../controllers/restaurant";

const router = express.Router();

router.route("/").get(findAllRestaurants).post(createRestaurant);


export {router as restaurantRoutes}
