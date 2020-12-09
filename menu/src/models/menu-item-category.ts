import mongoose from 'mongoose';
import { MenuItemDoc } from './menu-item';

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
menuItemCategorySchema.post<MenuItemCategoryDoc>(
  'remove',
  async function (doc) {
    const menuItemModel = mongoose.model('Menu_Item');

    // @ts-ignore
    const menuItems: MenuItemDoc[] = await menuItemModel.find({
      menu_category: doc._id,
    });
    menuItems.forEach(async (item) => {
      await item.remove();
    });
  },
);

const MenuItemCategory = mongoose.model<
  MenuItemCategoryDoc,
  MenuItemCategoryModel
>('Menu_Item_Category', menuItemCategorySchema);

export { MenuItemCategory };
