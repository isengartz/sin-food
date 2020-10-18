import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const PointSchema = new mongoose.Schema({
  type: { type: String, enum: ["Point"], default: "Point" },
  coordinates: {
    type: [Number],
    index: "2dsphere",
  },
});

// Describes the attributes that we accept from Request
export interface UserAddressAttrs {
  description: string;
  floor: string;
  full_address: string;
  location: {
    type: string;
    coordinates: number[];
  };
  user_id: mongoose.Schema.Types.ObjectId | string;
}

// Describes the actual Document returned by Mongoose
export interface UserAddressDoc extends mongoose.Document {
  description: string;
  floor: string;
  full_address: string;
  location: {
    type: string;
    coordinates: number[];
  };
  version: number;
  user_id: mongoose.Schema.Types.ObjectId | string;
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
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
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

// Add address tp user Document
userAddressSchema.pre("save", async function (next) {
  const User = mongoose.model("User");
  // @ts-ignore
  await User.findByIdAndUpdate(this.user_id, {
    $push: {
      addresses: this._id,
    },
  });

  next();
});

// Remove address from user Document
userAddressSchema.pre("remove", async function (next) {
  const User = mongoose.model("User");
  // @ts-ignore
  await User.findByIdAndUpdate(this.user_id, {
    $pull: {
      addresses: this._id,
    },
  });

  next();
});
const UserAddress = mongoose.model<UserAddressDoc, UserAddressModel>(
  "UserAddress",
  userAddressSchema
);
export { UserAddress };
