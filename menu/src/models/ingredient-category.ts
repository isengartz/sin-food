import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { IngredientDoc } from './ingredient';

export interface IngredientCategoryAttrs {
  userId: string;
  name: string;
}

export interface IngredientCategoryDoc extends mongoose.Document {
  userId: string;
  name: string;
}

export interface IngredientCategoryModel
  extends mongoose.Model<IngredientCategoryDoc> {
  build(attrs: IngredientCategoryAttrs): IngredientCategoryDoc;
}

const ingredientCategorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User id is required'],
    },
    name: {
      type: String,
      required: [true, 'Ingredient Category name is required'],
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
ingredientCategorySchema.index({ name: 1, userId: 1 }, { unique: true });
ingredientCategorySchema.set('versionKey', 'version');
ingredientCategorySchema.plugin(updateIfCurrentPlugin);

ingredientCategorySchema.statics.build = (attrs: IngredientCategoryAttrs) => {
  return new IngredientCategory(attrs);
};

// If someone remove the category - Remove the ingredients too

ingredientCategorySchema.post<IngredientCategoryDoc>(
  'remove',
  async function (doc, next) {
    const ingredientModel = mongoose.model('Ingredient');
    // @ts-ignore
    const ingredients: IngredientDoc[] = await ingredientModel.find({
      category: doc._id,
    });
    ingredients.forEach(async (ingredient) => {
      await ingredient.remove();
    });
    next();
  },
);

const IngredientCategory = mongoose.model<
  IngredientCategoryDoc,
  IngredientCategoryModel
>('Ingredient_Category', ingredientCategorySchema);

export { IngredientCategory };
