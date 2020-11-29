import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

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

const Ingredient = mongoose.model<IngredientDoc, IngredientModel>(
  'Ingredient',
  ingredientSchema,
);

export { Ingredient };
