import mongoose from "mongoose";

export interface RestaurantCategoryAttrs {
  name: string;
}

export interface RestaurantCategoryDoc extends mongoose.Document {
  id: string;
  name: string;
  restaurants: [string];
}

interface RestaurantCategoryModel
  extends mongoose.Model<RestaurantCategoryDoc> {
  build(attrs: RestaurantCategoryAttrs): RestaurantCategoryDoc;
}

const restaurantCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
  },
  restaurants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
  ],
});

restaurantCategorySchema.statics.build = (attrs: RestaurantCategoryAttrs) => {
  return new RestaurantCategory(attrs);
};

const RestaurantCategory = mongoose.model<
  RestaurantCategoryDoc,
  RestaurantCategoryModel
>("RestaurantCategory", restaurantCategorySchema);

export default RestaurantCategory;
