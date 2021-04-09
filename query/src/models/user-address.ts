import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface UserAddressAttrs {
  id: string;
  location: {
    type: string;
    coordinates: number[];
  };
}

interface UserAddressDoc extends mongoose.Document {
  version: number;
  location: {
    type: string;
    coordinates: number[];
  };
}

interface UserAddressModel extends mongoose.Model<UserAddressDoc> {
  build(attrs: UserAddressAttrs): UserAddressDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<UserAddressDoc | null>;
}

const userAddressSchema = new mongoose.Schema(
  {
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: {
        required: [true, 'The geolocation is required'],
        type: [Number],
        index: '2dsphere',
      },
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

userAddressSchema.set('versionKey', 'version');
userAddressSchema.plugin(updateIfCurrentPlugin);

// Find a Record based on Event
// Used to handle OOC
userAddressSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return UserAddress.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

userAddressSchema.statics.build = (attrs: UserAddressAttrs) => {
  // We manually add each field here because if we dont assign the _id
  // We will get a record with both id and _id
  return new UserAddress({
    _id: attrs.id,
    location: attrs.location,
  });
};
const UserAddress = mongoose.model<UserAddressDoc, UserAddressModel>(
  'UserAddress',
  userAddressSchema,
);

export { UserAddress };
