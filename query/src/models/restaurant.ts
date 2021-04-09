import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import {
  RestaurantWorkingHours,
  restaurantWorkingHoursSchema,
} from './restaurant-working-hours';

interface RestaurantAttrs {
  id: string;
  categories: string[];
  delivers_to: {
    type?: string;
    coordinates: number[][][];
  };
  working_hours: RestaurantWorkingHours[];
  holidays: Date[];
}

interface RestaurantDoc extends mongoose.Document {
  version: number;
  categories: string[];
  delivers_to: {
    type?: string;
    coordinates: number[][][];
  };
  working_hours: RestaurantWorkingHours[];
  holidays: Date[];
}

interface RestaurantModel extends mongoose.Model<RestaurantDoc> {
  build(attrs: RestaurantAttrs): RestaurantDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<RestaurantDoc | null>;
}

const RestaurantSchema = new mongoose.Schema(
  {
    delivers_to: {
      type: { type: String, enum: ['Polygon'], default: 'Polygon' },
      coordinates: {
        type: [[[Number]]],
        // index: '2dsphere',
      },
    },
    categories: [{ type: String }],
    working_hours: [restaurantWorkingHoursSchema],
    holidays: [Date],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

RestaurantSchema.set('versionKey', 'version');
RestaurantSchema.plugin(updateIfCurrentPlugin);

// Find a Record based on Event
// Used to handle OOC
RestaurantSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Restaurant.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

RestaurantSchema.statics.build = (attrs: RestaurantAttrs) => {
  // We manually add each field here because if we dont assign the _id
  // We will get a record with both id and _id
  return new Restaurant({
    _id: attrs.id,
    categories: attrs.categories,
    working_hours: attrs.working_hours,
  });
};
const Restaurant = mongoose.model<RestaurantDoc, RestaurantModel>(
  'Restaurant',
  RestaurantSchema,
);

export { Restaurant };
