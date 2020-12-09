import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { IngredientDoc } from './ingredient';
import { natsWrapper } from '../events/nats-wrapper';
import { MenuItemDeletedPublisher } from '../events/publishers/menu-item-deleted-publisher';
import { MenuItemCreatedPublisher } from '../events/publishers/menu-item-created-publisher';
import { MenuItemUpdatedPublisher } from '../events/publishers/menu-item-updated-publisher';

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

// Add wasNew flag so we can do the check inside post middleware
menuItemSchema.pre<IngredientDoc>('save', function (next) {
  // @ts-ignore
  this.wasNew = this.isNew;
  next();
});

// Publish an Event on create and update
menuItemSchema.post<MenuItemDoc>('save', async function (doc, next) {
  if (doc.wasNew) {
    new MenuItemCreatedPublisher(natsWrapper.client).publish({
      id: doc._id,
      base_price: doc.base_price,
      variations: doc.variations,
    });
  } else {
    new MenuItemUpdatedPublisher(natsWrapper.client).publish({
      id: doc._id,
      base_price: doc.base_price,
      variations: doc.variations,
      version: doc.version,
    });
  }
  // @ts-ignore
  next();
});

// This is fired only when Ingredient is getting deleted
menuItemSchema.post<MenuItemDoc>('updateMany', async function (doc, next) {
  new MenuItemUpdatedPublisher(natsWrapper.client).publish({
    id: doc._id,
    base_price: doc.base_price,
    variations: doc.variations,
    version: doc.version,
  });
  // @ts-ignore
  next();
});

// Publish an Event on delete
menuItemSchema.post<MenuItemDoc>('remove', async function (doc, next) {
  new MenuItemDeletedPublisher(natsWrapper.client).publish({
    id: doc._id,
    version: doc.version,
  });
  // @ts-ignore
  next();
});

const MenuItem = mongoose.model<MenuItemDoc, MenuItemModel>(
  'Menu_Item',
  menuItemSchema,
);

export { MenuItem };
