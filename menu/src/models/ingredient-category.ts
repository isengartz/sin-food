import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

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
      unique: [true, 'Ingredient Category name must be unique'],
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

ingredientCategorySchema.set('versionKey', 'version');
ingredientCategorySchema.plugin(updateIfCurrentPlugin);

ingredientCategorySchema.statics.build = (attrs: IngredientCategoryAttrs) => {
  return new IngredientCategory(attrs);
};

// If someone remove the category - Remove the ingredients too
ingredientCategorySchema.pre<IngredientCategoryDoc>('remove', async function (
  next,
) {
  const ingredientModel = mongoose.model('Ingredient');
  await ingredientModel.deleteMany({ category: this._id });
  next();
});

const IngredientCategory = mongoose.model<
  IngredientCategoryDoc,
  IngredientCategoryModel
>('Ingredient_Category', ingredientCategorySchema);

export { IngredientCategory };
