import mongoose from 'mongoose';
import { randomBytes, createHash } from 'crypto';
import validator from 'validator';
import { Password, UserRole } from '@sin-nombre/sinfood-common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import {
  RestaurantWorkingHours,
  restaurantWorkingHoursSchema,
} from './restaurant-working-hours';
import { natsWrapper } from '../events/nats-wrapper';
import { RestaurantUpdatedPublisher } from '../events/publishers/restaurant-updated-publisher';
import { RestaurantCreatedPublisher } from '../events/publishers/restaurant-created-publisher';
import { RestaurantDeletedPublisher } from '../events/publishers/restaurant-deleted-publisher';
// eslint-disable-next-line import/no-cycle
import { RestaurantCategory } from './restaurant-category';

// Describes the attributes that we accept from Request
export interface RestaurantAttrs {
  email: string;
  password: string;
  name: string;
  description: string;
  full_address: string;
  minimum_order: number;
  logo?: string;
  categories?: string[];
  location: {
    type?: string;
    coordinates: number[];
  };
  delivers_to: {
    type?: string;
    coordinates: number[][][];
  };
  phone: string;
  role?: UserRole;
  working_hours: RestaurantWorkingHours[];
  holidays: Date[];
}

// Describes the actual Document returned by Mongoose
export interface RestaurantDoc extends mongoose.Document {
  id: string;
  version: number;
  email: string;
  password?: string;
  name: string;
  description: string;
  full_address: string;
  minimum_order: number;
  logo: string | null;
  location: {
    type: string;
    coordinates: number[];
  };
  delivers_to: {
    type: string;
    coordinates: number[][][];
  };
  categories: string[];
  phone: string;
  enabled: boolean;
  role: UserRole;
  working_hours: RestaurantWorkingHours[];
  holidays: Date[];
  ratingsAverage: Number;
  ratingsQuantity: Number;
  password_reset_token: string;
  password_reset_expires: number;
  password_changed_at: number;
  createPasswordResetToken(): string;
  changedPasswordAfter(JWTTimestamp: number): boolean;
}

export interface RestaurantModel extends mongoose.Model<RestaurantDoc> {
  build(attrs: RestaurantAttrs): RestaurantDoc;
}

const restaurantSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: 'Provide a valid Email',
      },
    },
    minimum_order: {
      type: Number,
      min: 0,
      default: 0,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    name: {
      type: String,
      unique: true,
      required: [true, 'Restaurant Name is required'],
    },
    description: {
      type: String,
    },
    full_address: {
      type: String,
    },
    logo: {
      type: String,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: {
        // required: [true, 'Restaurant geolocation is required'],
        type: [Number],
        index: '2dsphere',
      },
    },
    delivers_to: {
      type: { type: String, enum: ['Polygon'], default: 'Polygon' },
      coordinates: {
        type: [[[Number]]],
        // index: '2dsphere',
      },
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant_Category',
      },
    ],
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      validate: {
        validator: function (v: string) {
          return validator.isMobilePhone(v, 'any', {
            strictMode: true,
          });
        },
        message: 'Provide a valid phone',
      },
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
      default: UserRole.Restaurant,
    },
    working_hours: [restaurantWorkingHoursSchema],
    holidays: [Date],
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    created_at: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    password_changed_at: {
      type: Date,
      select: false,
    },
    password_reset_token: {
      type: String,
      select: false,
    },
    password_reset_expires: {
      type: Number,
      select: false,
    },
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

// Virtuals

restaurantSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'restaurantId',
  localField: '_id',
});

restaurantSchema.virtual('');

// Insert updateIfCurrentPlugin and change the default version key from __v to version
restaurantSchema.set('versionKey', 'version');
restaurantSchema.plugin(updateIfCurrentPlugin);

// Insert the reference from the Restaurant Category
restaurantSchema.pre<RestaurantDoc>('save', async function (next) {
  // @ts-ignore
  this.wasNew = this.isNew;

  if (!this.categories || this.categories.length === 0) {
    return next();
  }
  // const relationshipHelper = new RelationHelper<RestaurantDoc>(this);
  // relationshipHelper.addRelations(restaurantRelationships);
  // relationshipHelper.insertReferencesBasedOnId();
  await RestaurantCategory.updateMany(
    { _id: { $in: this.categories } },
    {
      $addToSet: {
        restaurants: this._id,
      },
    },
  );

  next();
});

// Publish an Event on new records
restaurantSchema.post<RestaurantDoc>('save', async function (doc, next) {
  if (doc.wasNew) {
    new RestaurantCreatedPublisher(natsWrapper.client).publish({
      id: doc._id,
      version: doc.version,
      delivers_to: doc.delivers_to,
      working_hours: doc.working_hours,
      holidays: doc.holidays,
      categories: doc.categories,
      logo: doc.logo,
      minimum_order: doc.minimum_order,
      name: doc.name,
      enabled: doc.enabled,
    });
  } else {
    // Insert the reference from the Restaurant Category
    await RestaurantCategory.updateMany(
      { _id: { $in: doc.categories } },
      {
        $addToSet: {
          restaurants: doc._id,
        },
      },
    );
    // const relationshipHelper = new RelationHelper<RestaurantDoc>(doc);
    // relationshipHelper.addRelations(restaurantRelationships);
    // relationshipHelper.insertReferencesBasedOnId();
    // relationshipHelper.removeUpdatedReferencesBasedOnId();
    // Removes the reference from Restaurant Categories
    await RestaurantCategory.updateMany(
      { _id: { $nin: doc.categories } },
      {
        $pull: {
          restaurants: doc._id,
        },
      },
    );

    // Publish an Event
    new RestaurantUpdatedPublisher(natsWrapper.client).publish({
      id: doc._id,
      version: doc.version,
      delivers_to: doc.delivers_to,
      working_hours: doc.working_hours,
      holidays: doc.holidays,
      categories: doc.categories,
      logo: doc.logo,
      minimum_order: doc.minimum_order,
      name: doc.name,
      enabled: doc.enabled,
    });
  }
  next();
});

// Remove the reference from the Restaurant Category
restaurantSchema.post<RestaurantDoc>('remove', async function (doc, next) {
  // const relationshipHelper = new RelationHelper<RestaurantDoc>(this);
  // relationshipHelper.addRelations(restaurantRelationships);
  // relationshipHelper.removeReferencesBasedOnId();

  await RestaurantCategory.updateMany(
    { _id: { $in: doc.categories } },
    {
      $pull: {
        restaurants: doc._id,
      },
    },
  );

  next();
});

// Publish an event on delete
restaurantSchema.post<RestaurantDoc>('remove', async function (doc, next) {
  new RestaurantDeletedPublisher(natsWrapper.client).publish({
    id: doc._id,
    version: doc.version,
  });
  next();
});

// Hash password before Save
restaurantSchema.pre<RestaurantDoc>('save', async function (next) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  next();
});

// If updated password add the passwordChangedAt field too
restaurantSchema.pre<RestaurantDoc>('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  // @ts-ignore
  this.password_changed_at = Date.now() - 1000;
  next();
});

// Checks if a password was changed after a given timestamp
//@todo:check why the fuck it breaks
//@ts-ignore
restaurantSchema.methods.changedPasswordAfter = function (
  this: RestaurantDoc,
  JWTTimestamp: number,
) {
  if (this.password_changed_at) {
    const changedTimestamp = parseInt(
      // @ts-ignore
      this.password_changed_at.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

// Creates and persist the password_reset_token and password_reset_expires
//@todo:check why the fuck it breaks
//@ts-ignore
restaurantSchema.methods.createPasswordResetToken = function (
  this: RestaurantDoc,
): string {
  const resetToken = randomBytes(32).toString('hex');
  this.password_reset_token = createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.password_reset_expires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Hack so we can use TS with mongoose
restaurantSchema.statics.build = (attrs: RestaurantAttrs) => {
  return new Restaurant(attrs);
};

const Restaurant = mongoose.model<RestaurantDoc, RestaurantModel>(
  'Restaurant',
  restaurantSchema,
);

export { Restaurant };
