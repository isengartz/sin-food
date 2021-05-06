import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { UserRole } from '@sin-nombre/sinfood-common';

interface UserAttrs {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole;
}

interface UserDoc extends mongoose.Document {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  findByEvent(event: { id: string; version: number }): Promise<UserDoc | null>;
}

const UserSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
      default: UserRole.User,
    },
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

UserSchema.set('versionKey', 'version');
UserSchema.plugin(updateIfCurrentPlugin);

// Find a Record based on Event
// Used to handle OOC
UserSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return User.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

UserSchema.statics.build = (attrs: UserAttrs) => {
  // We manually add each field here because if we dont assign the _id
  // We will get a record with both id and _id
  return new User({
    _id: attrs.id,
    first_name: attrs.first_name,
    last_name: attrs.last_name,
    email: attrs.email,
    phone: attrs.phone,
    role: attrs.role,
  });
};
const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);

export { User };
