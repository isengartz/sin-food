import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface IngredientAttrs {
  id: string;
  price: number;
  name: string;
}

export interface IngredientDoc extends mongoose.Document {
  id: string;
  price: number;
  name: string;
  version: number;
}

interface IngredientModel extends mongoose.Model<IngredientDoc> {
  build(attrs: IngredientAttrs): IngredientDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<IngredientDoc | null>;
}

const ingredientSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    name: {
      type: String,
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

ingredientSchema.set('versionKey', 'version');
ingredientSchema.plugin(updateIfCurrentPlugin);

ingredientSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Ingredient.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ingredientSchema.statics.build = (attrs: IngredientAttrs) => {
  return new Ingredient({
    _id: attrs.id,
    price: attrs.price,
    name: attrs.name,
  });
};

const Ingredient = mongoose.model<IngredientDoc, IngredientModel>(
  'Ingredient',
  ingredientSchema,
);

export { Ingredient };
