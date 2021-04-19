import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { IngredientDeletedPublisher } from '../events/publishers/ingredient-deleted-publisher';
import { natsWrapper } from '../events/nats-wrapper';
import { IngredientUpdatedPublisher } from '../events/publishers/ingredient-updated-publisher';
import { IngredientCreatedPublisher } from '../events/publishers/ingredient-created-publisher';
// eslint-disable-next-line import/no-cycle
import { MenuItemDoc } from './menu-item';

export interface IngredientAttrs {
  userId: string;
  name: string;
  category: string;
  defaultPrice: number;
}

export interface IngredientDoc extends mongoose.Document {
  userId: string;
  name: string;
  category: string;
  defaultPrice: number;
  version: number;
}

export interface IngredientModel extends mongoose.Model<IngredientDoc> {
  build(attrs: IngredientAttrs): IngredientDoc;
}

const ingredientSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User Id is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    defaultPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient_Category',
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
// Make name/userId combination unique
ingredientSchema.index({ name: 1, userId: 1 }, { unique: true });

// Wire version
ingredientSchema.set('versionKey', 'version');
ingredientSchema.plugin(updateIfCurrentPlugin);

ingredientSchema.statics.build = (attrs: IngredientAttrs) => {
  return new Ingredient(attrs);
};

// Add wasNew flag so we can do the check inside post middleware
ingredientSchema.pre<IngredientDoc>('save', function (next) {
  // @ts-ignore
  this.wasNew = this.isNew;
  next();
});

// Publish an Event on Create and Update
ingredientSchema.post<IngredientDoc>('save', async function (doc, next) {
  if (doc.wasNew) {
    new IngredientCreatedPublisher(natsWrapper.client).publish({
      id: doc._id,
      price: doc.defaultPrice,
      name: doc.name,
    });
  } else {
    new IngredientUpdatedPublisher(natsWrapper.client).publish({
      id: doc._id,
      price: doc.defaultPrice,
      version: doc.version,
      name: doc.name,
    });
  }

  next();
});

// Publish an Event on delete
ingredientSchema.post<IngredientDoc>('remove', async function (doc, next) {
  new IngredientDeletedPublisher(natsWrapper.client).publish({
    id: doc._id,
    version: doc.version,
  });
  next();
});

// If someone remove the Ingredient . Detach relations from Menu Item

// Remove the ingredient from main_ingredients
ingredientSchema.post<IngredientDoc>('remove', async function (doc, next) {
  const menuItemModel = mongoose.model<MenuItemDoc>('Menu_Item');
  await menuItemModel.updateMany(
    { main_ingredients: { $in: doc._id } },
    {
      $pull: {
        main_ingredients: doc._id,
      },
    },
  );
  next();
});

// Remove the ingredient from extra_ingredient_groups
ingredientSchema.post<IngredientDoc>('remove', async function (doc, next) {
  const menuItemModel = mongoose.model<MenuItemDoc>('Menu_Item');
  await menuItemModel.updateMany(
    { 'extra_ingredient_groups.ingredients': { $in: doc._id } },
    {
      $pull: {
        // @ts-ignore
        'extra_ingredient_groups.$[].ingredients': doc._id,
      },
    },
  );
  next();
});

const Ingredient = mongoose.model<IngredientDoc, IngredientModel>(
  'Ingredient',
  ingredientSchema,
);

export { Ingredient };
