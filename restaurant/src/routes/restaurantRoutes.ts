import express, { Request, Response, NextFunction } from "express";
import {
  currentUser,
  UserRole,
  isAdminOrCurrentUser,
  requireAuth,
  restrictTo,
} from "@sin-nombre/sinfood-common";
import {
  findAllRestaurants,
  createRestaurant,
  updateRestaurant,
  signinRestaurant,
  deleteRestaurant,
} from "../controllers/restaurantController";

const router = express.Router();

router.post("/signin", signinRestaurant);
router.route("/").get(findAllRestaurants).post(createRestaurant);

router
  .route("/:id")
  .put(
    currentUser,
    requireAuth,
    restrictTo([UserRole.Admin, UserRole.Restaurant]),
    isAdminOrCurrentUser("id"),
    updateRestaurant
  )
  .delete(
    currentUser,
    requireAuth,
    restrictTo([UserRole.Admin]),
    deleteRestaurant
  );
export { router as restaurantRoutes };
