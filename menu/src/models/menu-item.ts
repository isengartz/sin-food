import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { IngredientDoc } from './ingredient';

export interface VariationInterface {
  name: string;
  price: number;
}

export interface ExtraGroupsInterfaces {
  title: string;
  ingredients: IngredientDoc[];
}

export interface MenuItemAttrs {
  name: string;
  userId: string;
  description: string;
  base_price: number;
  menu_category: string;
  variations: VariationInterface[];
  main_ingredients: string[];
  extra_ingredient_groups: ExtraGroupsInterfaces[];
  image?: string;
}

export interface MenuItemDoc extends mongoose.Document {
  name: string;
  userId: string;
  description: string;
  base_price: number;
  menu_category: string;
  variations: VariationInterface[];
  main_ingredients: string[];
  extra_ingredient_groups: ExtraGroupsInterfaces[];
  image: string;
  version: number;
}

export interface MenuItemModel extends mongoose.Model<MenuItemDoc> {
  build(attrs: MenuItemAttrs): MenuItemDoc;
}

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Title is required'],
    },
    userId: {
      type: String,
      required: [true, 'User Id is required'],
    },
    description: {
      type: String,
    },
    base_price: {
      type: Number,
      required: [true, 'Base Item price is required'],
    },
    menu_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu_Item_Category',
      required: [true, 'Menu item category is required'],
    },
    variations: [
      {
        name: String,
        price: Number,
      },
    ],
    main_ingredients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
      },
    ],
    extra_ingredient_groups: [
      {
        title: String,
        ingredients: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient',
          },
        ],
      },
    ],
    image: {
      type: String,
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

menuItemSchema.index({ name: 1, userId: 1 }, { unique: true });

// Wire version
menuItemSchema.set('versionKey', 'version');
menuItemSchema.plugin(updateIfCurrentPlugin);

menuItemSchema.statics.build = (attrs: MenuItemAttrs) => {
  return new MenuItem(attrs);
};

const MenuItem = mongoose.model<MenuItemDoc, MenuItemModel>(
  'Menu_Item',
  menuItemSchema,
);

export { MenuItem };
