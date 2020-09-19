import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
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
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  addresses: {
    type: [
      {
        description: String,
        floor: String,
        full_address: String,
        latitude: String,
        longitude: String,
      },
    ],
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  password_changed_at: {
    type: Date,
  },
  password_reset_token: String,
  password_reset_expires: Date,
});
const User = mongoose.model("User", userSchema);
export { User };
