import mongoose from "mongoose";
import validator from "validator";
import { Password } from "@sin-nombre/sinfood-common";
import { UserAddressDoc } from "./user_address";

// Describes the attributes that we accept from Request
interface UserAttrs {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  addresses?: UserAddressDoc[];
  phone: string;
}
// Describes the actual Document returned by Mongoose
interface UserDoc extends mongoose.Document {
  id: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  addresses: UserAddressDoc[];
  phone: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  // eslint-disable-next-line no-unused-vars
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: "Provide a valid Email",
      },
      unique: [true, "Email already in use. Use a different one."],
      required: [true, "Email is required"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    first_name: {
      type: String,
      required: [true, "First Name is required"],
    },
    last_name: {
      type: String,
      required: [true, "Last Name is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAddress",
      },
    ],

    created_at: {
      type: Date,
      default: Date.now(),
    },
    password_changed_at: {
      type: Date,
    },
    password_reset_token: String,
    password_reset_expires: Date,
  },
  {
    toJSON: {
      // overriding the document of user
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.created_at;
        delete ret.password_changed_at;
        delete ret.password_reset_token;
        delete ret.password_reset_expires;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  next();
});

// Hack so we can use TS with mongoose
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };
