import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// Describes the attributes that we accept from Request
export interface UserAddressAttrs {
  description: string;
  floor: string;
  full_address: string;
  latitude: string;
  longitude: string;
  user_id: string;
}
// Describes the actual Document returned by Mongoose
export interface UserAddressDoc extends mongoose.Document {
  description: string;
  floor: string;
  full_address: string;
  latitude: string;
  longitude: string;
  version: number;
  user_id: string;
}

interface UserAddressModel extends mongoose.Model<UserAddressDoc> {
  // eslint-disable-next-line no-unused-vars
  build(attrs: UserAddressAttrs): UserAddressDoc;
}

const userAddressSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    floor: {
      type: String,
      required: [true, "Floor is required"],
    },
    full_address: {
      type: String,
      required: [true, "Full address is required"],
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is Required"],
    },
    latitude: {
      type: Number,
      required: [true, "Latitude is Required"],
    },
    user_id: {
      type: String,
      required: [true, "User id is required"],
      // select: false,
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

// Insert updateIfCurrentPlugin and change the default version key from __v to version
userAddressSchema.set("versionKey", "version");
userAddressSchema.plugin(updateIfCurrentPlugin);


// Hack so we can use TS with mongoose
userAddressSchema.statics.build = (attrs: UserAddressAttrs) => {
  return new UserAddress(attrs);
};

const UserAddress = mongoose.model<UserAddressDoc, UserAddressModel>(
  "UserAddress",
  userAddressSchema
);
export { UserAddress };
