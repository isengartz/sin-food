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

const restaurantCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "Category name must be unique"],
      required: [true, "Category name is required"],
    },
    restaurants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

restaurantCategorySchema.statics.build = (attrs: RestaurantCategoryAttrs) => {
  return new RestaurantCategory(attrs);
};

const RestaurantCategory = mongoose.model<
  RestaurantCategoryDoc,
  RestaurantCategoryModel
>("Restaurant_Category", restaurantCategorySchema);

export default RestaurantCategory;
