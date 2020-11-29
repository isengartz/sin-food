import mongoose from 'mongoose';

export interface MenuItemCategoryAttrs {
  name: string;
  userId: string;
}

export interface MenuItemCategoryDoc extends mongoose.Document {
  name: string;
  userId: string;
}

export interface MenuItemCategoryModel
  extends mongoose.Model<MenuItemCategoryDoc> {
  build(attrs: MenuItemCategoryAttrs): MenuItemCategoryDoc;
}

const menuItemCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category Name is required'],
    },
    userId: {
      type: String,
      required: [true, 'User Id is required'],
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

menuItemCategorySchema.index({ name: 1, userId: 1 }, { unique: true });

menuItemCategorySchema.statics.build = (attrs: MenuItemCategoryAttrs) => {
  return new MenuItemCategory(attrs);
};
// If someone remove the category - Remove the MenuItem too
menuItemCategorySchema.pre<MenuItemCategoryDoc>('remove', async function (
  next,
) {
  const menuItemModel = mongoose.model('Menu_Item');
  await menuItemModel.deleteMany({ category: this._id });
  next();
});

const MenuItemCategory = mongoose.model<
  MenuItemCategoryDoc,
  MenuItemCategoryModel
>('Menu_Item_Category', menuItemCategorySchema);

export { MenuItemCategory };
