import mongoose from 'mongoose';
import { randomBytes, createHash } from 'crypto';
import validator from 'validator';
import { Password, UserRole, RelationHelper } from '@sin-nombre/sinfood-common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { restaurantRelationships } from '../utils/RestaurantRelations';
import {
  RestaurantWorkingHours,
  restaurantWorkingHoursSchema,
} from './restaurant-working-hours';

// Describes the attributes that we accept from Request
export interface RestaurantAttrs {
  email: string;
  password: string;
  name: string;
  description: string;
  full_address: string;
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
  email: string;
  password?: string;
  name: string;
  description: string;
  full_address: string;
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
      default: false,
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

// Insert updateIfCurrentPlugin and change the default version key from __v to version
restaurantSchema.set('versionKey', 'version');
restaurantSchema.plugin(updateIfCurrentPlugin);

// Insert the reference from the Restaurant Category
restaurantSchema.pre<RestaurantDoc>('save', async function (next) {
  if (this.categories.length === 0) {
    return next();
  }
  const relationshipHelper = new RelationHelper<RestaurantDoc>(this);
  relationshipHelper.addRelations(restaurantRelationships);
  relationshipHelper.insertReferencesBasedOnId();

  next();
});

//@ts-ignore
restaurantSchema.post<RestaurantDoc>('findOneAndUpdate', async function (doc) {
  if (doc) {
    const relationshipHelper = new RelationHelper<RestaurantDoc>(doc);
    relationshipHelper.addRelations(restaurantRelationships);
    relationshipHelper.insertReferencesBasedOnId();
    relationshipHelper.removeUpdatedReferencesBasedOnId();
  }
});

// Remove the reference from the Restaurant Category
restaurantSchema.pre<RestaurantDoc>('remove', async function (next) {
  const relationshipHelper = new RelationHelper<RestaurantDoc>(this);
  relationshipHelper.addRelations(restaurantRelationships);
  relationshipHelper.removeReferencesBasedOnId();

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
  this:RestaurantDoc,
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
  this : RestaurantDoc,
) : string {
  const resetToken = randomBytes(32).toString('hex');
  const test = this;
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
