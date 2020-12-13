import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface VariationInterface {
  name: string;
  price: number;
}
export interface MenuItemAttrs {
  id: string;
  name: string;
  base_price: number;
  variations: VariationInterface[];
}

export interface MenuItemDoc extends mongoose.Document {
  name: string;
  base_price: number;
  variations: VariationInterface[];
  version: number;
}

export interface MenuItemModel extends mongoose.Model<MenuItemDoc> {
  build(attrs: MenuItemAttrs): MenuItemDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<MenuItemDoc | null>;
}

const menuItemSchema = new mongoose.Schema(
  {
    base_price: {
      type: Number,
      required: true,
      min: 0,
    },
    name: String,
    variations: [
      {
        name: String,
        price: Number,
      },
    ],
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

menuItemSchema.set('versionKey', 'version');
menuItemSchema.plugin(updateIfCurrentPlugin);

menuItemSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return MenuItem.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

menuItemSchema.statics.build = (attrs: MenuItemAttrs) => {
  return new MenuItem({
    _id: attrs.id,
    name: attrs.name,
    base_price: attrs.base_price,
    variations: attrs.variations,
  });
};

const MenuItem = mongoose.model<MenuItemDoc, MenuItemModel>(
  'Menu_Item',
  menuItemSchema,
);

export { MenuItem };
