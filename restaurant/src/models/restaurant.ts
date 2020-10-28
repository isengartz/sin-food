/* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import { randomBytes, createHash } from "crypto";
import validator from "validator";
import { Password } from "@sin-nombre/sinfood-common";

// Describes the attributes that we accept from Request
export interface RestaurantAttrs {
  email: string;
  password: string;
  name: string;
  description: string;
  full_address: string;
  logo?: string;
  location: {
    type?: string;
    coordinates: number[];
  };
  delivers_to: {
    type?: string;
    coordinates: number[][][];
  };
  phone: string;
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
  password_reset_token?: string;
  password_reset_expires?: number;
  password_changed_at?: number;
  createPasswordResetToken(): string;
  changedPasswordAfter(JWTTimestamp: number): boolean;
}

interface RestaurantModel extends mongoose.Model<RestaurantDoc> {
  build(attrs: RestaurantAttrs): RestaurantDoc;
}

const restaurantSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already in use. Use a different one."],
      required: [true, "Email is required"],
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Provide a valid Email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    name: {
      type: String,
      required: [true, "Restaurant Name is required"],
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
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        required: [true, "Restaurant geolocation is required"],
        type: [Number],
        index: "2dsphere",
      },
    },
    delivers_to: {
      type: { type: String, enum: ["Polygon"], default: "Polygon" },
      coordinates: {
        type: [[[Number]]],
        // index: "2dsphere",
      },
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RestaurantCategory",
      },
    ],
    phone: {
      type: String,
      required: [true, "Phone is required"],
      validate: {
        validator: function (v: string) {
          return validator.isMobilePhone(v, "any", {
            strictMode: true,
          });
        },
        message: "Provide a valid phone",
      },
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
  }
);

// Hash password before Save
restaurantSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  next();
});

// If updated password add the passwordChangedAt field too
restaurantSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  // @ts-ignore
  this.password_changed_at = Date.now() - 1000;
  next();
});

// Checks if a password was changed after a given timestamp
restaurantSchema.methods.changedPasswordAfter = function (
  JWTTimestamp: number
) {
  if (this.password_changed_at) {
    const changedTimestamp = parseInt(
      // @ts-ignore
      this.password_changed_at.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

// Creates and persist the password_reset_token and password_reset_expires
restaurantSchema.methods.createPasswordResetToken = function () {
  const resetToken = randomBytes(32).toString("hex");

  this.password_reset_token = createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.password_reset_expires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// restaurantSchema.pre("remove", async function (next) {
//   const UserAddress = mongoose.model("UserAddress");
//
//   await UserAddress.remove({
//     _id: {
//       // @ts-ignore
//       $in: this.addresses,
//     },
//   });
//   next();
// });

// Hack so we can use TS with mongoose
restaurantSchema.statics.build = (attrs: RestaurantAttrs) => {
  return new Restaurant(attrs);
};

const Restaurant = mongoose.model<RestaurantDoc, RestaurantModel>(
  "Restaurant",
  restaurantSchema
);
export { Restaurant };
