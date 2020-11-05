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
} from "../controllers/restaurantController";

const router = express.Router();

// export const isAdminOrCurrentRestaurantTest = (param: string) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     // Only admin can modify a restaurant directly
//     //@ts-ignore
//     console.log(req.currentUser);
//     console.log(req.currentRestaurant);
//
//     if (req.currentUser && req.currentUser.role !== UserRole.Admin) {
//       throw new NotAuthorizedError();
//     }
//     if (req.currentRestaurant) {
//       req.params[param] = req.currentRestaurant.id;
//     }
//     next();
//   };
// };

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
  );
export { router as restaurantRoutes };
