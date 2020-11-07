import mongoose from "mongoose";
import {RestaurantCategoryDoc} from "../models/restaurant-category";


// export interface RelationUpdateInterface<U extends mongoose.Document,T extends mongoose.Model<U>> {
//   model: T;
//   parentIdentifier: string;
//   childIdentifier: string;
// }
export interface RelationUpdateInterface<T extends mongoose.Document> {
    model: mongoose.Model<T>;
    parentIdentifier: string;
    childIdentifier: string;
}
export const restaurantCatRelation: RelationUpdateInterface<RestaurantCategoryDoc> = {
  model: mongoose.model("Restaurant_Category"),
  parentIdentifier: "categories",
  childIdentifier: "restaurants",
};
