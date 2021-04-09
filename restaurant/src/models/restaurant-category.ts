import { RelationHelper } from '@sin-nombre/sinfood-common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { restaurantCategoryRelationships } from '../utils/RestaurantCategoryRelations';
import { Restaurant, RestaurantDoc } from './restaurant';
import { RestaurantUpdatedPublisher } from '../events/publishers/restaurant-updated-publisher';
import { natsWrapper } from '../events/nats-wrapper';

export interface RestaurantCategoryAttrs {
  name: string;
}

export interface RestaurantCategoryDoc extends mongoose.Document {
  id: string;
  name: string;
  version: number;
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

restaurantCategorySchema.set('versionKey', 'version');
restaurantCategorySchema.plugin(updateIfCurrentPlugin);

restaurantCategorySchema.statics.build = (attrs: RestaurantCategoryAttrs) => {
  return new RestaurantCategory(attrs);
};

// Remove references From relations on delete
restaurantCategorySchema.post<RestaurantCategoryDoc>(
  // @ts-ignore
  'remove',
  async function (doc, next) {
    if (doc) {
      await Restaurant.updateMany(
        { _id: { $in: doc.restaurants } },
        {
          $pull: {
            categories: doc._id,
          },
        },
      );
      doc.restaurants.forEach((restaurant: RestaurantDoc) => {
        new RestaurantUpdatedPublisher(natsWrapper.client).publish({
          id: restaurant._id,
          version: restaurant.version,
          delivers_to: restaurant.delivers_to,
          working_hours: restaurant.working_hours,
          holidays: restaurant.holidays,
          categories: restaurant.categories,
        });
      });
    }
    next();
  },
);
const RestaurantCategory = mongoose.model<
  RestaurantCategoryDoc,
  RestaurantCategoryModel
>('Restaurant_Category', restaurantCategorySchema);

export { RestaurantCategory };
