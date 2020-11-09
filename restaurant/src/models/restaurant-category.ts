import mongoose from 'mongoose';
import { RelationHelper } from '@sin-nombre/sinfood-common';
import { restaurantCategoryRelationships } from '../utils/RestaurantCategoryRelations';

export interface RestaurantCategoryAttrs {
  name: string;
}

export interface RestaurantCategoryDoc extends mongoose.Document {
  id: string;
  name: string;
  restaurants: string[];
}

export interface RestaurantCategoryModel
  extends mongoose.Model<RestaurantCategoryDoc> {
  build(attrs: RestaurantCategoryAttrs): RestaurantCategoryDoc;
}

const restaurantCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, 'Category name must be unique'],
      required: [true, 'Category name is required'],
    },
    restaurants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
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
  },
);

restaurantCategorySchema.statics.build = (attrs: RestaurantCategoryAttrs) => {
  return new RestaurantCategory(attrs);
};

// Remove references From relations on delete
restaurantCategorySchema.post<RestaurantCategoryDoc>(
  'findOneAndDelete',
  async function (doc) {
    if (doc) {
      const relationshipHelper = new RelationHelper<RestaurantCategoryDoc>(doc);
      relationshipHelper.addRelations(restaurantCategoryRelationships);
      relationshipHelper.removeReferencesBasedOnId();
    }
  },
);
const RestaurantCategory = mongoose.model<
  RestaurantCategoryDoc,
  RestaurantCategoryModel
>('Restaurant_Category', restaurantCategorySchema);

export { RestaurantCategory };
