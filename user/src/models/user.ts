/* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import { randomBytes, createHash } from "crypto";
import validator from "validator";
import { Password, UserRole } from "@sin-nombre/sinfood-common";
import { UserAddressDoc } from "./user_address";

// Describes the attributes that we accept from Request
export interface UserAttrs {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  addresses?: UserAddressDoc[];
  phone: string;
  role?: UserRole;
}
// Describes the actual Document returned by Mongoose
export interface UserDoc extends mongoose.Document {
  id: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  addresses: UserAddressDoc[];
  phone: string;
  role: UserRole;
  password_reset_token?: string;
  password_reset_expires?: number;
  password_changed_at?: number;
  createPasswordResetToken(): string;
  changedPasswordAfter(JWTTimestamp: number): boolean;
}

interface UserModel extends mongoose.Model<UserDoc> {
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
      validate: {
        validator: function (v: string) {
          return validator.isMobilePhone(v, "any", {
            strictMode: true,
          });
        },
        message: "Provide a valid phone",
      },
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAddress",
      },
    ],
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
      default: UserRole.User,
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
      // overriding the document of user
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Hash password before Save
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  next();
});

// If updated password add the passwordChangedAt field too
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  // @ts-ignore
  this.password_changed_at = Date.now() - 1000;
  next();
});

// Checks if a password was changed after a given timestamp
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
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
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = randomBytes(32).toString("hex");

  this.password_reset_token = createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.password_reset_expires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre("remove", async function (next) {
  const UserAddress = mongoose.model("UserAddress");

  await UserAddress.remove({
    _id: {
      // @ts-ignore
      $in: this.addresses,
    },
  });
  next();
});

// Hack so we can use TS with mongoose
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };
